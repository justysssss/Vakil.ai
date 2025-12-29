"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import Dropzone from '@/components/upload/Dropzone';
import UploadControls from '@/components/upload/UploadControls';
import PdfViewer from '@/components/pdf/PdfViewer';
import UploadSidebar from '@/components/upload/Sidebar';
import ChatSidebar from '@/components/upload/ChatSidebar';
import { ArrowLeft, Scale } from 'lucide-react';
import Link from 'next/link';

export default function UploadPage() {
    const [file, setFile] = React.useState<File | null>(null);

    return (
        <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
            {/* Background gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back</span>
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Scale className="w-5 h-5 text-violet-400" />
                            <span className="font-semibold text-white">VakilVerify</span>
                        </div>
                    </div>
                    <div className="text-sm text-white/50">
                        Upload & Analyze
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white">
                        Contract Analysis
                    </h1>
                    <p className="mt-2 text-white/60">
                        Upload your PDF contract to begin AI-powered clause analysis
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left sidebar - Quick Tips */}
                    <div className="lg:col-span-3">
                        <UploadSidebar />
                    </div>

                    {/* Main content area */}
                    <div className="lg:col-span-5 space-y-6">
                        <Dropzone
                            onFileSelect={setFile}
                            accept={["application/pdf"]}
                            selectedFile={file}
                        />

                        <UploadControls
                            file={file}
                            onAnalyze={() => { /* Backend wired later */ }}
                            onClear={() => setFile(null)}
                        />

                        <PdfViewer file={file} />
                    </div>

                    {/* Right sidebar - Chat */}
                    <div className="lg:col-span-4">
                        <ChatSidebar file={file} />
                    </div>
                </div>
            </main>
        </div>
    );
}
