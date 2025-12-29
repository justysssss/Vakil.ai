"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Check, AlertCircle, Shield, FileSearch, Mail } from 'lucide-react';

export default function UploadSidebar() {
    return (
        <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
        >
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-white">Quick Tips</h3>
                    <p className="text-xs text-white/50">How VakilVerify works</p>
                </div>
            </div>

            {/* Tips list */}
            <ul className="space-y-3">
                {[
                    { icon: FileSearch, text: "Upload a single PDF contract (max 25 MB)" },
                    { icon: Shield, text: "AI extracts text & analyzes clause risks" },
                    { icon: AlertCircle, text: "High-risk clauses highlighted in red" },
                    { icon: Mail, text: "Generate safe counter-clauses & emails" },
                ].map((tip, i) => (
                    <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
                    >
                        <tip.icon className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/70">{tip.text}</span>
                    </motion.li>
                ))}
            </ul>

            {/* Analysis options */}
            <div className="mt-6 pt-5 border-t border-white/10">
                <h4 className="text-sm font-medium text-white mb-3">Analysis Options</h4>
                <div className="space-y-2">
                    {[
                        { label: "Stamp Duty Auditor", defaultChecked: true },
                        { label: "MSME 45-Day Alert", defaultChecked: true },
                        { label: "Jurisdiction Check", defaultChecked: false },
                    ].map((option, i) => (
                        <label
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 
                                     cursor-pointer hover:bg-white/10 transition-colors group"
                        >
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    defaultChecked={option.defaultChecked}
                                    className="peer sr-only"
                                />
                                <div className="w-5 h-5 rounded-md border-2 border-white/20 
                                              peer-checked:border-violet-500 peer-checked:bg-violet-500
                                              transition-all duration-200 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </motion.aside>
    );
}
