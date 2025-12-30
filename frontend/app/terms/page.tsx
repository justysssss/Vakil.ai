import Link from "next/link";
import { ArrowLeft, Scale, AlertTriangle, FileCheck } from "lucide-react";
import Footer from "@/components/landing-page/Footer";

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-violet-500/30 flex flex-col">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-purple-600/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 flex-grow w-full">
                <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Back to Home</span>
                </Link>

                <header className="mb-16 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20 mb-6">
                        <Scale className="w-8 h-8 text-violet-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-white/60">Effective Date: {new Date().toLocaleDateString()}</p>
                </header>

                <div className="space-y-12">
                    <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-4">
                        <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                        <div>
                            <h3 className="text-amber-200 font-semibold mb-1">Crucial Disclaimer</h3>
                            <p className="text-amber-200/70 text-sm">
                                VakilAI is an automated analysis tool, not a law firm. The insights provided are for informational purposes only and do <strong>not</strong> constitute legal advice or create an attorney-client relationship. Always consult a qualified lawyer for final review.
                            </p>
                        </div>
                    </div>

                    <TermSection title="1. Acceptance of Terms" number="01">
                        By creating an account or using VakilAI, you agree to these legal terms. If you are using the service on behalf of an organization, you agree to these terms for that organization and promise that you have the authority to do so.
                    </TermSection>

                    <TermSection title="2. User Obligations" number="02">
                        You agree to upload only documents that you have the lawful right to process. You shall not upload malicious files, classified government secrets, or illegal content. You are responsible for maintaining the confidentiality of your account credentials.
                    </TermSection>

                    <TermSection title="3. Intellectual Property" number="03">
                        We claim no ownership over the documents you upload. The analysis reports generated are yours to use. The underlying technology, design, and AI models of VakilAI remain our exclusive property.
                    </TermSection>

                    <TermSection title="4. Limitation of Liability" number="04">
                        To the maximum extent permitted by law, VakilAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues. Our total liability shall not exceed the amount you paid us in the past 12 months.
                    </TermSection>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function TermSection({ title, number, children }: { title: string, number: string, children: React.ReactNode }) {
    return (
        <div className="relative pl-8 md:pl-12 border-l border-white/10">
            <span className="absolute left-[-9px] top-0 w-[17px] h-[17px] rounded-full bg-[#0a0a0a] border border-white/20 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            </span>
            <span className="text-xs font-mono text-white/30 mb-2 block">{number}</span>
            <h2 className="text-xl font-semibold text-white mb-3">{title}</h2>
            <p className="text-white/70 leading-relaxed text-sm md:text-base">
                {children}
            </p>
        </div>
    );
}
