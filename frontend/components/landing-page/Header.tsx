"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { Scale, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import AuthModal from '@/components/auth/AuthModal';
import { useSession, signOut } from '@/lib/auth-client';

const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "/about" },
];

export default function Header() {
    const { data: session, isPending } = useSession();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
    const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');
    const [showUserMenu, setShowUserMenu] = React.useState(false);
    const userMenuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const handleLogout = async () => {
        await signOut();
        setShowUserMenu(false);
        window.location.reload();
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
                            <Link
                                key={index}
                                href={link.href}
                                className="text-sm text-white/60 hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Buttons / User Menu */}
                    <div className="hidden md:flex items-center gap-3">
                        {isPending ? (
                            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                        ) : session?.user ? (
                            // User is logged in - show profile
                            <div ref={userMenuRef} className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                                >
                                    {(session.user as unknown as { isPro?: boolean }).isPro ? (
                                        <div className="relative">
                                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 opacity-75 blur-sm" />
                                            {session.user.image ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
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
                                    <span className="text-sm text-white/80">
                                        {session.user.name || session.user.email?.split('@')[0]}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-xl overflow-hidden z-[100]">
                                        <div className="px-4 py-3 border-b border-white/10">
                                            <p className="text-sm font-medium text-white truncate">
                                                {session.user.name}
                                            </p>
                                            <p className="text-xs text-white/50 truncate">
                                                {session.user.email}
                                            </p>
                                        </div>
                                        <Link
                                            href="/upload"
                                            onClick={() => setShowUserMenu(false)}
                                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition-colors"
                                        >
                                            📄 Analyze Contract
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
                            // User not logged in - show sign in/up buttons
                            <>
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
                            </>
                        )}
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
                            <Link
                                key={index}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block py-2 text-white/70 hover:text-white transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-white/10 space-y-3">
                            {session?.user ? (
                                // User logged in - mobile view
                                <>
                                    <div className="flex items-center gap-3 py-2">
                                        {session.user.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={session.user.image}
                                                alt={session.user.name || 'User'}
                                                className="w-10 h-10 rounded-full border border-white/20"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                                <span className="text-white font-medium">
                                                    {session.user.name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-white font-medium">{session.user.name}</p>
                                            <p className="text-xs text-white/50">{session.user.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/upload"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block w-full py-3 text-center rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium"
                                    >
                                        Analyze Contract
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-3 text-red-400 hover:text-red-300 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </>
                            ) : (
                                // User not logged in - mobile view
                                <>
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
                                </>
                            )}
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
