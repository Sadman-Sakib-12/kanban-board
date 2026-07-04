import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'Task', task },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const priorityColors = {
    High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(task)}
      className={`bg-card text-card-foreground border border-border p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors ${
        isDragging ? 'opacity-50 ring-2 ring-primary ring-offset-2' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm line-clamp-2 leading-tight">{task.title}</h4>
        <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${priorityColors[task.priority]}`}>
          {task.priority}
        </div>
      </div>
      
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.labels.map((label) => (
            <Badge key={label.id} customColor={label.color} className="text-[10px] px-1.5 py-0 border-transparent">
              {label.name}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/50">
        <div className="flex items-center text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded">
              <CalendarIcon className="w-3 h-3" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
        
        {task.assignee && (
          <Avatar name={task.assignee.name} src={task.assignee.avatar} className="w-6 h-6 text-[10px]" />
        )}
      </div>
    </div>
  );
}
