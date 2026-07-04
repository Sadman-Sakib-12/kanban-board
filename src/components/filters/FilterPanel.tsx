import React from 'react';
import { Input } from '../ui/Input';
import { Priority } from '@/types';
import { Search } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  priorityFilter: Priority | 'All';
  setPriorityFilter: (p: Priority | 'All') => void;
}

export function FilterBar({ searchQuery, setSearchQuery, priorityFilter, setPriorityFilter }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 px-6 pt-6 pb-0 items-center justify-between">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          className="pl-9" 
          placeholder="Search by title, assignee, or label..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Priority:</span>
        <select
          className="h-10 rounded-md border border-border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary w-full sm:w-auto"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
        >
          <option value="All">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
}
