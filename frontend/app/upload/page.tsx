"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dropzone from '@/components/upload/Dropzone';
import UploadControls from '@/components/upload/UploadControls';
import PdfViewer from '@/components/pdf/PdfViewer';
import UploadSidebar from '@/components/upload/Sidebar';
import ChatSidebar from '@/components/upload/ChatSidebar';
import { ArrowLeft, Scale, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';

// Define types for the Backend Response
interface Risk {
  clause: string;
  risk_level: "High" | "Medium" | "Low";
  reason: string;
  suggestion: string;
}

interface AnalysisResult {
  summary: string;
  risks: Risk[];
  score: number;
  full_text: string; // Crucial for Chat
}

export default function UploadPage() {
    const [file, setFile] = React.useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [analysisData, setAnalysisData] = React.useState<AnalysisResult | null>(null);

    // 1. The Function to Call Backend
    const handleAnalyze = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Replace with your actual backend URL
            const response = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error("Analysis failed");

            const data = await response.json();
            setAnalysisData(data);
        } catch (error) {
            console.error(error);
            alert("Error analyzing document. Check backend console.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setAnalysisData(null);
    };

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
                        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back</span>
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Scale className="w-5 h-5 text-violet-400" />
                            <span className="font-semibold text-white">VakilVerify</span>
                        </div>
                    </div>
                    {/* Show Score if available */}
                    {analysisData && (
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10">
                            <span className="text-sm text-white/60">Safety Score:</span>
                            <span className={`font-bold ${analysisData.score > 70 ? 'text-green-400' : 'text-red-400'}`}>
                                {analysisData.score}/100
                            </span>
                        </div>
                    )}
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left Sidebar: Switches between Tips and Analysis Results */}
                    <div className="lg:col-span-3 h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {!analysisData ? (
                                <UploadSidebar key="sidebar" />
                            ) : (
                                <motion.div 
                                    key="results"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <h3 className="text-lg font-semibold text-white mb-2">Analysis Summary</h3>
                                        <p className="text-sm text-white/70 leading-relaxed">{analysisData.summary}</p>
                                    </div>
                                    
                                    <h4 className="text-sm font-medium text-white/50 uppercase tracking-wider mt-6 mb-3">Risks Found</h4>
                                    
                                    {analysisData.risks.map((risk, idx) => (
                                        <div key={idx} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <h5 className="font-medium text-red-200 text-sm mb-1">{risk.risk_level} Risk</h5>
                                                    <p className="text-xs text-white/60 mb-2 line-clamp-2">"{risk.clause}"</p>
                                                    <p className="text-xs text-red-300/80 italic">{risk.reason}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Main content area */}
                    <div className="lg:col-span-5 space-y-6">
                        {!file ? (
                            <Dropzone
                                onFileSelect={setFile}
                                accept={['application/pdf']}
                                selectedFile={file}
                            />
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <UploadControls
                                    file={file}
                                    isAnalyzing={isAnalyzing} // Pass loading state
                                    onAnalyze={handleAnalyze} // Pass function
                                    onClear={handleClear}
                                />
                                <div className="mt-4 h-[600px] rounded-xl overflow-hidden border border-white/10 bg-black/40">
                                     <PdfViewer file={file} />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right sidebar - Chat */}
                    <div className="lg:col-span-4">
                        {/* CRITICAL: Pass the 'full_text' from backend to the chat 
                           so it knows what document it's talking about.
                        */}
                        <ChatSidebar 
                            file={file} 
                            documentContext={analysisData?.full_text || ""} 
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}