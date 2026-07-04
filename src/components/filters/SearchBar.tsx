import React from "react";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";

export function SearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input 
        className="pl-9" 
        placeholder="Search by title, assignee, or label..." 
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
