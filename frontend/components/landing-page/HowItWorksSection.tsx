"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, FileCheck, Sparkles } from 'lucide-react';

const steps = [
    {
        number: "01",
        icon: Upload,
        title: "Upload Contract",
        description: "Drop your PDF contract into VakilVerify. We support all standard contract formats up to 25MB.",
        color: "violet",
    },
    {
        number: "02",
        icon: Cpu,
        title: "RAG Pipeline Analysis",
        description: "Your document is vectorized and checked against our legal knowledge base. The AI identifies risks based on context, not just keywords.",
        color: "purple",
    },
    {
        number: "03",
        icon: FileCheck,
        title: "Risk Assessment",
        description: "Get a comprehensive risk heatmap highlighting problematic clauses with severity scores.",
        color: "pink",
    },
    {
        number: "04",
        icon: Sparkles,
        title: "Chat & Verify",
        description: "Don't understand a clause? Chat with your AI lawyer to get instant simplifications and verification of facts.",
        color: "rose",
    },
];

export default function HowItWorksSection() {
    return (
        <section className="relative py-24 px-6 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
                        Simple Process
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        How it works
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Go from uploaded PDF to actionable insights in under a minute
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-24 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-violet-500/50 via-purple-500/50 to-rose-500/50" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="relative flex flex-col items-center text-center"
                            >
                                {/* Step number & icon */}
                                <div className="relative mb-6">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className={`
                                            w-20 h-20 rounded-2xl bg-gradient-to-br 
                                            from-${step.color}-500 to-${step.color}-600
                                            flex items-center justify-center
                                            shadow-lg shadow-${step.color}-500/25
                                        `}
                                        style={{
                                            background: index === 0 ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' :
                                                index === 1 ? 'linear-gradient(135deg, #a855f7, #9333ea)' :
                                                    index === 2 ? 'linear-gradient(135deg, #ec4899, #db2777)' :
                                                        'linear-gradient(135deg, #f43f5e, #e11d48)'
                                        }}
                                    >
                                        <step.icon className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#0a0a0a] border-2 border-white/20 flex items-center justify-center">
                                        <span className="text-xs font-bold text-white">{step.number}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-white/50 text-sm leading-relaxed max-w-[250px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
