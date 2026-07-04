import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Task, Priority } from '@/types';
import { Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RichTextEditor } from '../ui/RichTextEditor';

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  assigneeName: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']),
  dueDate: z.string().optional(),
  labelString: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  columnId?: string; // Used when creating a new task
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskModal({ isOpen, onClose, task, columnId, onSave, onDelete }: TaskModalProps) {
  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assigneeName: '',
      priority: 'Medium',
      dueDate: '',
      labelString: ''
    }
  });

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        reset({
          title: task.title,
          description: task.description || '',
          assigneeName: task.assignee?.name || '',
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          labelString: task.labels?.map(l => l.name).join(', ') || ''
        });
      } else {
        reset({
          title: '',
          description: '',
          assigneeName: '',
          priority: 'Medium',
          dueDate: '',
          labelString: ''
        });
      }
    }
  }, [isOpen, task, reset]);

  const onSubmit = (data: TaskFormValues) => {
    // Parse labels
    const labels = (data.labelString || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(name => ({
        id: uuidv4(),
        name,
        color: '#818cf8' // Default color
      }));

    const newTask: Task = {
      id: task ? task.id : uuidv4(),
      title: data.title.trim(),
      description: data.description?.trim() || '',
      assignee: data.assigneeName?.trim() ? { name: data.assigneeName.trim() } : undefined,
      priority: data.priority,
      labels: task && task.labels.length > 0 && !data.labelString ? task.labels : labels,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
      columnId: task ? task.columnId : (columnId || 'col-backlog'),
    };

    onSave(newTask);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
          <Input
            autoFocus
            placeholder="Task title"
            {...register('title')}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor 
                value={field.value || ''} 
                onChange={field.onChange} 
                placeholder="Add a more detailed description..."
              />
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              {...register('priority')}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <Input
              type="date"
              {...register('dueDate')}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Assignee</label>
            <Input
              placeholder="Assignee name"
              {...register('assigneeName')}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Labels</label>
            <Input
              placeholder="e.g. Bug, Feature, Urgent"
              {...register('labelString')}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-border mt-6">
          {task && onDelete ? (
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          ) : (
            <div></div> // Spacer
          )}
          
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
