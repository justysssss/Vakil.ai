import Link from "next/link";
import { ArrowLeft, Book, Shield, FileText, MessageSquare, Zap, HelpCircle } from "lucide-react";
import Footer from "@/components/landing-page/Footer";

export default function Documentation() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans selection:bg-violet-500/30 flex flex-col">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20 flex-grow w-full">
                {/* Header */}
                <header className="mb-16">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-6">
                        <Book className="w-3 h-3" />
                        User Guide
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-6">
                        Documentation
                    </h1>
                    <p className="text-xl text-white/60 leading-relaxed max-w-2xl">
                        Master VakilAI in minutes. Learn how to analyze contracts, detect risks, and chat with your legal AI assistant.
                    </p>
                </header>

                <div className="space-y-16">
                    {/* Getting Started Section */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                            <Zap className="w-6 h-6 text-amber-400" />
                            Getting Started
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <StepCard
                                number="01"
                                title="Sign In Securely"
                                description="Create an account using Google Auth to ensure your session data is encrypted and saved."
                            />
                            <StepCard
                                number="02"
                                title="Upload Contract"
                                description="Drag & Drop any PDF (NDA, Lease, Employment Agreement). We accept files up to 10MB."
                            />
                            <StepCard
                                number="03"
                                title="AI Analysis"
                                description="Our engine scans for clauses, risks, and anomalies. This usually takes 5-10 seconds."
                            />
                            <StepCard
                                number="04"
                                title="Review & Chat"
                                description="Check the safety score and ask specific questions like 'Is the jurisdiction favorable?'."
                            />
                        </div>
                    </section>

                    {/* Features Deep Dive */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                            <Shield className="w-6 h-6 text-violet-400" />
                            Core Features
                        </h2>
                        <div className="space-y-4">
                            <FeatureRow
                                icon={<FileText className="w-5 h-5 text-blue-400" />}
                                title="Risk Detection Engine"
                                description="Automatically categorizes risks into High, Medium, and Low severity. We flag aggressive non-competes, missing termination clauses, and indefinite liability terms."
                            />
                            <FeatureRow
                                icon={<MessageSquare className="w-5 h-5 text-green-400" />}
                                title="Legal RAG Chat"
                                description="Unlike generic chatbots, VakilAI retrieves exact paragraphs from your document before answering. This ensures answers are grounded in *your* specific contract, not general knowledge."
                            />
                        </div>
                    </section>

                    {/* FAQ */}
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
                            <HelpCircle className="w-6 h-6 text-emerald-400" />
                            Frequently Asked Questions
                        </h2>
                        <div className="grid gap-4">
                            <FaqItem
                                question="Is my data safe?"
                                answer="Yes. We practice data minimization. Your original PDF files are processed in volatile memory and are never permanently stored on our disks. We only retain the vector embeddings and metadata needed for your session."
                            />
                            <FaqItem
                                question="What is the 'Safety Score'?"
                                answer="It's a proprietary composite score (0-100) based on the number and severity of risks found. A score below 50 indicates significant legal exposure."
                            />
                            <FaqItem
                                question="Can I delete my history?"
                                answer="Absolutely. You can delete individual sessions from your Profile page at any time. This permanently wipes specific chat logs and analysis data."
                            />
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
            <span className="text-sm font-bold text-white/20 mb-4 block group-hover:text-violet-500/50 transition-colors">{number}</span>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{description}</p>
        </div>
    );
}

function FeatureRow({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex gap-5 items-start">
            <div className="p-3 rounded-xl bg-[#0a0a0a] border border-white/10 shrink-0">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
    return (
        <details className="group p-5 rounded-2xl bg-white/5 border border-white/10 open:bg-white/[0.07] transition-colors cursor-pointer">
            <summary className="flex items-center justify-between font-medium text-white list-none">
                <span>{question}</span>
                <span className="opacity-50 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-4 text-sm text-white/60 leading-relaxed border-t border-white/10 pt-4">
                {answer}
            </div>
        </details>
    );
}
