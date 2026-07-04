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
import { TaskModal } from './TaskModal';
import { Task } from '@/types';

export function KanbanBoard() {
  const { board, setTasks, addTask, updateTask, deleteTask, isLoaded } = useKanban();
  
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [addingToColumnId, setAddingToColumnId] = useState<string | undefined>();

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

  // --- Drag and drop logic ---
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

    const activeTaskData = board.tasks.find((t) => t.id === activeId);
    if (!activeTaskData) return;

    if (isOverTask) {
      const overTaskData = board.tasks.find((t) => t.id === overId);
      if (!overTaskData) return;

      if (activeTaskData.columnId !== overTaskData.columnId) {
        const newTasks = [...board.tasks];
        const activeIndex = newTasks.findIndex((t) => t.id === activeId);
        const overIndex = newTasks.findIndex((t) => t.id === overId);
        
        newTasks[activeIndex] = { ...activeTaskData, columnId: overTaskData.columnId };
        setTasks(arrayMove(newTasks, activeIndex, overIndex));
      }
    }

    if (isOverColumn) {
      if (activeTaskData.columnId !== overId) {
        const newTasks = [...board.tasks];
        const activeIndex = newTasks.findIndex((t) => t.id === activeId);
        newTasks[activeIndex] = { ...activeTaskData, columnId: overId };
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

    const activeTaskData = board.tasks.find((t) => t.id === activeId);
    const overTaskData = board.tasks.find((t) => t.id === overId);

    if (activeTaskData && overTaskData && activeTaskData.columnId === overTaskData.columnId) {
      const activeIndex = board.tasks.findIndex((t) => t.id === activeId);
      const overIndex = board.tasks.findIndex((t) => t.id === overId);
      setTasks(arrayMove(board.tasks, activeIndex, overIndex));
    }
  };

  // --- Modal logic ---
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setAddingToColumnId(undefined);
    setIsModalOpen(true);
  };

  const handleAddTaskClick = (columnId: string) => {
    setEditingTask(null);
    setAddingToColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      updateTask(task);
    } else {
      addTask(task);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  return (
    <>
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
                onTaskClick={handleEditTask}
                onAddTask={handleAddTaskClick}
              />
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <div className="opacity-80 rotate-2"><TaskCard task={activeTask} /></div> : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        columnId={addingToColumnId}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
