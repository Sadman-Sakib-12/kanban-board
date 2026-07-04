'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false, 
  loading: () => <div className="h-[150px] w-full animate-pulse bg-muted rounded-md border border-border"></div> 
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  }), []);

  return (
    <div className="bg-card text-foreground quill-wrapper">
      <ReactQuill 
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
