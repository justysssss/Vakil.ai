"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Dropzone from '@/components/upload/Dropzone';
import UploadControls from '@/components/upload/UploadControls';
import PdfViewer from '@/components/pdf/PdfViewer';
import UploadSidebar from '@/components/upload/Sidebar';
import ChatSidebar from '@/components/upload/ChatSidebar';
import { ArrowLeft, Scale, AlertTriangle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useSession, signOut } from '@/lib/auth-client';
import { createChatSession, saveDocument, getChat } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';

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
    return (
        <React.Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>}>
            <UploadPageContent />
        </React.Suspense>
    );
}

function UploadPageContent() {
    const { data: session, isPending } = useSession();
    const [file, setFile] = React.useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [analysisData, setAnalysisData] = React.useState<AnalysisResult | null>(null);
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const userMenuRef = React.useRef<HTMLDivElement>(null);
    const [chatId, setChatId] = React.useState<string | null>(null);

    const searchParams = useSearchParams();
    const urlChatId = searchParams.get('chatId');

    React.useEffect(() => {
        const loadSession = async () => {
            if (urlChatId && !analysisData) {
                setIsAnalyzing(true);
                try {
                    const result = await getChat(urlChatId);
                    if (result.success && result.chat && result.chat.document) {
                        setChatId(result.chat.id);
                        setAnalysisData(result.chat.document.analysis as AnalysisResult);

                        // We create a dummy file object just to show the name in UI
                        // The actual PDF content is missing, so PDF Viewer won't work perfectly
                        // but Chat will work because we have context.
                        const dummyFile = new File([""], result.chat.document.name, { type: "application/pdf" });
                        setFile(dummyFile);
                    } else {
                        console.error("Failed to load chat:", result.error);
                    }
                } catch (e) {
                    console.error("Error loading chat:", e);
                } finally {
                    setIsAnalyzing(false);
                }
            }
        };

        loadSession();
    }, [urlChatId]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    // 1. The Function to Call Backend
    const handleAnalyze = async () => {
        if (!session?.user) {
            alert("Please sign in to analyze documents.");
            return;
        }
        if (!file) return;

        setIsAnalyzing(true);
        // ... rest of function
        const formData = new FormData();
        formData.append("file", file);

        try {
            // Replace with your actual backend URL
            const response = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setAnalysisData(data);


            const saveResult = await saveDocument(
                session.user.id,
                file.name,
                data.full_text,
                data,
                data.score || 0
            )
            if (saveResult.success && saveResult.docId) {
                const chatResult = await createChatSession(session.user.id, saveResult.docId);
                if (chatResult.success && chatResult.chatId) {
                    setChatId(chatResult.chatId);
                } else if (chatResult.success) {
                    console.error("Chat session created successfully but chatId is missing.");
                    setChatId(null);
                }
            } else if (!saveResult.success) {
                console.error(saveResult.error);
            } else {
                console.error("Document saved successfully but docId is missing.");
            }

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
        setChatId(null);
        // Clear URL param if strictly needed, but Next.js router.replace is better.
        // For now, simple state clear.
    };

    const handleLogout = async () => {
        await signOut();
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
            {/* Background gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="relative z-50 border-b border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm">Back</span>
                        </Link>
                        <div className="h-6 w-px bg-white/10" />
                        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <Scale className="w-5 h-5 text-violet-400" />
                            <span className="font-semibold text-white">VakilVerify</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Show Score if available */}
                        {analysisData && (
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10">
                                <span className="text-sm text-white/60">Safety Score:</span>
                                <span className={`font-bold ${analysisData.score > 70 ? 'text-green-400' : 'text-red-400'}`}>
                                    {analysisData.score}/100
                                </span>
                            </div>
                        )}

                        {/* User Session */}
                        {isPending ? (
                            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
                        ) : session?.user ? (
                            <div ref={userMenuRef} className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    {session.user.image ? (
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            className="w-8 h-8 rounded-full border border-white/20"
                                        // eslint-disable-next-line @next/next/no-img-element
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">
                                                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-sm text-white/80 hidden sm:block">
                                        {session.user.name || session.user.email?.split('@')[0]}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-xl overflow-hidden z-[100]">
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <p className="text-sm font-medium text-white truncate">
                                                {session.user.name}
                                            </p>
                                            <p className="text-xs text-white/50 truncate">
                                                {session.user.email}
                                            </p>
                                        </div>
                                        {/* Added Profile Link */}
                                        <Link
                                            href="/profile"
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition-colors"
                                        >
                                            <Scale className="w-4 h-4 text-violet-400" /> {/* Reusing Scale icon or similar as per request */}
                                            My Sessions
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/"
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium hover:from-violet-600 hover:to-purple-700 transition-all"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="relative z-10 max-w-[1600px] mx-auto px-6 py-8">

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

                                    {analysisData.risks && analysisData.risks.map((risk, idx) => (
                                        <div key={idx} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <h5 className="font-medium text-red-200 text-sm mb-1">{risk.risk_level} Risk</h5>
                                                    <p className="text-xs text-white/60 mb-2 line-clamp-2">&quot;{risk.clause}&quot;</p>
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
                    <div className={`${analysisData ? 'lg:col-span-5' : 'lg:col-span-9'} space-y-6 transition-all duration-500`}>
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
                                    isAnalyzing={isAnalyzing}
                                    onAnalyze={handleAnalyze}
                                    onClear={handleClear}
                                    // Disable Analyze button if it's a dummy file from resumption
                                    disabled={!file.size}
                                />
                                <div className={`mt-4 rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl shadow-violet-500/10 transition-all duration-500 ${analysisData ? 'h-[750px]' : 'h-[600px]'}`}>
                                    {/* Pass placeholder or different view if resuming without file content */}
                                    <PdfViewer file={file} risks={analysisData?.risks} />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right sidebar - Chat (expands when analysis is done) */}
                    <div className={`${analysisData ? 'lg:col-span-4' : 'hidden'} transition-all duration-500`}>
                        {analysisData && (
                            <ChatSidebar
                                chatId={chatId}
                                file={file}
                                documentContext={analysisData?.full_text || ""}
                                analysisData={analysisData}
                                isExpanded={!!analysisData}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}