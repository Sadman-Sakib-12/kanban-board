'use client';

import React, { useRef } from 'react';
import { useKanban } from '@/context/KanbanContext';
import { Button } from '../ui/Button';
import { Download, Upload } from 'lucide-react';

export function ExportImport() {
  const { board, setBoard } = useKanban();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(board, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kanban-board-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.columns && parsed.tasks) {
          setBoard(parsed);
        } else {
          alert('Invalid board format');
        }
      } catch {
        alert('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" onClick={handleExport} className="gap-2">
        <Download className="w-4 h-4" /> Export
      </Button>
      <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
        <Upload className="w-4 h-4" /> Import
      </Button>
      <input 
        type="file" 
        accept=".json" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImport} 
      />
    </div>
  );
}
