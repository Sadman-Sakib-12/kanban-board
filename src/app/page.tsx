import { KanbanBoard } from '@/components/board/Board';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { KanbanSquare } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col h-screen overflow-hidden bg-background">
      <header className="flex-shrink-0 flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl text-primary-foreground shadow-sm">
            <KanbanSquare className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Kanban Board</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden relative custom-scrollbar">
        <KanbanBoard />
      </div>
    </main>
  );
}
