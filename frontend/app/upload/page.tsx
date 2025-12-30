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
import { createChatSession, saveDocument, getChat, analyzeDocumentAction } from '@/lib/actions';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

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

    // 1. Load Session from URL if present
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
                        // The actual PDF content is missing in the browser, so PDF Viewer won't work perfectly
                        // but Chat will work because we have context in DB/analysisData.
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
    }, [urlChatId, analysisData]);

    // Fetch Usage Stats
    const [usageStats, setUsageStats] = React.useState<{
        isPro: boolean;
        uploads: { used: number; limit: number };
        messages: { used: number; limit: number | string };
    } | null>(null);

    React.useEffect(() => {
        if (session?.user?.id) {
            import("@/lib/actions").then(async ({ getUsageStats }) => {
                const stats = await getUsageStats(session.user.id);
                if (stats.success) {
                    setUsageStats(stats as any);
                }
            });
        }
    }, [session?.user?.id, analysisData]); // Re-fetch after analysis (upload count changes)

    // 2. Close dropdown when clicking outside
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

    // 3. The Function to Call Backend
    const handleAnalyze = async () => {
        if (!session?.user) {
            toast.error("Please sign in to analyze documents.");
            return;
        }
        if (!file) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            // A. Call AI Analysis (Python Backend via Server Action)
            const result = await analyzeDocumentAction(formData);

            if (!result.success || !result.data) {
                throw new Error(result.error || "Analysis failed");
            }

            const data = result.data; // Extract data to avoid scope issues
            setAnalysisData(data);

            // B. Save Analysis to Database
            const saveResult = await saveDocument(
                session.user.id,
                file.name,
                data.full_text, // Use the text returned from backend
                data,
                data.score || 0
            );

            if (saveResult.success && saveResult.docId) {
                // C. Create Chat Session
                const chatResult = await createChatSession(session.user.id, saveResult.docId);

                if (chatResult.success && chatResult.chatId) {
                    setChatId(chatResult.chatId);
                } else {
                    console.warn("Chat session created but ID missing or failed", chatResult);
                    setChatId(null);
                }
            } else {
                console.error("Failed to save document:", saveResult.error);
                toast.error("Failed to save analysis results.");
            }

            toast.success("Analysis complete!");

        } catch (error) {
            console.error(error);
            toast.error(error instanceof Error ? error.message : "Error analyzing document. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setAnalysisData(null);
        setChatId(null);
        // Optional: clear URL params here using router.replace if desired
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
                                    {(session.user as any).isPro ? (
                                        <div className="relative">
                                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 opacity-75 blur-sm" />
                                            {session.user.image ? (
                                                <img
                                                    src={session.user.image}
                                                    alt={session.user.name || 'User'}
                                                    className="relative w-8 h-8 rounded-full border-2 border-amber-400"
                                                />
                                            ) : (
                                                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center border-2 border-amber-400">
                                                    <span className="text-white text-sm font-medium">
                                                        {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'U'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ) : session.user.image ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={session.user.image}
                                            alt={session.user.name || 'User'}
                                            className="w-8 h-8 rounded-full border border-white/20"
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
                                        <Link
                                            href="/profile"
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition-colors"
                                        >
                                            <Scale className="w-4 h-4 text-violet-400" />
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
                            <>
                                {/* Usage Badge */}
                                {usageStats && (
                                    <div className="flex justify-center mb-6">
                                        <div className={`
                                            inline-flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-md
                                            ${usageStats.isPro
                                                ? 'bg-violet-500/10 border-violet-500/20'
                                                : 'bg-white/5 border-white/10'
                                            }
                                        `}>
                                            <span className="text-sm text-white/50">Monthly Uploads:</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className={`font-semibold ${usageStats.uploads.used >= usageStats.uploads.limit ? 'text-red-400' : 'text-white'}`}>
                                                    {usageStats.uploads.used}
                                                </span>
                                                <span className="text-white/30">/</span>
                                                <span className="text-white/50">{usageStats.uploads.limit}</span>
                                            </div>
                                            {!usageStats.isPro && (
                                                <Link href="/pricing" className="ml-2 text-xs text-violet-400 hover:text-violet-300 font-medium">
                                                    Upgrade
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <Dropzone
                                    onFileSelect={setFile}
                                    accept={['application/pdf']}
                                    selectedFile={file}
                                />
                            </>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <UploadControls
                                    file={file}
                                    isAnalyzing={isAnalyzing}
                                    onAnalyze={handleAnalyze}
                                    onClear={handleClear}
                                    // Disable Analyze button if it's a dummy file (size 0) from history
                                    // or if we are currently analyzing
                                    disabled={!file.size || isAnalyzing}
                                />
                                <div className={`mt-4 rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl shadow-violet-500/10 transition-all duration-500 ${analysisData ? 'h-[750px]' : 'h-[600px]'}`}>
                                    {/* Note: PdfViewer requires a real file blob URL to render the PDF.
                                      If loading from history (dummy file), this might show a blank/error state 
                                      unless PdfViewer handles file.size === 0 gracefully.
                                    */}
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