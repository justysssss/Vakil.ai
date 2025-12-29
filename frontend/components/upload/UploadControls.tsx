"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, Sparkles, X, AlertCircle } from 'lucide-react';

interface UploadControlsProps {
    file: File | null;
    isAnalyzing: boolean; // <--- Controlled by parent (page.tsx)
    onAnalyze: () => void;
    onClear?: () => void;
}

export default function UploadControls({ file, isAnalyzing, onAnalyze, onClear }: UploadControlsProps) {
    if (!file) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
            {/* File info Card */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate" title={file.name}>
                        {file.name}
                    </p>
                    <p className="text-sm text-white/50">
                        {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                    </p>
                </div>
                
                {/* Only show Clear button if NOT analyzing */}
                {onClear && !isAnalyzing && (
                    <button
                        onClick={onClear}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
                        title="Remove file"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Analysis Progress / Status Area */}
            {isAnalyzing && (
                <div className="space-y-3 pt-2">
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ 
                                duration: 2, 
                                repeat: Infinity, 
                                ease: "linear" 
                            }}
                        />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-white/60">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Reading Document & Checking Indian Laws...</span>
                    </div>
                </div>
            )}

            {/* Action Button */}
            {!isAnalyzing && (
                <button
                    onClick={onAnalyze}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                             bg-gradient-to-r from-violet-500 to-purple-600 
                             hover:from-violet-600 hover:to-purple-700
                             text-white font-semibold shadow-lg shadow-violet-500/25
                             transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                    <Sparkles className="w-5 h-5" />
                    Analyze Contract
                </button>
            )}
        </motion.div>
    );
}