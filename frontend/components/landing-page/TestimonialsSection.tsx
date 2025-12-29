"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, Building2, Users, BadgeCheck } from 'lucide-react';

const testimonials = [
    {
        quote: "VakilVerify caught a problematic indemnity clause that could have cost us lakhs. Essential tool for any business.",
        author: "Priya Sharma",
        role: "Founder, TechStart Solutions",
        avatar: "PS",
        rating: 5,
    },
    {
        quote: "We used to spend hours reviewing vendor contracts. Now it takes minutes. The MSME compliance check is brilliant.",
        author: "Rajesh Kumar",
        role: "CFO, Manufacturing Co.",
        avatar: "RK",
        rating: 5,
    },
    {
        quote: "As a freelancer, I couldn't afford expensive legal reviews. VakilVerify levels the playing field completely.",
        author: "Amit Patel",
        role: "Independent Consultant",
        avatar: "AP",
        rating: 5,
    },
];

const stats = [
    { value: "10,000+", label: "Contracts Analyzed", icon: Building2 },
    { value: "₹2Cr+", label: "Risks Identified", icon: BadgeCheck },
    { value: "500+", label: "Happy Users", icon: Users },
];

export default function TestimonialsSection() {
    return (
        <section className="relative py-24 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-600/5 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm mb-6">
                        <Star className="w-4 h-4" />
                        Trusted by Businesses
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        What our users say
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Join thousands of Indian businesses protecting themselves with AI-powered contract analysis
                    </p>
                </motion.div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
                >
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                        >
                            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                <stat.icon className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-white/50">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Testimonials grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                        >
                            {/* Quote icon */}
                            <Quote className="w-8 h-8 text-violet-500/30 mb-4" />

                            {/* Rating */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-white/80 text-sm leading-relaxed mb-6">
                                "{testimonial.quote}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">{testimonial.avatar}</span>
                                </div>
                                <div>
                                    <div className="text-white font-medium text-sm">{testimonial.author}</div>
                                    <div className="text-white/50 text-xs">{testimonial.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
