"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface DropzoneProps {
    onFileSelect: (file: File | null) => void;
    accept?: string[]; // e.g. ['application/pdf']
    selectedFile?: File | null;
}

export default function Dropzone({ onFileSelect, accept = ['application/pdf'], selectedFile }: DropzoneProps) {
    const [isDragging, setIsDragging] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    // Helper to validate and set file
    const handleFiles = (files?: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];

        // Validate File Type
        if (accept.length > 0 && !accept.includes(file.type)) {
            toast.error("Please upload a valid PDF file.");
            return;
        }

        onFileSelect(file);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
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
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <div
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => !selectedFile && inputRef.current?.click()}
                className={`
                    relative w-full rounded-2xl p-8 flex flex-col items-center justify-center 
                    cursor-pointer transition-all duration-300 min-h-[240px]
                    border-2 border-dashed
                    ${isDragging
                        ? 'border-violet-400 bg-violet-500/10 shadow-lg shadow-violet-500/20 scale-[1.02]'
                        : selectedFile
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-white/10 bg-white/5 hover:border-violet-400/50 hover:bg-white/[0.07]'
                    }
                    backdrop-blur-xl group
                `}
            >
                {/* Hidden Input */}
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept.join(',')}
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />

                <AnimatePresence mode="wait">
                    {selectedFile ? (
                        /* View 1: File is Selected */
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-4 z-10"
                        >
                            <div className="relative">
                                <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 flex items-center justify-center shadow-inner shadow-emerald-500/10">
                                    <FileText className="w-10 h-10 text-emerald-400" />
                                </div>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-[#0a0a0a]"
                                >
                                    <CheckCircle className="w-4 h-4 text-white" />
                                </motion.div>
                            </div>

                            <div className="text-center">
                                <p className="font-semibold text-white text-lg">{selectedFile.name}</p>
                                <p className="text-sm text-white/50 mt-1">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>

                            <button
                                onClick={clearFile}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 hover:text-red-200 
                                         text-white/60 text-sm transition-all duration-200 mt-2 group-hover:bg-white/20"
                            >
                                <X className="w-4 h-4" />
                                Change File
                            </button>
                        </motion.div>
                    ) : (
                        /* View 2: Drag & Drop Prompt */
                        <motion.div
                            key="prompt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center gap-4 z-10"
                        >
                            <div className={`
                                w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-300
                                ${isDragging ? 'bg-violet-500/30 scale-110' : 'bg-white/5 group-hover:bg-white/10'}
                            `}>
                                <Upload className={`w-10 h-10 transition-colors duration-300 
                                    ${isDragging ? 'text-violet-300' : 'text-white/40 group-hover:text-white/80'}`}
                                />
                            </div>

                            <div className="text-center space-y-2">
                                <p className="font-semibold text-white text-xl">
                                    {isDragging ? 'Drop it here!' : 'Upload Contract'}
                                </p>
                                <p className="text-white/50">
                                    Drag & drop or <span className="text-violet-400 font-medium group-hover:text-violet-300 transition-colors">browse</span>
                                </p>
                            </div>

                            <div className="flex gap-3 mt-2">
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/40">
                                    PDF
                                </span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-white/40">
                                    Max 25MB
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}