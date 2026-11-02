# SkillSync: Requirements Specification (SRS)
*A Student Platform for Learning, Networking, and Collaboration*
*Academic System Analysis & Design (SAD) Lab Project*

---

## 1. System Vision & Objective
SkillSync is an all-in-one institutional student platform designed to bridge the gaps in peer learning, academic networking, student mentorship, project collaboration, campus club activities, and community moderation.

Unlike generic social networks or commercial course repositories, SkillSync is role-governed, academically contextualized, and provides end-to-end functionality across five major student life pillars:
1. **Account & Profile Management** with academic department/year metadata, privacy controls, and automated badge achievements.
2. **Learning & Skill Development** with curated learning resources, personalized learning goals, rule-based recommendations, and progress tracking.
3. **Networking & Mentorship** with skill-based peer discovery, connection requests, structured mentorship requests, completion ratings/reviews, and real-time 1-to-1 messaging.
4. **Collaboration, Clubs & Events** with multi-member project boards, collaborative study groups with shared notes and meeting links, campus club hubs, and event registration.
5. **Community & Administration** with an academic feed, report moderation, role approvals, and administrative audit logs.

---

## 2. User Roles & Permission Matrix

SkillSync defines five distinct user roles:

| Role | Sign-Up Flow | Approval Needed | Key Permissions |
|---|---|---|---|
| **Student** | Direct registration | None (immediate active status) | Browse & search resources, set learning goals, connect with peers, request mentorship, chat with connections, create/join projects & study groups, follow clubs, register for events, post to community feed, report posts. |
| **Senior** | Direct registration | None (immediate active status) | All Student capabilities + share curated learning resources, accept/reject mentorship requests from students, guide projects, receive mentorship ratings. |
| **Faculty** | Registration with role selection | **Admin Approval Required** (starts in `pending` status) | All Student & Senior capabilities + add learning resources, mentor students, guide academic projects, publish campus announcements, verify academic skills. |
| **Club Coordinator** | Registration with role selection | **Admin Approval Required** (starts in `pending` status) | All Student capabilities + access `/coordinator` portal, manage club profile, create/update/cancel events, manage event capacity & registrations, broadcast announcements. |
| **Admin** | Initialized via Seed script / Firestore CLI | Pre-configured | Full platform control: approve/reject pending faculty & coordinators, change user roles, suspend/reactivate users, manage all content, review reports, dismiss/remove reported items, view moderation logs. |

---

## 3. Detailed Functional Requirements

### 3.1 Account and Profile Management (FR-01 – FR-05)
- **FR-01: Authentication Services**
  - Email and password registration with client and server-side validation.
  - Login with remember-me and secure session restoration.
  - Password reset with email verification flow via Firebase Auth.
  - Google Sign-In support for rapid university single-sign-on.
  - Secure logout clearing client-side state.
- **FR-02: User Registration & Onboarding**
  - Captures full name, email, role choice, department, graduation year, initial skills, interests, and bio.
  - Enforces `pending` status for Faculty and Club Coordinator roles until Admin approval.
- **FR-03: Profile Management & Privacy**
  - Users can view and edit their profile details: avatar photo URL, bio, department, academic year, skills mastered, skills learning, interests, and privacy settings.
  - Privacy controls: `public` (viewable by any logged-in user) vs. `connections` (detailed contact and activity only visible to accepted connections).
- **FR-04: Role Badges & Automatic Achievements**
  - Profiles display distinct role badges (Student, Senior, Faculty, Club Coordinator, Admin).
  - Automated system badges awarded based on milestone triggers:
    - *First Connection*: Awarded when first connection is accepted.
    - *Mentor*: Awarded when first mentorship request is accepted.
    - *Resource Sharer*: Awarded when user shares their first learning resource.
    - *Project Starter*: Awarded when user creates their first project.
    - *Event Attendee*: Awarded when user registers for their first event.
    - *Course Completer*: Awarded when all resources in a learning goal reach 100%.
- **FR-05: Mentor Ratings & Reviews Display**
  - Shows cumulative average star rating (1 to 5 stars) and review count on Senior and Faculty profiles.
  - Reviews list displays student comments and completion dates.

### 3.2 Learning and Skill Development (FR-06 – FR-11)
- **FR-06: Learning Resources Directory**
  - Centralized catalog of vetted learning resources with pagination, debounced text search, type filter (`course`, `video`, `article`, `documentation`, `roadmap`), and skill tags.
- **FR-07: Resource Contribution**
  - Authorized contributors (Senior, Faculty, Club Coordinator, Admin) can publish resources with title, description, external URL, resource type, difficulty level, and skill tags.
  - Students can share educational links directly via community feed posts.
- **FR-08: Personal Learning Goals**
  - Students can define skill learning goals with target completion dates and priority levels.
- **FR-09: Goal Progress Tracking**
  - Tracks progress status (`not_started`, `in_progress`, `completed`) and percentage calculation.
  - Allows linking catalog resources to specific goals, with individual checkbox completion toggles updating overall percentage.
- **FR-10: Rule-Based Recommendation Engine**
  - Matches student's declared learning goals and wanted skills against resource skill tags and peer skill sets without external AI APIs.
  - Ranks resources based on tag overlap and average peer ratings.
- **FR-11: Flashcard Study Decks (Self-Study)**
  - Creation of decks per skill/topic with front/back cards.
  - Public or private deck visibility.
  - Interactive 3D flip-card study interface with mastery marking (Needs Practice / Mastered).

### 3.3 Networking and Mentorship (FR-12 – FR-18)
- **FR-12: Peer & Mentor Discovery**
  - Search platform members by name, skill, interest, department, and academic year.
  - Filter by role (e.g., discover only available Seniors or Faculty for mentorship).
- **FR-13: Connection Request Lifecycle**
  - Send connection request with an optional note.
  - Recipient can accept or reject requests.
  - Connections tab showing active connections with direct chat shortcuts and remove-connection option.
- **FR-14: Structured Mentorship Program**
  - Students submit structured mentorship requests to Seniors or Faculty specifying the subject/topic, expectations, preferred meeting frequency, and introductory message.
- **FR-15: Mentorship Acceptance & Active Tracking**
  - Mentors can accept, reject, or mark mentorships as completed.
  - Optional virtual meeting link (Google Meet / Zoom URL) can be added and updated by the mentor.
- **FR-16: Mentorship Review & Rating System**
  - Once a mentorship is marked completed, the student is prompted to submit a 1-5 star rating and detailed written feedback.
  - Submissions update mentor's profile `ratingAverage` and `ratingCount`.
- **FR-17: Real-Time 1-to-1 Chat**
  - Firestore `onSnapshot` real-time messaging restricted exclusively between mutually accepted connections.
  - Includes message timestamps, sender avatars, and unread count badges.
- **FR-18: Peer Profile Modal / Detail View**
  - Rich view of a peer's academic background, shared connections, mentor ratings, and mutual skills.

### 3.4 Collaboration, Clubs and Events (FR-19 – FR-27)
- **FR-19: Project Collaboration Hub**
  - Create projects with title, synopsis, detailed description, required skill stack, team capacity, and access mode (`open` vs. `restricted`).
- **FR-20: Project Membership & Requests**
  - For open projects, users can join directly up to capacity.
  - For restricted projects, users submit a join request with a brief statement of qualification; project owner accepts or rejects.
  - Project members can view the roster, project repository link, and leave the project.
- **FR-21: Study Groups**
  - Create study groups around specific subjects or exams (e.g., "Algorithms & Data Structures Sprint").
  - Includes description, meeting schedule text, and an optional Google Meet/Zoom link.
- **FR-22: Study Group Collaboration**
  - Members can join/leave study groups.
  - Real-time group discussion thread backed by Firestore subcollection.
  - Shared plain-text notes area with "Last edited by [User] at [Timestamp]" tracking.
- **FR-23: Campus Clubs Directory**
  - Browse verified campus clubs (e.g., ACM Student Chapter, Robotics Club, Design Society, IEEE).
  - View club description, lead coordinators, member count, and past/upcoming events.
  - Follow/unfollow club to receive club announcement notifications.
- **FR-24: Club Announcements**
  - Coordinators publish pinned announcements to the club bulletin board.
- **FR-25: Campus Events & Hackathons**
  - Comprehensive events board categorized by: `hackathon`, `workshop`, `seminar`, `competition`, `meetup`, `other`.
  - Displays event date, time, location (physical or virtual meeting link), description, and max capacity.
- **FR-26: Event Registration & Attendance**
  - Users register for events with one-click RSVP.
  - Capacity counters automatically enforce limits.
  - Users receive instant in-app notification confirming registration and can unregister if unable to attend.
- **FR-27: Coordinator Event Management**
  - Club coordinators can create new events, edit details, cancel events, and download/view attendee rosters.

### 3.5 Community Feed & Moderation (FR-28 – FR-35)
- **FR-28: Academic Community Feed**
  - Chronological campus feed for sharing questions, learning milestones, project updates, and resource links.
  - Post creation with rich text description and optional resource hyperlink.
- **FR-29: Community Interactions**
  - Heart/Like toggle with optimistic updates and live counters.
  - Comment thread on posts with real-time updates.
  - Author can delete their own post or comments.
- **FR-30: Inappropriate Content Reporting**
  - Any user can flag a post or comment with a structured reason (`spam`, `harassment`, `misinformation`, `inappropriate`, `other`) and optional explanation.
  - Submits ticket into the Admin Moderation queue.
- **FR-31: Admin User Management**
  - Admin view with search, role filtering, and user status indicators (`active`, `pending`, `suspended`).
  - Approve or reject pending faculty and club coordinator accounts.
  - Change user roles and suspend or reactivate compromised accounts.
- **FR-32: Admin Content & Moderation Center**
  - Queue of reported posts and comments.
  - Review report details, reporter ID, and target content.
  - Actions: Remove offending content, dismiss report, or issue warning.
- **FR-33: Moderation Audit Trail**
  - Every administrative action (user approval, role change, content removal, ban) writes an immutable record to `moderationLogs` with timestamp and admin UID.
- **FR-34: In-App Notification Center**
  - Real-time notification drawer with unread counter.
  - Notifies on: connection requests/acceptances, mentorship requests/acceptances/completions, project join requests/approvals, event RSVPs, role approval outcomes, report resolutions, and badge awards.
  - "Mark as read" and "Mark all as read" functionality.
- **FR-35: Analytics & Dashboards**
  - Three distinct dashboards tailored to persona:
    1. **Student Dashboard** (`/dashboard`): Progress rings, quick links to goals, pending mentorships, upcoming registered events, recommended resources, suggested connections. Senior/Faculty switch view to mentees, guidance requests, ratings.
    2. **Coordinator Dashboard** (`/coordinator`): Club stats, active events, attendee counts, announcement composer.
    3. **Admin Dashboard** (`/admin`): System metrics (users by role, pending approvals count, open reports count, total posts/events), User Management, Content Moderation, Reports Queue, and Audit Log tabs.

---

## 4. Non-Functional Requirements (NFR)
1. **Performance**: Initial load under 2 seconds; client-side route transitions < 150ms. Search inputs debounced by 300ms.
2. **Security**: Firebase security rules strictly enforce role authorizations and user document ownership. No role self-escalation. Sensitive API keys kept in environment variables.
3. **Data Integrity**: Firestore transactions and batch writes ensure counters (e.g. event capacities, rating averages, unread messages) remain strictly synchronized.
4. **Usability & Accessibility**: Responsive across desktop (1024px+), tablet (768px-1023px), and mobile (320px-767px). WCAG AA contrast compliance, descriptive labels, keyboard accessible modals and menus.
5. **Maintainability**: Feature-sliced architecture (`src/features/*`), shared reusable design system (`src/components/ui/*`), strongly typed TypeScript models and Firestore services.
