/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * SkillSync development / production server.
 *
 * Combines an Express HTTP server with Vite (in dev) or static file serving (in prod).
 * Real-time messaging and collaborative group updates are handled via Cloud Firestore onSnapshot.
 * Includes Stage E Help Assistant Tier 2 endpoint (POST /api/chat).
 */

import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { createServer } from 'vite';
import dotenv from 'dotenv';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

dotenv.config();

const DEFAULT_PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const rootDir = process.cwd();

// Constant for current Gemini Flash model from official docs
const GEMINI_MODEL = 'gemini-1.5-flash';
const MAX_MSG_LENGTH = 1000;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 20;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Optional modular firebase-admin initialization for token verification
let adminAuth: any = null;
const possibleKeyPaths = [
  path.join(rootDir, 'scripts', 'service-account-key.json'),
  path.join(rootDir, 'service-account-key.json'),
  path.join(rootDir, 'serviceAccountKey.json'),
];

for (const p of possibleKeyPaths) {
  if (fs.existsSync(p)) {
    try {
      const sa = JSON.parse(fs.readFileSync(p, 'utf8'));
      if (!getApps().length) {
        initializeApp({ credential: cert(sa) });
      }
      adminAuth = getAuth();
      break;
    } catch {
      // Continue if invalid
    }
  }
}

async function createAppServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Body parsing for JSON API requests
  app.use(express.json({ limit: '1mb' }));

  // ==========================================
  // Stage E: Help Assistant Endpoints
  // ==========================================

  // Chat status check
  app.get('/api/chat/status', (_req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim());
    res.json({
      tier2Enabled: hasKey,
      model: GEMINI_MODEL,
    });
  });

  // Chat endpoint (Tier 2 with fallback)
  app.post('/api/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;

    // If API key is missing, silently signal client to use Tier 1
    if (!apiKey || !apiKey.trim()) {
      return res.status(200).json({ ok: false, fallbackToTier1: true, reason: 'Gemini API not configured' });
    }

    // 1. Verify Firebase ID Token
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    let userUid = 'anonymous_client';

    if (adminAuth && token) {
      try {
        const decoded = await adminAuth.verifyIdToken(token);
        userUid = decoded.uid;
      } catch (authErr: any) {
        console.warn('[Server Chat] Token verification failed:', authErr.message);
        return res.status(401).json({ ok: false, fallbackToTier1: true, error: 'Unauthorized token' });
      }
    } else if (!token && isProduction) {
      return res.status(401).json({ ok: false, fallbackToTier1: true, error: 'Authorization header required' });
    }

    // 2. Rate limiting check (20 requests per 10 minutes)
    const now = Date.now();
    const userRate = rateLimitMap.get(userUid);
    if (userRate) {
      if (now > userRate.resetAt) {
        rateLimitMap.set(userUid, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
      } else if (userRate.count >= MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({
          ok: false,
          fallbackToTier1: true,
          error: 'Rate limit reached (20 requests per 10 minutes). Falling back to Tier 1.',
        });
      } else {
        userRate.count += 1;
      }
    } else {
      rateLimitMap.set(userUid, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    }

    // 3. Message validation
    const { message, context } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ ok: false, fallbackToTier1: true, error: 'Message string is required' });
    }
    if (message.length > MAX_MSG_LENGTH) {
      return res.status(400).json({
        ok: false,
        fallbackToTier1: true,
        error: `Message exceeds limit of ${MAX_MSG_LENGTH} characters`,
      });
    }

    // 4. Safe Context Isolation: Only send role, skills, and goals. Never emails or private data.
    const safeRole = typeof context?.role === 'string' ? context.role : 'student';
    const safeSkills = Array.isArray(context?.skills)
      ? context.skills.filter((s: any) => typeof s === 'string').slice(0, 8)
      : [];
    const safeGoals = Array.isArray(context?.goals)
      ? context.goals.filter((g: any) => typeof g === 'string').slice(0, 5)
      : [];

    const systemPrompt = `You are SkillSync Assistant, a helpful assistant for college students about studying, skills, careers and using SkillSync. Be concise and practical. Never invent nonexistent features or links. If unsure, say so. Do not discuss personal emails or other users' private data.
Context: Student Role: ${safeRole}. Skills: ${safeSkills.join(', ') || 'General'}. Goals: ${safeGoals.join(', ') || 'Academic learning'}.`;

    // 5. Call Gemini REST API with 10-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nStudent question: ${message}` }],
          },
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 500,
        },
      };

      const response = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn('[Gemini REST API Warning] Status:', response.status);
        return res.status(200).json({ ok: false, fallbackToTier1: true });
      }

      const data: any = await response.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!reply) {
        return res.status(200).json({ ok: false, fallbackToTier1: true });
      }

      return res.json({ ok: true, reply: reply.trim(), tier: 'tier2' });
    } catch (fetchErr: any) {
      clearTimeout(timeoutId);
      console.warn('[Server Chat] Gemini fetch aborted or timed out:', fetchErr.message);
      return res.status(200).json({ ok: false, fallbackToTier1: true });
    }
  });

  // ==========================================
  // Client Serving / Vite Middlewares
  // ==========================================
  if (isProduction) {
    // Serve the built client assets.
    app.use(express.static(path.join(rootDir, 'dist')));
    // SPA fallback so client-side routes resolve.
    app.get('*', (_req, res) => {
      res.sendFile(path.join(rootDir, 'dist', 'index.html'));
    });
  } else {
    // Development: let Vite handle HMR + transforms via middleware.
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  let activePort = DEFAULT_PORT;

  httpServer.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${activePort} is in use, attempting port ${activePort + 1}...`);
      activePort += 1;
      setTimeout(() => {
        httpServer.listen(activePort, '0.0.0.0');
      }, 200);
    } else {
      console.error('Server error:', err);
    }
  });

  httpServer.listen(activePort, '0.0.0.0', () => {
    console.log(`\n🚀 SkillSync server running at http://localhost:${activePort}\n`);
  });
}

createAppServer();
