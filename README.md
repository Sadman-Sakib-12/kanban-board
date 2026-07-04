# Interactive Kanban Board

A modern, responsive Kanban Board application built with Next.js 14 (App Router), Tailwind CSS, and TypeScript. 
This project was developed as a frontend internship task for SammTech Ltd.

## 🚀 Live Demo
[Add your Vercel URL here]

## ✨ Features
- **Board Structure:** Default columns (Backlog, Todo, In Progress, Review, Done).
- **Task Cards:** Detailed task cards with Title, Description, Assignee (with avatar), Colored Labels, Due Date, and Priority.
- **Drag & Drop:** Smooth drag-and-drop functionality using `@dnd-kit` to move cards between columns and reorder them.
- **Task Management:** Click to edit a task, add new tasks, or delete tasks using a clean Modal interface.
- **Search & Filter:** Instantly filter tasks by title, assignee name, label, or priority level.
- **Theme Support:** Dark and Light mode toggle that respects system preferences.
- **Persistence:** All data is automatically saved to local storage so you don't lose your work on refresh.
- **Responsive:** Fully functional on both mobile and desktop screens.

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
- **Framework (Next.js 14 App Router):** Used for its modern architecture, excellent performance, and out-of-the-box optimizations.
- **State Management (React Context):** I chose native React Context combined with local state over external libraries (like Redux) to keep the bundle size small and demonstrate core React proficiency. A custom hook ensures the state seamlessly syncs with `localStorage`.
- **Drag & Drop (@dnd-kit):** Unlike `react-beautiful-dnd` (which is largely unmaintained and has issues with React 18 Strict Mode), `@dnd-kit` is modern, highly accessible, and modular. It perfectly handles complex multiple-container sorting logic.
- **Styling (Tailwind CSS):** Used for rapid, custom UI development without relying on heavy component libraries. This ensured maximum flexibility over the design aesthetics to create a glassmorphism-inspired premium look.
- **Components:** Built atomic UI components (`Button`, `Input`, `Modal`, `Badge`) from scratch to maintain a cohesive design system without external UI dependencies.

## 🚧 Challenges Faced & Solutions
- **Hydration Mismatch with Local Storage:** Since Next.js renders on the server first, accessing `localStorage` directly causes hydration errors because the server HTML doesn't match the client HTML (which has the stored data). 
  - *Solution:* I implemented a mounted state pattern (`isLoaded` flag) in the context provider to ensure the initial render matches the server, and then loads the local storage data immediately after mounting.
- **Cross-Column Drag Logic:** Moving items between different lists while maintaining their visual order during the drag requires careful tracking of `activeId` and `overId`.
  - *Solution:* Leveraged `@dnd-kit`'s `useSensors` and `arrayMove` function, and wrote robust collision detection logic in `KanbanBoard` to correctly update the `columnId` of a task when dropped over a new column.

## 💡 Future Improvements (With more time)
- **Backend Integration:** Replace local storage with a real backend (e.g., PostgreSQL + Prisma) for multi-user collaboration.
- **Real-time Syncing:** Implement WebSockets or `BroadcastChannel` to sync state across multiple browser tabs in real-time.
- **Undo/Redo Stack:** Keep a history of the state array to easily undo accidental drag-and-drops or deletions.
- **Custom Columns:** Allow users to add, rename, and delete custom columns.
