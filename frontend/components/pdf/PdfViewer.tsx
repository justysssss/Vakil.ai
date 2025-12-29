"use client";

import * as React from 'react';

interface PdfViewerProps {
    file: File | null;
}

export default function PdfViewer({ file }: PdfViewerProps) {
    if (!file) {
        return (
            <div className="border border-border/20 rounded-md p-6 text-center text-muted-foreground">
                PDF viewer will show here after upload. Install `react-pdf-highlighter` and wire rendering to enable highlights.
            </div>
        );
    }

    return (
        <div className="border border-border/20 rounded-md p-4">
            <div className="text-sm font-medium">Preview</div>
            <div className="mt-2 text-xs text-muted-foreground">{file.name} • {(file.size / 1024).toFixed(1)} KB</div>
            <div className="mt-4 h-80 bg-gradient-to-b from-transparent to-border/5 flex items-center justify-center text-muted-foreground">
                PDF viewer placeholder — integrate `react-pdf-highlighter` to render pages and Textract bounding-box overlays.
            </div>
        </div>
    );
}
