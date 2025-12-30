import Link from "next/link";
import { ArrowLeft, Cookie, Check } from "lucide-react";
import Footer from "@/components/landing-page/Footer";

export default function CookiePolicy() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-violet-500/30 flex flex-col">
            <div className="relative z-10 max-w-3xl mx-auto px-6 py-20 flex-grow w-full">
                <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Back to Home</span>
                </Link>

                <header className="mb-16">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/25">
                        <Cookie className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
                    <p className="text-white/60">We use cookies to improve your experience.</p>
                </header>

                <div className="grid gap-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-xl font-semibold text-white mb-6">How We Use Cookies</h2>
                        <div className="space-y-4">
                            <CookieRow
                                title="Essential Cookies"
                                desc="Necessary for the website to function, such as secure log-in sessions."
                                required
                            />
                            <CookieRow
                                title="Analytics Cookies"
                                desc="Help us understand how visitors interact with the website."
                            />
                            <CookieRow
                                title="Functional Cookies"
                                desc="Remember your choices like language or region."
                            />
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                        <h2 className="text-xl font-semibold text-white mb-4">Managing Preferences</h2>
                        <p className="text-white/70 leading-relaxed text-sm">
                            Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience, since it will no longer be personalized to you. It may also stop you from saving customized settings like login information.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

function CookieRow({ title, desc, required = false }: { title: string, desc: string, required?: boolean }) {
    return (
        <div className="flex items-start gap-4 p-4 rounded-xl bg-black/20">
            <div className={`mt-1 w-5 h-5 rounded-md flex items-center justify-center border ${required ? 'bg-violet-500 border-violet-500' : 'border-white/20'}`}>
                {required && <Check className="w-3 h-3 text-white" />}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-sm">{title}</h3>
                    {required && <span className="text-[10px] uppercase bg-white/10 px-2 py-0.5 rounded-full text-white/50">Required</span>}
                </div>
                <p className="text-white/50 text-xs mt-1">{desc}</p>
            </div>
        </div>
    );
}
