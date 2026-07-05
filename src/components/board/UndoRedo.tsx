'use client';

import React from 'react';
import { useKanban } from '@/context/KanbanContext';
import { Button } from '../ui/Button';
import { Undo2, Redo2 } from 'lucide-react';

export function UndoRedo() {
  const { undo, redo, canUndo, canRedo } = useKanban();

  return (
    <div className="flex items-center gap-1 mr-2 border-r border-border pr-3">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={undo} 
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
        className="h-8 w-8"
      >
        <Undo2 className="w-4 h-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={redo} 
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
        className="h-8 w-8"
      >
        <Redo2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
