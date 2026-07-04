'use client';

import { ThemeProvider } from 'next-themes';
import { KanbanProvider } from '@/store/KanbanContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <KanbanProvider>
        {children}
      </KanbanProvider>
    </ThemeProvider>
  );
}
