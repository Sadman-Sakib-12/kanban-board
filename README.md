# Interactive Kanban Board

A modern, responsive Kanban Board application built with Next.js (App Router), Tailwind CSS, and TypeScript. 
This project was developed as a frontend internship task for SammTech Ltd.

## 🚀 Live Demo
[https://kanban-board-psi-fawn.vercel.app](https://kanban-board-psi-fawn.vercel.app)

## ✨ Features Implemented
**Core Features (100% Completed):**
- **Board Structure:** Default columns (Backlog, Todo, In Progress, Review, Done).
- **Task Cards:** Detailed task cards with Title, Description (rich text format), Assignee (with avatar), Colored Labels, Due Date, and Priority.
- **Drag & Drop:** Smooth drag-and-drop functionality using `@dnd-kit` to move cards between columns and reorder them within the same column.
- **Task Management:** Click to edit a task, add new tasks, or delete tasks using a clean Modal interface.
- **Search & Filter:** Instantly filter tasks by title, assignee name, label, or priority level.
- **Theme Support:** Dark and Light mode toggle that respects system preferences and persists.
- **Persistence:** All data is automatically saved to local storage so you don't lose your work on refresh.
- **Responsive:** Fully functional and touch-friendly on both mobile and desktop screens.

**Bonus Features (100% Completed):**
- **Add Custom Columns:** Users can dynamically add new columns to the board.
- **Undo / Redo:** Full undo/redo functionality for board actions (drag & drop, delete, add) using `Ctrl+Z` / `Ctrl+Y` and UI buttons.
- **Keyboard Shortcuts:** Press `N` to quickly open the new task modal. `Esc` to close modals.
- **Export / Import JSON:** Easily backup your board to a JSON file and restore it on any device.
- **Virtualized List:** Columns use `@tanstack/react-virtual` to efficiently render hundreds of tasks without performance degradation.
- **Real-time Syncing:** Uses the `BroadcastChannel` API to instantly sync drag-and-drop and state changes across multiple open browser tabs in real-time, simulating a collaborative backend.

## 🛠️ Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sadman-Sakib-12/kanban-board.git
   cd kanban-board
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧠 Technical Decisions
- **Framework (Next.js App Router):** Used for its modern architecture, excellent performance, and out-of-the-box optimizations. Kept strict separation of Client and Server components.
- **State Management (React Context):** I chose native React Context combined with local state over external libraries (like Redux) to keep the bundle size small and demonstrate core React proficiency. A custom hook ensures the state seamlessly syncs with `localStorage` and `BroadcastChannel`.
- **Drag & Drop (@dnd-kit):** Unlike `react-beautiful-dnd` (which is largely unmaintained and has issues with React Strict Mode), `@dnd-kit` is modern, highly accessible, modular, and works seamlessly with pointer/touch events.
- **Virtualization (@tanstack/react-virtual):** Integrated a virtualized list to ensure the drag-and-drop experience remains butter-smooth even if a column has thousands of tasks.
- **Styling (Tailwind CSS):** Used for rapid, custom UI development without relying on heavy external component libraries. This ensured maximum flexibility over the design aesthetics to create a sleek, responsive premium look.
- **Icons & Forms:** Utilized `lucide-react` for clean SVG icons and `react-hook-form` with `zod` for robust task modal validations.

## 🚧 Challenges Faced & Solutions
- **Hydration Mismatch with Local Storage:** Since Next.js renders on the server first, accessing `localStorage` directly causes hydration errors because the server HTML doesn't match the client HTML (which has the stored data). 
  - *Solution:* Implemented a mounted state pattern (`isLoaded` flag) in the context provider to ensure the initial render matches the server, and then loads the local storage data immediately after mounting.
- **Integrating Virtualization with Drag and Drop:** Rendering only visible items in a virtualized list can disrupt drag-and-drop libraries that expect DOM nodes for all draggable elements to exist.
  - *Solution:* Integrated the virtualization container tightly with `@dnd-kit`'s `SortableContext`, ensuring the active dragged item's dimensions and positions are correctly mapped and rendered dynamically via absolutely positioned rows.
- **Undo/Redo with LocalStorage:** Tracking past and future states efficiently without causing infinite loops when syncing with `BroadcastChannel` and `localStorage`.
  - *Solution:* Created a wrapper around the state setter that deeply compares state changes before pushing them to the history stack, preventing side-effect loops.

## 💡 What I would improve with more time
- **Backend & Database Integration:** Replace local storage with a real backend (e.g., PostgreSQL + Prisma + Next.js Server Actions) for true multi-user cloud collaboration.
- **User Authentication:** Add NextAuth or Clerk for user sign-in and personalized workspaces.
- **Advanced Animations:** Add `framer-motion` for even smoother layout transitions when columns are reordered or tasks are filtered out.
- **Column Reordering:** Allow users to drag and drop entire columns left and right, not just tasks.
