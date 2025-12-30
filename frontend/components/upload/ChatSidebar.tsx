"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, FileText, Sparkles, AlertCircle, Scale, Loader2 } from 'lucide-react';
import { getChatResponseAction, saveMessage, getChatMessages } from '@/lib/actions';
import ReactMarkdown from 'react-markdown';

// --- Types ---
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface Risk {
    clause: string;
    risk_level: "High" | "Medium" | "Low";
    reason: string;
    suggestion: string;
}

type MessageHistory = {
  role: "user" | "assistant";
  content: string;
};

interface ChatSidebarProps {
    file: File | null;
    documentContext: string;
    chatId: string | null;
    analysisData?: {
        summary?: string;
        risks?: Risk[];
        score?: number;
    } | null;
    isExpanded?: boolean;
}

export default function ChatSidebar({ 
    file, 
    documentContext, 
    chatId, 
    analysisData, 
    isExpanded = false 
}: ChatSidebarProps) {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // --- 1. Auto-scroll to bottom ---
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // --- 2. Load Chat History when chatId changes ---
    React.useEffect(() => {
        const loadHistory = async () => {
            if (chatId) {
                try {
                    const result = await getChatMessages(chatId);
                    if (result.success && result.messages) {
                        const history: Message[] = result.messages.map((m) => ({
                            id: m.id,
                            role: m.role as 'user' | 'assistant',
                            content: m.content,
                            timestamp: new Date(m.createdAt)
                        }));
                        setMessages(history);
                    }
                } catch (e) {
                    console.error("Failed to load chat history:", e);
                }
            } else {
                // Reset messages if no chat ID (e.g. cleared session)
                setMessages([]);
            }
        };
        loadHistory();
    }, [chatId]);

    // --- 3. Dynamic Suggestions Logic ---
    const getDynamicSuggestions = (): string[] => {
        const baseSuggestions = [
            "Summarize this contract in simple terms",
            "What are the key obligations for each party?",
            "Explain the termination clause",
        ];

        if (analysisData?.risks && analysisData.risks.length > 0) {
            const riskSuggestions = analysisData.risks.slice(0, 2).map(risk => 
                `Explain the risk: "${risk.clause.substring(0, 40)}..."`
            );
            return [...riskSuggestions, baseSuggestions[0]];
        }

        return baseSuggestions;
    };

    // --- 4. Send Message Handler ---
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!input.trim() || !file) return;

        if (!documentContext) {
            alert("Please click 'Analyze Contract' first so I can read the document!");
            return;
        }

        // A. Add User Message to UI (Optimistic)
        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            // B. Save User Message to DB (Fire & Forget)
            if (chatId) {
                saveMessage(chatId, 'user', userMessage.content);
            }

            // C. Call AI Server Action
            // We map the messages to simple objects to avoid passing Date objects or extra fields to Server Action if needed
            const historyPayload: MessageHistory[] = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const result = await getChatResponseAction(
                chatId || "temp", // Fallback if ID missing, though UI usually prevents this
                userMessage.content,
                historyPayload,
                documentContext
            );

            if (!result.success) {
                throw new Error(result.error || "Failed to get response");
            }

            // D. Add Assistant Message to UI
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: result.answer,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

            // E. Save Assistant Message to DB (Fire & Forget)
            if (chatId) {
                saveMessage(chatId, 'assistant', assistantMessage.content);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I couldn't connect to VakilAI. Please try again later.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (documentContext) {
            setInput(suggestion);
            // Small timeout to allow state to update before submitting
            setTimeout(() => {
                const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                submitButton?.click();
            }, 100);
        }
    };

    return (
        <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`
                w-full flex flex-col rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden
                transition-all duration-500 ease-out
                ${isExpanded ? 'h-[calc(100vh-12rem)]' : 'h-[600px]'}
            `}
        >
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-white/10 bg-gradient-to-r from-violet-500/10 to-purple-600/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <Scale className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            VakilAI
                            {documentContext && (
                                <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-medium">
                                    ACTIVE
                                </span>
                            )}
                        </h3>
                        <p className="text-xs text-white/50">Your AI Legal Guardian</p>
                    </div>
                </div>

                {/* Analysis summary badge */}
                {analysisData?.score !== undefined && (
                    <div className="mt-3 flex items-center gap-2">
                        <div className={`
                            px-3 py-1.5 rounded-lg text-xs font-medium
                            ${analysisData.score > 70 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : analysisData.score > 40 
                                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }
                        `}>
                            Safety Score: {analysisData.score}/100
                        </div>
                        {analysisData.risks && analysisData.risks.length > 0 && (
                            <span className="text-xs text-white/50">
                                {analysisData.risks.length} risk{analysisData.risks.length > 1 ? 's' : ''} found
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {!file ? (
                        <motion.div
                            key="no-file"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center text-center px-4"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                                <FileText className="w-8 h-8 text-white/40" />
                            </div>
                            <p className="text-white/60 font-medium">No PDF uploaded</p>
                            <p className="text-white/40 text-sm mt-2">
                                Upload a contract to start chatting with VakilAI
                            </p>
                        </motion.div>
                    ) : messages.length === 0 ? (
                        <motion.div
                            key="empty-chat"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-full flex flex-col items-center justify-center text-center px-4"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-6 border border-violet-500/20">
                                <Sparkles className="w-10 h-10 text-violet-400" />
                            </div>
                            <h4 className="text-white font-semibold text-lg">
                                {documentContext ? "Ready to help!" : "Analyzing..."}
                            </h4>
                            <p className="text-white/50 text-sm mt-2 max-w-[280px]">
                                {documentContext 
                                    ? `Ask me anything about "${file.name}". I've analyzed the document and found ${analysisData?.risks?.length || 0} potential risks.`
                                    : "Click 'Analyze Contract' to enable AI chat"
                                }
                            </p>

                            {!documentContext && (
                                <div className="mt-4 px-4 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2 text-amber-200/80 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>Click &quot;Analyze&quot; to enable chat</span>
                                </div>
                            )}

                            {documentContext && (
                                <div className="mt-6 space-y-2 w-full">
                                    <p className="text-xs text-white/40 text-left mb-3">Suggested questions:</p>
                                    {getDynamicSuggestions().map((suggestion, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            className="w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-violet-500/20 
                                                     text-white/70 hover:text-white text-sm text-left transition-all duration-200
                                                     border border-white/5 hover:border-violet-500/30
                                                     flex items-center gap-3"
                                        >
                                            <MessageSquare className="w-4 h-4 text-violet-400" />
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <>
                            {/* Welcome message bubble - only show if there are messages */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex gap-3 mb-4"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <Scale className="w-4 h-4 text-white" />
                                </div>
                                <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/10 text-white/90 text-sm">
                                    <p>👋 Hi! I&apos;m VakilAI. I&apos;ve analyzed your contract. What would you like to know?</p>
                                </div>
                            </motion.div>

                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`
                                        flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center
                                        ${message.role === 'user' 
                                            ? 'bg-violet-500/20' 
                                            : 'bg-gradient-to-br from-violet-500 to-purple-600'}
                                    `}>
                                        {message.role === 'user' 
                                            ? <User className="w-4 h-4 text-violet-400" />
                                            : <Scale className="w-4 h-4 text-white" />
                                        }
                                    </div>
                                    <div className={`
                                        max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed
                                        ${message.role === 'user' 
                                            ? 'bg-violet-500/20 text-white rounded-tr-md' 
                                            : 'bg-white/10 text-white/90 rounded-tl-md'
                                        }
                                    `}>
                                        <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5">
                                            <ReactMarkdown>{message.content}</ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex gap-3"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                        <Scale className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/10 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                                        <span className="text-sm text-white/50">VakilAI is thinking...</span>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-4 border-t border-white/10 bg-white/5">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={documentContext ? "Ask VakilAI about your contract..." : "Analyze document first..."}
                        disabled={!file || !documentContext || isTyping}
                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 
                                 text-white placeholder-white/40 text-sm
                                 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-200"
                    />
                    <button
                        type="submit"
                        disabled={!file || !input.trim() || !documentContext || isTyping}
                        className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 
                                 text-white font-medium
                                 hover:from-violet-600 hover:to-purple-700
                                 disabled:opacity-50 disabled:cursor-not-allowed
                                 transition-all duration-200 shadow-lg shadow-violet-500/25
                                 hover:shadow-violet-500/40"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </motion.aside>
    );
}