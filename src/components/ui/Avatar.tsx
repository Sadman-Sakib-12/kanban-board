import React from 'react';

export function Avatar({ name, src, className = '' }: { name: string; src?: string; className?: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted border border-border items-center justify-center ${className}`}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="aspect-square h-full w-full object-cover" />
      ) : (
        <span className="text-xs font-medium text-muted-foreground">{initials}</span>
      )}
    </div>
  );
}
