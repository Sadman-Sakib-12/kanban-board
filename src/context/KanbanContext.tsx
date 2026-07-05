'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Board, Task, Column } from '@/types';
import { defaultBoard } from '@/lib/defaultData';
import { v4 as uuidv4 } from 'uuid';

interface KanbanContextProps {
  board: Board;
  setBoard: (board: Board | ((b: Board) => Board)) => void;
  setTasks: (tasks: Task[]) => void;
  setColumns: (columns: Column[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addColumn: (title: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isLoaded: boolean;
}

const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

export const KanbanProvider = ({ children }: { children: ReactNode }) => {
  const [board, _setBoard] = useState<Board>({ columns: [], tasks: [] });
  const [past, setPast] = useState<Board[]>([]);
  const [future, setFuture] = useState<Board[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const setBoard = (newBoard: Board | ((b: Board) => Board)) => {
    _setBoard((current) => {
      const updated = typeof newBoard === 'function' ? newBoard(current) : newBoard;
      if (JSON.stringify(current) !== JSON.stringify(updated)) {
        setPast((p) => [...p, current]);
        setFuture([]);
      }
      return updated;
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem('kanban-board');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.columns && parsed.tasks) {

          _setBoard(parsed);
        } else {
          _setBoard(defaultBoard);
        }
      } catch (e) {
        console.error('Failed to parse local storage data, using default.', e);
        _setBoard(defaultBoard);
      }
    } else {
      _setBoard(defaultBoard);
    }
    setIsLoaded(true);

    const channel = new BroadcastChannel('kanban_sync');
    channel.onmessage = (event) => {
      const receivedBoard = event.data;
      if (receivedBoard && receivedBoard.columns && receivedBoard.tasks) {
        _setBoard((current) => {
          if (JSON.stringify(current) !== JSON.stringify(receivedBoard)) {
            return receivedBoard;
          }
          return current;
        });
      }
    };
    return () => channel.close();
  }, []);

  // Sync to local storage whenever board changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('kanban-board', JSON.stringify(board));
      const channel = new BroadcastChannel('kanban_sync');
      channel.postMessage(board);
      channel.close();
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

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((p) => p.slice(0, p.length - 1));
    setFuture((f) => [board, ...f]);
    _setBoard(previous);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, board]);
    _setBoard(next);
  };

  // Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [past, future, board, undo, redo]);

  return (
    <KanbanContext.Provider value={{
      board, setBoard, setTasks, setColumns, addTask, updateTask, deleteTask, addColumn,
      undo, redo, canUndo: past.length > 0, canRedo: future.length > 0, isLoaded
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
