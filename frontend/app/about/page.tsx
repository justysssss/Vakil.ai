import Link from "next/link";
import { ArrowLeft, Users, Linkedin, Github, Globe, Heart } from "lucide-react";
import Footer from "@/components/landing-page/Footer";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-violet-500/30 flex flex-col">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 flex-grow w-full">
                <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Back to Home</span>
                </Link>

                {/* Hero Section */}
                <header className="mb-20 text-center">
                    <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-6">
                        <Users className="w-3 h-3" />
                        Our Story
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-8">
                        Born from a Real Problem.
                    </h1>
                    <p className="text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
                        We didn't build VakilAI just for fun. We built it because we saw good people get hurt by bad contracts.
                    </p>
                </header>

                {/* The Origin Story */}
                <section className="mb-24">
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <h2 className="text-2xl font-bold text-white mb-6 relative z-10">Why We Started</h2>
                        <div className="space-y-4 text-white/70 leading-relaxed relative z-10">
                            <p>
                                It started when a close friend of ours landed his first major job opportunity. He was excited, eager, and—like many of us—didn't read the fine print.
                            </p>
                            <p>
                                Buried deep in the contract was a generic-looking employment bond that legally locked him into the company for two years. He signed it. When he tried to switch to a better role later, he was blindsided by a massive financial penalty clause he hadn't noticed. He was trapped. He lost months of career progress and peace of mind, all because of a few lines of text he didn't understand.
                            </p>
                            <p>
                                We realized this wasn't just his problem. Legalese is designed to be confusing. Whether you're a freelancer, a startup founder, or a student renting an apartment, you're constantly signing things you don't fully grasp.
                            </p>
                            <p className="font-medium text-white pt-2 border-l-2 border-violet-500 pl-4">
                                We decided to fix this. We built VakilAI to level the playing field—giving everyone access to a legal expert, without the $500/hour bill.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section>
                    <h2 className="text-3xl font-bold text-white text-center mb-12">Meet the Builders</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Sourish */}
                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/[0.07] transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-400/20">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/sourish_dp.png" alt="Sourish Bose" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Sourish Bose</h3>
                                    <p className="text-sm text-white/50">Co-Founder & Full Stack Engineer</p>
                                    <p className="text-xs text-white/40 mt-1">Recent CS Graduate</p>
                                </div>
                            </div>
                            <p className="text-white/60 text-sm mb-6 leading-relaxed">
                                Passionate about engineering scalable full-stack applications and applied AI. Focused on bridging the gap between complex research models and intuitive user experiences.
                            </p>
                            <div className="flex gap-4">
                                <SocialLink href="https://github.com/justysssss" icon={<Github className="w-4 h-4" />} />
                                <SocialLink href="https://www.linkedin.com/in/sourishbose10/" icon={<Linkedin className="w-4 h-4" />} />
                                <SocialLink href="https://sourishbose.vercel.app/" icon={<Globe className="w-4 h-4" />} />
                            </div>
                        </div>

                        {/* Ankan */}
                        <div className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.07] transition-all duration-300">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-400/20">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src="/ankan_dp.jpg" alt="Ankan Paul" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">Ankan Paul</h3>
                                    <p className="text-sm text-white/50">Co-Founder & ML Engineer</p>
                                    <p className="text-xs text-white/40 mt-1">4th Year, Computer Science</p>
                                </div>
                            </div>
                            <p className="text-white/60 text-sm mb-6 leading-relaxed">
                                Obsessed with AI/ML and scalable backend systems. Responsible for the RAG pipeline, model integration, and core API logic. Turning complex research concepts into fast, reliable production code.
                            </p>
                            <div className="flex gap-4">
                                <SocialLink href="https://github.com/apaul02" icon={<Github className="w-4 h-4" />} />
                                <SocialLink href="https://www.linkedin.com/in/ankan-paul02/" icon={<Linkedin className="w-4 h-4" />} />
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="mt-24 pt-10 border-t border-white/10 text-center flex flex-col items-center gap-4">
                    <p className="text-white/40 text-sm flex items-center gap-1">
                        Made with <Heart className="w-4 h-4 text-red-500 fill-red-500/50" /> by Students, for Everyone.
                    </p>
                </footer>
            </div>
            <Footer />
        </div>
    );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
        >
            {icon}
        </a>
    );
}
