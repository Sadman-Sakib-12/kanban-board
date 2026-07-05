'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Board, Task, Column } from '@/types';
import { defaultBoard } from '@/lib/defaultData';
import { v4 as uuidv4 } from 'uuid';

interface KanbanContextProps {
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board>>;
  setTasks: (tasks: Task[]) => void;
  setColumns: (columns: Column[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addColumn: (title: string) => void;
  isLoaded: boolean;
}

const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

export const KanbanProvider = ({ children }: { children: ReactNode }) => {
  const [board, setBoard] = useState<Board>({ columns: [], tasks: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kanban-board');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.columns && parsed.tasks) {
          setBoard(parsed);
        } else {
          setBoard(defaultBoard);
        }
      } catch (e) {
        console.error('Failed to parse local storage data, using default.', e);
        setBoard(defaultBoard);
      }
    } else {
      setBoard(defaultBoard);
    }
    setIsLoaded(true);
  }, []);

  // Sync to local storage whenever board changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kanban-board', JSON.stringify(board));
    }
  }, [board, isLoaded]);

  const setTasks = (tasks: Task[]) => setBoard((b) => ({ ...b, tasks }));
  const setColumns = (columns: Column[]) => setBoard((b) => ({ ...b, columns }));
  
  const addTask = (task: Task) => setBoard((b) => ({ ...b, tasks: [...b.tasks, task] }));
  
  const updateTask = (task: Task) => setBoard((b) => ({
    ...b,
    tasks: b.tasks.map((t) => (t.id === task.id ? task : t)),
  }));
  
  const deleteTask = (id: string) => setBoard((b) => ({
    ...b,
    tasks: b.tasks.filter((t) => t.id !== id),
  }));

  const addColumn = (title: string) => {
    const newColumn: Column = {
      id: uuidv4(),
      title,
    };
    setBoard((b) => ({ ...b, columns: [...b.columns, newColumn] }));
  };

  return (
    <KanbanContext.Provider value={{
      board, setBoard, setTasks, setColumns, addTask, updateTask, deleteTask, addColumn, isLoaded
    }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};
