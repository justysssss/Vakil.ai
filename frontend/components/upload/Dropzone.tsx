"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';

interface DropzoneProps {
    onFileSelect: (file: File | null) => void;
    accept?: string[];
    selectedFile?: File | null;
}

export default function Dropzone({ onFileSelect, accept = ['application/pdf'], selectedFile }: DropzoneProps) {
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

    const clearFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileSelect(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => !selectedFile && inputRef.current?.click()}
                className={`
                    relative w-full rounded-2xl p-8 flex flex-col items-center justify-center 
                    cursor-pointer transition-all duration-300 min-h-[200px]
                    border-2 border-dashed
                    ${isDragging
                        ? 'border-violet-400 bg-violet-500/10 shadow-lg shadow-violet-500/20'
                        : selectedFile
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-white/10 bg-white/5 hover:border-violet-400/50 hover:bg-white/[0.07]'
                    }
                    backdrop-blur-xl
                `}
            >
                {/* Animated gradient border effect */}
                <div className={`
                    absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
                    ${isDragging ? 'opacity-100' : ''}
                `}>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 opacity-20 blur-xl" />
                </div>

                <AnimatePresence mode="wait">
                    {selectedFile ? (
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="relative z-10 flex flex-col items-center gap-4"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                                    <FileText className="w-8 h-8 text-emerald-400" />
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                                >
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </motion.div>
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-white">{selectedFile.name}</p>
                                <p className="text-sm text-white/60 mt-1">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                onClick={clearFile}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 
                                         text-white/80 text-sm transition-all duration-200"
                            >
                                <X className="w-4 h-4" />
                                Remove file
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="no-file"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative z-10 flex flex-col items-center gap-4"
                        >
                            <motion.div
                                animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                className={`
                                    w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300
                                    ${isDragging ? 'bg-violet-500/30' : 'bg-white/10'}
                                `}
                            >
                                <Upload className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-violet-300' : 'text-white/60'}`} />
                            </motion.div>
                            <div className="text-center">
                                <p className="font-semibold text-white text-lg">
                                    {isDragging ? 'Drop your file here' : 'Drag & drop your PDF'}
                                </p>
                                <p className="text-sm text-white/50 mt-2">
                                    or <span className="text-violet-400 hover:text-violet-300 cursor-pointer">browse</span> to select
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">
                                    PDF only
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">
                                    Max 25MB
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <input
                    ref={inputRef}
                    type="file"
                    accept={accept.join(',')}
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </div>
        </motion.div>
    );
}
