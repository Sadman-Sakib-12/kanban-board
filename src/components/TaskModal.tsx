import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Task, Priority } from '@/types';
import { Trash2 } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  columnId?: string; // Used when creating a new task
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function TaskModal({ isOpen, onClose, task, columnId, onSave, onDelete }: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeName, setAssigneeName] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [labelString, setLabelString] = useState('');

  // Reset or populate form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setAssigneeName(task.assignee?.name || '');
        setPriority(task.priority);
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        setLabelString(task.labels?.map(l => l.name).join(', ') || '');
      } else {
        setTitle('');
        setDescription('');
        setAssigneeName('');
        setPriority('Medium');
        setDueDate('');
        setLabelString('');
      }
    }
  }, [isOpen, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse labels
    const labels = labelString
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(name => ({
        id: uuidv4(),
        name,
        color: '#818cf8' // Default color (indigo-400)
      }));

    const newTask: Task = {
      id: task ? task.id : uuidv4(),
      title: title.trim(),
      description: description.trim(),
      assignee: assigneeName.trim() ? { name: assigneeName.trim() } : undefined,
      priority,
      labels: task && task.labels.length > 0 && !labelString ? task.labels : labels,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      columnId: task ? task.columnId : (columnId || 'col-backlog'),
    };

    onSave(newTask);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="flex w-full rounded-md border border-border bg-card px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[100px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a more detailed description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              className="flex h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Assignee</label>
            <Input
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              placeholder="Assignee name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Labels</label>
            <Input
              value={labelString}
              onChange={(e) => setLabelString(e.target.value)}
              placeholder="e.g. Bug, Feature, Urgent"
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
