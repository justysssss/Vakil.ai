"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Bot, User, FileText, Sparkles, AlertCircle } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface ChatSidebarProps {
    file: File | null;
    documentContext: string; // <--- Added this prop
}

export default function ChatSidebar({ file, documentContext }: ChatSidebarProps) {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation: Must have input, file, and the text must be analyzed already
        if (!input.trim() || !file) return;
        
        if (!documentContext) {
            alert("Please click 'Analyze Contract' first so I can read the document!");
            return;
        }

        // 1. Add User Message to UI immediately
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
            // 2. Prepare the History for the Backend
            // We map the existing state to the simple format backend expects
            const historyPayload = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // 3. Call the Backend
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: userMessage.content,
                    history: historyPayload,
                    document_context: documentContext // <--- Crucial: Sending the PDF text
                }),
            });

            if (!response.ok) throw new Error("Failed to fetch response");

            const data = await response.json();

            // 4. Add Assistant Message to UI
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.answer, // <--- Response from Groq/Llama
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error("Chat Error:", error);
            // Add error message to chat
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error connecting to the server. Please check if the backend is running.",
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full h-[600px] flex flex-col rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden"
        >
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Chat with PDF</h3>
                        <p className="text-xs text-white/50">Ask questions about your contract</p>
                    </div>
                </div>
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
                            <p className="text-white/60 font-medium">No PDF uploaded yet</p>
                            <p className="text-white/40 text-sm mt-2">
                                Upload a contract to start chatting with it
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
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-violet-400" />
                            </div>
                            <p className="text-white/80 font-medium">Ready to analyze</p>
                            <p className="text-white/50 text-sm mt-2">
                                Ask me anything about "{file.name}"
                            </p>
                            
                            {/* Warning if analyzed data is missing */}
                            {!documentContext && (
                                <div className="mt-4 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center gap-2 text-yellow-200/80 text-xs">
                                    <AlertCircle className="w-3 h-3" />
                                    <span>Please click "Analyze" first to enable chat</span>
                                </div>
                            )}

                            <div className="mt-6 space-y-2 w-full">
                                {[
                                    "What are the key clauses?",
                                    "Any risky terms?",
                                    "Summarize the contract",
                                ].map((suggestion, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(suggestion);
                                            // Optional: Auto-send on click
                                        }}
                                        className="w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 
                                                 text-white/60 text-sm text-left transition-all duration-200
                                                 border border-white/5 hover:border-white/10"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <>
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
                                            : <Bot className="w-4 h-4 text-white" />
                                        }
                                    </div>
                                    <div className={`
                                        max-w-[80%] px-4 py-3 rounded-2xl text-sm
                                        ${message.role === 'user'
                                            ? 'bg-violet-500/20 text-white rounded-tr-md'
                                            : 'bg-white/10 text-white/90 rounded-tl-md'
                                        }
                                    `}>
                                        {message.content}
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
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white/10">
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <motion.div
                                                    key={i}
                                                    className="w-2 h-2 rounded-full bg-white/40"
                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                    transition={{
                                                        duration: 1,
                                                        repeat: Infinity,
                                                        delay: i * 0.2,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-4 border-t border-white/10">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={documentContext ? "Ask about the contract..." : "Analyze document first..."}
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
                                 transition-all duration-200"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </motion.aside>
    );
}