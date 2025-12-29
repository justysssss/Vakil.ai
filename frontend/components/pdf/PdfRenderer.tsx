"use client";

import * as React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FileText, Loader2 } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Use local worker from pdfjs-dist package
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url
).toString();

interface PdfRendererProps {
    file: File;
    pageNumber: number;
    zoom: number;
    onLoadSuccess: (numPages: number) => void;
}

export default function PdfRenderer({ file, pageNumber, zoom, onLoadSuccess }: PdfRendererProps) {
    const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    if (!pdfUrl) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin mb-3" />
                <p className="text-white/50 text-sm">Preparing PDF...</p>
            </div>
        );
    }

    return (
        <Document
            file={pdfUrl}
            onLoadSuccess={({ numPages }) => onLoadSuccess(numPages)}
            loading={
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin mb-3" />
                    <p className="text-white/50 text-sm">Loading PDF...</p>
                </div>
            }
            error={
                <div className="flex flex-col items-center justify-center py-20">
                    <FileText className="w-8 h-8 text-red-400 mb-3" />
                    <p className="text-white/50 text-sm">Failed to load PDF</p>
                </div>
            }
            className="flex flex-col items-center"
        >
            <Page
                pageNumber={pageNumber}
                scale={zoom / 100}
                className="shadow-2xl rounded-lg overflow-hidden"
                renderTextLayer={false}
                renderAnnotationLayer={false}
            />
        </Document>
    );
}
