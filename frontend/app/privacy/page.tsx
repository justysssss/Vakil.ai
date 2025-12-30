import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, Eye, Database } from "lucide-react";
import Footer from "@/components/landing-page/Footer";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-violet-500/30 flex flex-col">
            {/* Background Glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 flex-grow w-full">
                <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Back to Home</span>
                </Link>

                <header className="mb-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20 mb-6">
                        <Lock className="w-8 h-8 text-violet-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-white/60">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <div className="space-y-12">
                    <PolicySection
                        icon={<Eye className="w-5 h-5 text-blue-400" />}
                        title="1. Information We Collect"
                    >
                        <p>
                            We adhere to a strict <strong>data minimization</strong> policy. We collect only what is absolutely necessary:
                        </p>
                        <ul className="list-disc pl-5 space-y-2 mt-4 text-white/70 marker:text-violet-500">
                            <li><strong>Account Info:</strong> Name and email address (via Google Auth) to manage your sessions.</li>
                            <li><strong>Usage Data:</strong> Anonymous metrics on how you interact with our features to improve the service.</li>
                            <li><strong>Document Data:</strong> Temporary vectors extracted from your PDFs. We <strong>do not</strong> store the original PDF files.</li>
                        </ul>
                    </PolicySection>

                    <PolicySection
                        icon={<Database className="w-5 h-5 text-green-400" />}
                        title="2. How We Store Data"
                    >
                        <p>
                            We generally process documents in ephemeral memory.
                        </p>
                        <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
                            <h4 className="font-semibold text-white mb-2">Retention Policy</h4>
                            <p className="text-white/60">
                                Chats and analysis summaries are stored in our secure database (Neon Postgres) to allow you to review past sessions. You can delete these records permanently from your dashboard at any time.
                            </p>
                        </div>
                    </PolicySection>

                    <PolicySection
                        icon={<ShieldCheck className="w-5 h-5 text-amber-400" />}
                        title="3. Security Measures"
                    >
                        <p>
                            All data in transit is encrypted via TLS 1.2+. Vector databases are protected with access controls. We do not sell, rent, or trade your personal data to any third parties using your data for training purposes without explicit consent.
                        </p>
                    </PolicySection>

                    <PolicySection title="4. Contact Us">
                        <p>
                            If you have any questions about this Privacy Policy, please contact our Data Protection Officer at <a href="mailto:privacy@vakil.ai" className="text-violet-400 hover:underline">privacy@vakil.ai</a>.
                        </p>
                    </PolicySection>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function PolicySection({ title, children, icon }: { title: string, children: React.ReactNode, icon?: React.ReactNode }) {
    return (
        <section className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] transition-colors">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                {icon}
                {title}
            </h2>
            <div className="text-white/70 leading-relaxed space-y-4">
                {children}
            </div>
        </section>
    );
}
