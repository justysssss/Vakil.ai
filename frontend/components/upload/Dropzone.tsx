"use client";

import * as React from 'react';

interface DropzoneProps {
    onFileSelect: (file: File | null) => void;
    accept?: string[];
}

export default function Dropzone({ onFileSelect, accept = ['application/pdf'] }: DropzoneProps) {
    const [isDragging, setIsDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const handleFiles = (files?: FileList | null) => {
        if (!files || files.length === 0) return onFileSelect(null);
        const file = files[0];
        if (accept && !accept.includes(file.type)) {
            onFileSelect(null);
            return;
        }
        onFileSelect(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    return (
        <div>
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`w-full rounded-xl border-2 p-8 flex items-center justify-center cursor-pointer transition-shadow min-h-30 ${isDragging ? 'border-blue-400 shadow-lg bg-card/40' : 'border-dashed border-border/30 bg-card/20'}`}
            >
                <div className="text-center">
                    <p className="font-semibold text-lg">Drag & drop a PDF here, or click to select</p>
                    <p className="text-sm text-muted-foreground mt-2">Only PDF files are accepted</p>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept.join(',')}
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                    placeholder="Select a PDF file"
                />
            </div>
        </div>
    );
}
