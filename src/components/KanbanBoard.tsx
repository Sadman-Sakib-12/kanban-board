'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useKanban } from '@/store/KanbanContext';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { Task } from '@/types';

export function KanbanBoard() {
  const { board, setTasks, isLoaded } = useKanban();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse p-10">
        Loading board...
      </div>
    );
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = board.tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    const activeTask = board.tasks.find((t) => t.id === activeId);
    if (!activeTask) return;

    if (isOverTask) {
      const overTask = board.tasks.find((t) => t.id === overId);
      if (!overTask) return;

      if (activeTask.columnId !== overTask.columnId) {
        const newTasks = [...board.tasks];
        const activeIndex = newTasks.findIndex((t) => t.id === activeId);
        const overIndex = newTasks.findIndex((t) => t.id === overId);
        
        newTasks[activeIndex] = { ...activeTask, columnId: overTask.columnId };
        setTasks(arrayMove(newTasks, activeIndex, overIndex));
      }
    }

    if (isOverColumn) {
      if (activeTask.columnId !== overId) {
        const newTasks = [...board.tasks];
        const activeIndex = newTasks.findIndex((t) => t.id === activeId);
        newTasks[activeIndex] = { ...activeTask, columnId: overId };
        setTasks(arrayMove(newTasks, activeIndex, newTasks.length));
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = board.tasks.find((t) => t.id === activeId);
    const overTask = board.tasks.find((t) => t.id === overId);

    if (activeTask && overTask && activeTask.columnId === overTask.columnId) {
      const activeIndex = board.tasks.findIndex((t) => t.id === activeId);
      const overIndex = board.tasks.findIndex((t) => t.id === overId);
      setTasks(arrayMove(board.tasks, activeIndex, overIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 p-6 overflow-x-auto h-full items-start w-full">
        {board.columns.map((column) => {
          const columnTasks = board.tasks.filter((t) => t.columnId === column.id);
          return (
            <KanbanColumn 
              key={column.id} 
              column={column} 
              tasks={columnTasks} 
              onTaskClick={(task) => console.log('Edit task', task)}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? <div className="opacity-80 rotate-2"><TaskCard task={activeTask} /></div> : null}
      </DragOverlay>
    </DndContext>
  );
}
