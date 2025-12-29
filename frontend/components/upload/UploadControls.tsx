"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Sparkles, X } from 'lucide-react';

interface UploadControlsProps {
    file: File | null;
    onAnalyze: () => void;
    onClear?: () => void;
}

export default function UploadControls({ file, onAnalyze, onClear }: UploadControlsProps) {
    const [uploading, setUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        let t: number | undefined;
        if (uploading) {
            t = window.setInterval(() => {
                setProgress((p) => Math.min(100, p + Math.floor(Math.random() * 10) + 5));
            }, 400);
        }
        return () => { if (t) window.clearInterval(t); };
    }, [uploading]);

    const startAnalyze = () => {
        if (!file) return;
        setUploading(true);
        setProgress(0);
        // Simulate upload progress for frontend-only
        setTimeout(() => {
            setProgress(100);
            setUploading(false);
            onAnalyze();
        }, 2000 + Math.random() * 1500);
    };

    if (!file) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
            {/* File info */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{file.name}</p>
                    <p className="text-sm text-white/50">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze
                    </p>
                </div>
                {onClear && (
                    <button
                        onClick={onClear}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Progress bar */}
            {uploading && (
                <div className="space-y-2">
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <p className="text-xs text-white/50 text-center">
                        {progress < 100 ? `Analyzing... ${progress}%` : 'Analysis complete!'}
                    </p>
                </div>
            )}

            {/* Action button */}
            {!uploading && (
                <button
                    onClick={startAnalyze}
                    disabled={!file || uploading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                             bg-gradient-to-r from-violet-500 to-purple-600 
                             hover:from-violet-600 hover:to-purple-700
                             text-white font-semibold
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-200 shadow-lg shadow-violet-500/25"
                >
                    <Sparkles className="w-5 h-5" />
                    Analyze Contract
                </button>
            )}

            {uploading && (
                <div className="flex items-center justify-center gap-2 text-white/60">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing with AI...</span>
                </div>
            )}
        </motion.div>
    );
}
