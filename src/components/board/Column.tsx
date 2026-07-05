import React, { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column, Task } from '@/types';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onAddTask?: (columnId: string) => void;
}

export function KanbanColumn({ column, tasks, onTaskClick, onAddTask }: KanbanColumnProps) {
  const taskIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'Column', column },
  });

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: tasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <div className="flex flex-col flex-shrink-0 w-[320px] bg-muted/40 rounded-xl border border-border shadow-sm max-h-full">
      <div className="p-3 border-b border-border flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-foreground">{column.title}</h3>
          <span className="flex items-center justify-center bg-card text-muted-foreground text-xs font-medium w-5 h-5 rounded-full border border-border">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div 
        ref={(node) => {
          setNodeRef(node);
          parentRef.current = node;
        }}
        className={`flex-1 overflow-y-auto custom-scrollbar min-h-[150px] transition-colors ${
          isOver ? 'bg-primary/5' : ''
        }`}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
          className="p-3"
        >
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const task = tasks[virtualRow.index];
              return (
                <div
                  key={task.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingBottom: '12px',
                  }}
                >
                  <TaskCard task={task} onClick={onTaskClick} />
                </div>
              );
            })}
          </SortableContext>
        </div>
      </div>

      <div className="p-3 border-t border-border bg-muted/20">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => onAddTask?.(column.id)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
