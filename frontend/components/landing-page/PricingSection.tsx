"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const plans = [
    {
        name: "Starter",
        description: "Perfect for freelancers and individuals",
        price: "Free",
        period: "",
        icon: Sparkles,
        features: [
            "5 contract analyses per month",
            "500 chat messages per month",
            "Basic risk detection",
            "PDF export",
            "Email support",
        ],
        cta: "Get Started",
        popular: false,
        gradient: "from-slate-500 to-slate-600",
    },
    {
        name: "Professional",
        description: "For growing businesses and teams",
        price: "₹2,999",
        period: "/month",
        icon: Zap,
        features: [
            "25 contract analyses per month",
            "Unlimited chat messages",
            "Advanced clause detection",
            "MSME & Stamp Duty checks",
            "AI-generated counter-clauses",
            "Priority support",
        ],
        cta: "Start Free Trial",
        popular: true,
        gradient: "from-violet-500 to-purple-600",
    },
    {
        name: "Enterprise",
        description: "Custom solutions for large organizations",
        price: "Custom",
        period: "",
        icon: Crown,
        features: [
            "Everything in Professional",
            "Custom AI training",
            "API access",
            "Dedicated account manager",
            "SLA guarantee",
            "On-premise deployment",
        ],
        cta: "Contact Sales",
        popular: false,
        gradient: "from-amber-500 to-orange-600",
    },
];

export default function PricingSection() {
    return (
        <section className="relative py-24 px-6 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-violet-600/10 rounded-full blur-[150px]" />
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
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
                        Pricing
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Simple, transparent pricing
                    </h2>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Start free and scale as you grow. No hidden fees.
                    </p>
                </motion.div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className={`
                                relative p-8 rounded-3xl backdrop-blur-sm
                                ${plan.popular
                                    ? 'bg-gradient-to-b from-violet-500/20 to-purple-600/10 border-2 border-violet-500/50'
                                    : 'bg-white/5 border border-white/10'
                                }
                            `}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan header */}
                            <div className="mb-6">
                                <div className={`
                                    w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient}
                                    flex items-center justify-center mb-4
                                `}>
                                    <plan.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                                <p className="text-sm text-white/50 mt-1">{plan.description}</p>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-white/50">{plan.period}</span>
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm">
                                        <div className={`
                                            w-5 h-5 rounded-full flex items-center justify-center
                                            ${plan.popular ? 'bg-violet-500/20' : 'bg-white/10'}
                                        `}>
                                            <Check className={`w-3 h-3 ${plan.popular ? 'text-violet-400' : 'text-white/60'}`} />
                                        </div>
                                        <span className="text-white/70">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <button
                                className={`
                                    w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200
                                    ${plan.popular
                                        ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25'
                                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                    }
                                `}
                            >
                                {plan.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
