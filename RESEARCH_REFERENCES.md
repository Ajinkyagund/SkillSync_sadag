# SkillSync: Research & Academic References

## 1. Core Technical Documentation
* **Firebase Cloud Firestore:** [firebase.google.com/docs/firestore](https://firebase.google.com/docs/firestore)
  * *Research:* Implemented composite queries, subcollections for message streams, real-time listeners (`onSnapshot`), and declarative Firestore Security Rules to prevent role self-escalation.
* **Firebase Authentication:** [firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)
  * *Research:* Dual provider authentication (Email/Password + Google OAuth) and session persistence.
* **React 19 & Vite 6 Documentation:** [react.dev](https://react.dev) | [vite.dev](https://vite.dev)
  * *Reference:* Single-Page Application (SPA) architecture with strict TypeScript contracts and fast Hot Module Replacement.
* **Tailwind CSS 4:** [tailwindcss.com](https://tailwindcss.com)
  * *Reference:* Utility-first design tokens, accessible color palettes, and responsive grid layouts.
* **Zustand State Management:** [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
  * *Reference:* Minimalist, unopinionated client state management avoiding excessive context re-renders.

---

## 2. Pedagogical & System Design References
* **Peer-to-Peer Learning & Academic Networking Models:**
  * Harvard Derek Bok Center for Teaching and Learning: *Peer Instruction and Cooperative Learning*. [bokcenter.harvard.edu/peer-learning](https://bokcenter.harvard.edu/peer-learning)
  * *Research Foundation:* Students demonstrate higher retention and comprehension when learning in collaborative circles and receiving mentor feedback from immediate seniors.
* **Active Recall and Spaced Retrieval:**
  * Karpicke, J. D., & Roediger, H. L. (2008). *The Critical Importance of Retrieval for Learning*. Science, 319(5865), 966-968.
  * *Application:* Guided the design of the Interactive Flashcards module, allowing students to test memory retention via digital flip-cards.
* **Role-Based Access Control (RBAC) in Educational Information Systems:**
  * Sandhu, R. S., Coyne, E. J., Feinstein, H. L., & Youman, C. E. (1996). *Role-based access control models*. IEEE Computer, 29(2), 38-47.
  * *Application:* Guided the five-tier role hierarchy (`student`, `senior`, `faculty`, `clubCoordinator`, `admin`) with strict client and server-side authorization boundaries.
* **Rule-Based Recommendation Systems:**
  * Resnick, P., & Varian, H. R. (1997). *Recommender systems*. Communications of the ACM, 40(3), 56-58.
  * *Application:* Applied set-intersection heuristics to pair student learning goals with curated learning resources and qualified peer mentors without external AI compute costs.
