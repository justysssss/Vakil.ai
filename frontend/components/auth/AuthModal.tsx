"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'signin' | 'signup';
    onModeChange: (mode: 'signin' | 'signup') => void;
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [name, setName] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/upload",
            });
        } catch {
            setError("Failed to sign in with Google. Please try again.");
            setIsLoading(false);
        }
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const result = await signUp.email({
                    email,
                    password,
                    name,
                    callbackURL: "/upload",
                });
                if (result.error) {
                    setError(result.error.message || "Failed to create account");
                } else {
                    onClose();
                    router.push('/upload');
                }
            } else {
                const result = await signIn.email({
                    email,
                    password,
                    callbackURL: "/upload",
                });
                if (result.error) {
                    setError(result.error.message || "Invalid email or password");
                } else {
                    onClose();
                    router.push('/upload');
                }
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Reset form when modal closes
    React.useEffect(() => {
        if (!isOpen) {
            setEmail('');
            setPassword('');
            setName('');
            setError(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="relative w-full max-w-md rounded-3xl bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl">
                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-white">
                                    {mode === 'signin' ? 'Welcome back' : 'Create account'}
                                </h2>
                                <p className="text-white/50 text-sm mt-2">
                                    {mode === 'signin'
                                        ? 'Sign in to continue to VakilVerify'
                                        : 'Get started with AI contract analysis'
                                    }
                                </p>
                            </div>

                            {/* Error message */}
                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Google button */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl 
                                         bg-white text-gray-800 font-medium text-sm
                                         hover:bg-gray-100 transition-all duration-200
                                         disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                )}
                                Continue with Google
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[#0a0a0a] text-white/40">or continue with email</span>
                                </div>
                            </div>

                            {/* Email form */}
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                {mode === 'signup' && (
                                    <div>
                                        <label className="block text-sm text-white/60 mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                                required
                                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 
                                                         text-white placeholder-white/40 text-sm
                                                         focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
                                                         transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 
                                                     text-white placeholder-white/40 text-sm
                                                     focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
                                                     transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 
                                                     text-white placeholder-white/40 text-sm
                                                     focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20
                                                     transition-all duration-200"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 
                                             text-white font-semibold text-sm
                                             hover:from-violet-600 hover:to-purple-700
                                             disabled:opacity-50 disabled:cursor-not-allowed
                                             transition-all duration-200 shadow-lg shadow-violet-500/25
                                             flex items-center justify-center gap-2"
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                                </button>
                            </form>

                            {/* Switch mode */}
                            <p className="mt-6 text-center text-sm text-white/50">
                                {mode === 'signin' ? (
                                    <>
                                        Don&apos;t have an account?{' '}
                                        <button
                                            onClick={() => onModeChange('signup')}
                                            className="text-violet-400 hover:text-violet-300 font-medium"
                                        >
                                            Sign up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{' '}
                                        <button
                                            onClick={() => onModeChange('signin')}
                                            className="text-violet-400 hover:text-violet-300 font-medium"
                                        >
                                            Sign in
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
