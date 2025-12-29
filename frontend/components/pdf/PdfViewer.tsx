"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface PdfViewerProps {
    file: File | null;
}

export default function PdfViewer({ file }: PdfViewerProps) {
    const [zoom, setZoom] = React.useState(100);

    if (!file) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white/30" />
                    </div>
                    <div>
                        <p className="text-white/60 font-medium">PDF Preview</p>
                        <p className="text-sm text-white/40 mt-1">
                            Upload a contract to see the preview
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden"
        >
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-violet-400" />
                    <span className="text-sm text-white/80 truncate max-w-[200px]">{file.name}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setZoom(z => Math.max(50, z - 10))}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs text-white/50 w-12 text-center">{zoom}%</span>
                    <button
                        onClick={() => setZoom(z => Math.min(200, z + 10))}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <button
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Preview area */}
            <div className="h-[400px] bg-gradient-to-b from-white/[0.02] to-transparent flex items-center justify-center">
                <div className="text-center px-8">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-violet-400" />
                    </div>
                    <p className="text-white/60 font-medium">PDF Viewer</p>
                    <p className="text-sm text-white/40 mt-2 max-w-xs mx-auto">
                        Integrate <code className="px-2 py-0.5 rounded bg-white/10 text-violet-400 text-xs">react-pdf</code> to render pages with clause highlights
                    </p>
                    <div className="mt-4 text-xs text-white/30">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
