# SkillSync: A Student Platform for Learning, Networking and Collaboration 🎓

SkillSync is a comprehensive institutional web platform engineered for engineering college campuses to facilitate peer networking, structured mentorship, verifiable milestone roadmaps, collaborative projects, study circles, student societies, and academic community moderation.

Built as an academic **System Analysis & Design (SAD) Lab Project**, SkillSync provides a role-governed, clean, responsive platform with zero third-party AI compute overhead, zero credit-trading fiction, and zero video streaming bloat.

---

## 🌟 Key Features & Architectural Modules

### 1. Student (`student`)
- **Academic Profile:** Department, graduation year, mastered skills, learning interests, and privacy settings (`public` vs. `connections only`).
- **Learning Goals & Progress Tracker:** Set skill learning targets with milestone checklists; SVG progress rings dynamically recalculate completion percentages.
- **SkillSync Match (Stage C):** Deterministic 0–100 matching engine that scores peer compatibility based on shared goals (35 pts), complementary skills (30 pts), department/year alignment (15 pts), verified ratings (10 pts), and platform badges (10 pts). Features natural-language explanation synthesis and a 1-click "Connect for this goal" workflow.
- **Peer Networking:** Search campus members by name, skill, interest, or department. Send/receive connection requests with optional notes.
- **1-on-1 Real-Time Chat:** Firestore `onSnapshot` messaging strictly gated to confirmed connections, complete with unread count badges.
- **Mentor Roadmaps (Stage D):** Once mentorship is accepted, collaborate on multi-week roadmaps. Submit milestone deliverables with proof links (GitHub PRs, Google Drive reports), receive written mentor feedback, and synchronize progress directly with your learning goals.
- **Rate Completed Mentorship:** Submit a verified 1-5 star rating and testimonial once all roadmap milestones are approved and marked complete. Unlocks the **Course Completer** badge.
- **Project Collaboration:** Browse open and restricted student projects; join open projects or submit join requests for creator review.
- **Study Groups:** Join study circles, review schedule notes, access Google Meet/Zoom links, and collaborate on shared notes.
- **Clubs & Events:** Follow campus societies, view announcements, and RSVP for hackathons/workshops with real-time capacity counters.
- **SkillSync Help Assistant (Stage E):** Floating chatbot with Tier 1 instant intent matcher (how-to guides, navigation, role explainers, user stats, and recommendations) and optional Tier 2 Gemini Flash integration.

### 2. Senior Student (`senior`)
- All student capabilities, plus:
- **Curated Resource Sharing:** Contribute educational courses, documentation roadmaps, and videos directly to the campus library.
- **Mentorship Management:** Accept or decline student guidance requests, set Google Meet/Zoom virtual links.
- **Interactive Roadmap Review:** Review student milestone submissions, approve deliverables or request revisions with written feedback.
- **Reputation & Ratings:** Cumulative star rating (1 to 5 stars) and student reviews displayed publicly on profile.
- **Lead Projects:** Create and govern student collaboration projects, approving or rejecting join applicants.

### 3. University Faculty (`faculty`)
- Registration requires **Admin Approval** (held in `pending` status until verified).
- Provide official academic mentorship, verify departmental competencies, and guide research project roadmaps.
- Publish verified learning roadmaps, articles, and documentation to the university library.
- Display verified academic faculty badge across the platform.

### 4. Club Coordinator (`clubCoordinator`)
- Registration requires **Admin Approval** (held in `pending` status until verified).
- **Dedicated Coordinator Hub (`/coordinator`):**
  - Manage campus club profile, description, and categories.
  - Broadcast official announcements to club followers.
  - Create and schedule campus events, workshops, and hackathons with seat limits.
  - Monitor real-time attendee counts, registration rosters, or cancel events.

### 5. Administrator (`admin`)
- **Central Administrative Control Center (`/admin`):**
  - **User Management:** Search all campus accounts, approve pending faculty & club coordinators, change user roles, and suspend/reactivate accounts.
  - **Content Moderation:** Review and delete flagged posts or cancelled events.
  - **Reports Queue:** Process user reports (spam, harassment, misinformation, inappropriate) with structured resolution actions.
  - **Immutable Audit Trail:** All administrative decisions (role approvals, suspensions, deletions) are recorded in `moderationLogs`.

---

## 🏆 Automated Milestone Badges

SkillSync awards badges automatically upon achieving key milestones (no credit tokens needed):
- 🤝 **First Connection:** Awarded when your first peer connection is accepted.
- 🎓 **Mentor:** Awarded to mentors when they accept their first guidance request.
- 📚 **Resource Sharer:** Awarded when you contribute your first learning resource.
- 🚀 **Project Starter:** Awarded when you create your first collaborative project.
- 🎟️ **Event Attendee:** Awarded when you confirm your first workshop or hackathon RSVP.
- 🏆 **Course Completer:** Awarded when all milestone tasks in a learning goal or mentor roadmap hit 100%.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript 5.8 |
| **Build & Tooling** | Vite 6, Tailwind CSS 4, PostCSS |
| **Routing & State** | React Router 7, Zustand 5 |
| **Backend & Cloud** | Firebase Authentication (Email/Pass + Google), Cloud Firestore |
| **Real-time Sync** | Firestore `onSnapshot` subscriptions (Chat, Notifications, Group Notes) |
| **Web Server** | Node.js with Express (`server.ts`) |
| **Design System** | Lucide React, Motion, custom responsive tokens |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 2. Environment Variables Configuration
Create a `.env` file in the root directory (based on `.env.example`):
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
# Firebase Client Configuration (From Firebase Console -> Project Settings -> General -> Web App)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Optional: Local Emulator Mode (defaults to false for live Cloud Firestore)
VITE_USE_FIREBASE_EMULATOR=false

# Optional: Gemini API Key for Tier 2 Chatbot (Server-side only, no VITE_ prefix)
# If omitted, Help Assistant operates in Tier 1 Deterministic Intent Matcher mode.
GEMINI_API_KEY=

# Optional: Seed data for an existing email account
# SEED_FOR_EMAIL=your.college.email@university.edu

# Server Port
PORT=3000
```

### 3. Deploying Firestore Security Rules and Indexes
To deploy the security rules and composite indexes to your active Firebase project, run:
```bash
# Deploy Firestore security rules
npx firebase-tools deploy --only firestore:rules

# Deploy Firestore composite indexes
npx firebase-tools deploy --only firestore:indexes
```

### 4. Database Seeding (Sample Data)
To populate demo users, realistic Indian student profiles across departments, mentor roadmaps, 1-on-1 chat threads, learning resources, hackathons, and moderation reports:
1. Place your Firebase Admin service account key at `scripts/service-account-key.json` (or root `serviceAccountKey.json`).
2. Run the seed script:
```powershell
npm run seed
```
> The seed script uses fixed document IDs, is completely idempotent and re-runnable, and seeds 5 role logins + pending faculty + 18 student profiles, roadmaps with mixed progress, and active conversations.

### 5. Running the Application
```bash
# Start development server with Hot Module Replacement
npm run dev

# Run unit tests (Intent Matcher test suite)
npm run test

# Type-check with TypeScript
npm run lint

# Compile production bundle
npm run build

# Start production server
npm start
```

---

## 👥 Demo Accounts for Lab Evaluation & Faculty Viva

SkillSync provides **1-Click Quick Demo Login** buttons directly on the `/login` screen for all roles. All demo accounts use the standard password `Password123!`:

| Persona | Email | Default Password | Role | Description |
|---|---|---|---|---|
| **Student** | `student@university.edu` | `Password123!` | `student` | Explores resources, sets goals, tracks roadmaps, requests mentors. |
| **Senior** | `senior@university.edu` | `Password123!` | `senior` | Reviews roadmaps, receives 5-star ratings, shares resources. |
| **Faculty** | `faculty@university.edu` | `Password123!` | `faculty` | Verified academic mentor; guides capstone and research roadmaps. |
| **Coordinator** | `coordinator@university.edu` | `Password123!` | `clubCoordinator` | Manages campus clubs, schedules hackathons, posts bulletins. |
| **Admin** | `admin@university.edu` | `Password123!` | `admin` | Full platform control: user verification, content moderation. |
| **Pending Faculty** | `prof.sharma@university.edu` | `Password123!` | `faculty` (pending) | Pending account to demonstrate admin approval workflow. |

---

## ✅ Comprehensive Manual Test Checklist per Role

### Test Suite 1: Registration, Login & Role Approval
- [ ] **Student Sign-Up:** Register at `/register` as "Student". Confirm direct redirect to `/dashboard` with immediate active status.
- [ ] **Faculty / Coordinator Approval Guard:** Register as "Faculty" or "Club Coordinator". Confirm notification card indicates *"Account Pending Approval"* and privileged routes are locked.
- [ ] **Admin Verification:** Log in with Admin account (`admin@university.edu`), navigate to `/admin`, select "User Management", click **Approve** on the pending account. Confirm user can now sign in and access full features.
- [ ] **Google Sign-In:** Test one-click Google Sign-In on `/login`. Confirm session persistence.

### Test Suite 2: SkillSync Match & Academic Networking
- [ ] **View Matches:** Navigate to `/network` or `/dashboard`. Confirm "SkillSync Match: Best Academic Matches" displays compatibility score pills (0-100) and plain-English reasons.
- [ ] **Connect for Goal:** Click "Connect for this goal" on a suggested peer. Verify request card populates with target learning goal and delivers an in-app notification.
- [ ] **Direct Real-Time Chat:** Navigate to `/messages`. Select a connected peer. Send a message. Confirm live receipt via Firestore `onSnapshot` with timestamp. Confirm non-connected users cannot be messaged.

### Test Suite 3: Mentor Roadmap & Goal Synchronization (Stage D)
- [ ] **Browse Ranked Mentors:** Open `/mentorship`. Verify mentors are sorted by match score with reasons and verified ratings.
- [ ] **Submit Roadmap Milestone Proof:** In "My Mentorships & Roadmaps", open an active session. Click "Submit Milestone Proof", enter a GitHub URL, and submit.
- [ ] **Mentor Milestone Review:** Log in as Senior mentor (`senior@university.edu`), open incoming requests, review the submitted milestone proof, and click "Approve Milestone" with written feedback.
- [ ] **Progress Sync & Badge:** Confirm roadmap progress bar updates, the student's linked learning goal syncs its percentage, and upon 100% approval, the **Course Completer** badge is awarded!
- [ ] **Complete Mentorship & Review:** Mentor marks the session completed, unlocking the student's verified 1-5 star review modal.

### Test Suite 4: SkillSync Help Assistant (Stage E)
- [ ] **Trigger Chatbot:** Click the floating "SkillSync Assistant" pill at the bottom-right corner.
- [ ] **Navigation & How-To Queries:** Ask "take me to events", "how to request a mentor", "how to join a restricted project", or "how to earn badges". Verify instant helpful response and one-click navigation buttons.
- [ ] **User Context:** Ask "my goal progress" or "my notifications". Verify assistant returns live user counts.
- [ ] **Mobile Sheet:** Open chat on mobile viewport. Confirm it expands into a full-height bottom sheet.

### Test Suite 5: Projects, Study Groups, Clubs & Events
- [ ] **Launch Project:** Visit `/projects`, create a project with team size 3 and open join policy. Verify **Project Starter** badge unlock.
- [ ] **Join Project Team:** As a peer, click **Join Project Now**. Confirm member roster updates.
- [ ] **Form Study Circle:** Go to `/study-groups`, create a group with schedule and Google Meet link. Edit notes and verify collaborative saving.
- [ ] **Coordinator Hub:** Log in as Club Coordinator, visit `/coordinator`. Create a hackathon with capacity 50.
- [ ] **Student RSVP:** As a student, open `/events`, click **RSVP Now**. Confirm seat counter decrements and **Event Attendee** badge is awarded.

### Test Suite 6: Community Feed & Moderation
- [ ] **Publish Post:** Go to `/feed`, post an academic question with a link.
- [ ] **Report Content:** As another student, click the Flag icon on the post, choose "Inappropriate", and submit.
- [ ] **Admin Resolution:** Log in as Admin, visit `/admin` &rarr; "Moderation Reports", click **Resolve & Action**, and enter resolution. Verify reporter receives a resolution notification and action is recorded in the Audit Log.
