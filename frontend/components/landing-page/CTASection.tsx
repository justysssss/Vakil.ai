"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="relative py-24 px-6 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 via-purple-600/10 to-transparent" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-violet-600/30 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-purple-600/30 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-8"
                    >
                        <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                        Ready to protect your
                        <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            business contracts?
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                        Join thousands of Indian businesses using AI to identify risks,
                        ensure compliance, and negotiate better terms.
                    </p>

                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/upload">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl 
                                         bg-gradient-to-r from-violet-500 to-purple-600 
                                         text-white font-semibold text-lg
                                         hover:from-violet-600 hover:to-purple-700
                                         shadow-lg shadow-violet-500/30
                                         transition-all duration-200"
                            >
                                Analyze Your First Contract
                                <ArrowRight className="w-5 h-5" />
                            </motion.button>
                        </Link>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl 
                                     bg-white/10 border border-white/20
                                     text-white font-semibold text-lg
                                     hover:bg-white/20
                                     transition-all duration-200"
                        >
                            View Demo
                        </motion.button>
                    </div>

                    {/* Trust note */}
                    <p className="mt-8 text-sm text-white/40">
                        No credit card required • Free tier available • Enterprise-ready
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
