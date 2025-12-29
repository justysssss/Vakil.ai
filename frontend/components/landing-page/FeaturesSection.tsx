"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    Zap,
    FileSearch,
    AlertTriangle,
    Mail,
    Scale,
    Clock,
    Languages
} from 'lucide-react';

const features = [
    {
        icon: FileSearch,
        title: "AI-Powered Analysis",
        description: "Advanced NLP extracts and analyzes every clause for potential risks",
        gradient: "from-violet-500 to-purple-600",
    },
    {
        icon: AlertTriangle,
        title: "Risk Heatmaps",
        description: "Visual red-zone highlighting shows exactly where problems lie",
        gradient: "from-red-500 to-orange-600",
    },
    {
        icon: Shield,
        title: "MSME Protection",
        description: "45-day payment alert compliance as per MSMED Act regulations",
        gradient: "from-emerald-500 to-teal-600",
    },
    {
        icon: Mail,
        title: "Auto-Generated Drafts",
        description: "Safe counter-clauses and professional email templates ready to send",
        gradient: "from-blue-500 to-cyan-600",
    },
    {
        icon: Scale,
        title: "Stamp Duty Auditor",
        description: "Automatic calculation and verification for Indian jurisdictions",
        gradient: "from-amber-500 to-orange-600",
    },
    {
        icon: Clock,
        title: "Instant Results",
        description: "Get comprehensive analysis in under 60 seconds",
        gradient: "from-pink-500 to-rose-600",
    },
];

export default function FeaturesSection() {
    return (
        <section className="relative py-24 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[150px]" />
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
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
                        <Zap className="w-4 h-4" />
                        Powerful Features
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Everything you need to audit
                        <span className="block bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                            contracts confidently
                        </span>
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Built specifically for Indian legal frameworks, VakilVerify combines AI precision
                        with deep regulatory knowledge.
                    </p>
                </motion.div>

                {/* Features grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm
                                     hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            {/* Icon */}
                            <div className={`
                                w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} 
                                flex items-center justify-center mb-4
                                group-hover:scale-110 transition-transform duration-300
                            `}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-semibold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-white/60 text-sm leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover glow effect */}
                            <div className={`
                                absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} 
                                opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none
                            `} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
