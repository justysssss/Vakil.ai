"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { FileText, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, AlertTriangle, Loader2 } from 'lucide-react';

interface Risk {
    clause: string;
    risk_level: "High" | "Medium" | "Low";
    reason: string;
    suggestion: string;
}

interface PdfViewerProps {
    file: File | null;
    risks?: Risk[];
}

// Dynamically import the actual PDF renderer with SSR disabled
const PdfRenderer = dynamic(
    () => import('./PdfRenderer').then((mod) => mod.default),
    {
        ssr: false,
        loading: () => (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-violet-400 animate-spin mb-3" />
                <p className="text-white/50 text-sm">Loading PDF viewer...</p>
            </div>
        ),
    }
);

export default function PdfViewer({ file, risks = [] }: PdfViewerProps) {
    const [numPages, setNumPages] = React.useState<number>(0);
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const [zoom, setZoom] = React.useState<number>(100);

    const goToPrevPage = () => setPageNumber(prev => Math.max(1, prev - 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(numPages, prev + 1));

    const handleDownload = () => {
        if (file) {
            const url = URL.createObjectURL(file);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'High': return 'bg-red-500/20 border-red-500/50 text-red-400';
            case 'Medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
            case 'Low': return 'bg-green-500/20 border-green-500/50 text-green-400';
            default: return 'bg-white/10 border-white/20 text-white/60';
        }
    };

    if (!file) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
                <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-violet-400" />
                </div>
                <p className="text-white/60 text-center">
                    Upload a PDF to preview
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-full rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
        >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-violet-400" />
                    <span className="text-sm text-white font-medium truncate max-w-[200px]" title={file.name}>
                        {file.name}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setZoom(z => Math.max(50, z - 25))}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        title="Zoom out"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-white/50 w-12 text-center">{zoom}%</span>
                    <button
                        onClick={() => setZoom(z => Math.min(200, z + 25))}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        title="Zoom in"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>

                    <div className="w-px h-5 bg-white/10 mx-1" />

                    <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        title="Download"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* PDF Content */}
            <div className="flex-1 overflow-auto bg-neutral-900/50 flex justify-center p-4">
                <PdfRenderer
                    file={file}
                    pageNumber={pageNumber}
                    zoom={zoom}
                    onLoadSuccess={(pages) => setNumPages(pages)}
                />
            </div>

            {/* Risk Overlay Panel */}
            {risks.length > 0 && (
                <div className="border-t border-white/10 bg-white/5 p-3 max-h-32 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-medium text-white/70">
                            {risks.length} Risk{risks.length > 1 ? 's' : ''} Found
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {risks.slice(0, 5).map((risk, idx) => (
                            <span
                                key={idx}
                                className={`px-2 py-1 rounded-lg text-xs border ${getRiskColor(risk.risk_level)}`}
                            >
                                {risk.risk_level}: {risk.clause.substring(0, 30)}...
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Page Navigation */}
            {numPages > 1 && (
                <div className="flex items-center justify-center gap-4 px-4 py-3 border-t border-white/10 bg-white/5">
                    <button
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-white/60">
                        Page <span className="text-white font-medium">{pageNumber}</span> of <span className="text-white font-medium">{numPages}</span>
                    </span>
                    <button
                        onClick={goToNextPage}
                        disabled={pageNumber >= numPages}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </motion.div>
    );
}
