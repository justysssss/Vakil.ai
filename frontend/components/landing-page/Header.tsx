"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { Scale, Menu, X } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/auth/AuthModal';

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
    const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const openSignIn = () => {
        setAuthMode('signin');
        setIsAuthModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    const openSignUp = () => {
        setAuthMode('signup');
        setIsAuthModalOpen(true);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`
                    fixed top-0 left-0 right-0 z-50 transition-all duration-300
                    ${isScrolled
                        ? 'bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 py-3'
                        : 'bg-transparent py-5'
                    }
                `}
            >
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Scale className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white leading-none">Vakil.ai</span>
                            <span className="text-[10px] text-white/50 leading-none mt-0.5">Legal AI Auditor</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="text-sm text-white/60 hover:text-white transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={openSignIn}
                            className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={openSignUp}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-violet-500/25"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed inset-x-0 top-[72px] z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 md:hidden"
                >
                    <div className="p-6 space-y-4">
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-2 text-white/70 hover:text-white transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <div className="pt-4 border-t border-white/10 space-y-3">
                            <button
                                onClick={openSignIn}
                                className="w-full py-3 text-white/70 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={openSignUp}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                mode={authMode}
                onModeChange={setAuthMode}
            />
        </>
    );
}
