/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, TrendingUp, Users, MessageSquare, Zap, Target, ShieldCheck, Globe, Award } from 'lucide-react';

const WhyReviewsMatter = () => {
    const featurePoints = [
        { icon: <Zap className="w-5 h-5" />, text: "Instant WhatsApp Delivery (98% Open Rate)" },
        { icon: <Target className="w-5 h-5" />, text: "Hyper-Targeted Review Requests" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "10x Growth in Local Google Ranking" },
        { icon: <Users className="w-5 h-5" />, text: "Build Peer-to-Peer Social Proof Fast" },
        { icon: <ShieldCheck className="w-5 h-5" />, text: "Automated Reputation Protection" },
        { icon: <MessageSquare className="w-5 h-5" />, text: "Direct 1:1 Engagement with Customers" },
        { icon: <Globe className="w-5 h-5" />, text: "Omnichannel Feedback Loop" },
        { icon: <Award className="w-5 h-5" />, text: "Elite Brand Authority in Your Niche" },
        { icon: <CheckCircle2 className="w-5 h-5" />, text: "Zero Friction Response Workflows" }
    ];

    return (
        <section className="relative py-32 bg-white overflow-hidden selection:bg-indigo-500/30">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Brand & Icon */}
                    <div className="relative group">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 backdrop-blur-md">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                </span>
                                <span className="text-sm font-medium text-indigo-600 tracking-wider uppercase">Next-Gen Reviews</span>
                            </div>

                            <h2 className="text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.1]">
                                Why <span className="text-indigo-600">Review Blast</span>
                            </h2>

                            <p className="text-xl text-gray-600 max-w-lg leading-relaxed font-medium">
                                Don't just collect reviews. Orchestrate a digital revolution for your brand authority with hyper-speed automation.
                            </p>

                            {/* Floating 3D Star Icon */}
                            <div className="pt-12 relative flex justify-center lg:justify-start">
                                <motion.div
                                    animate={{
                                        y: [0, -20, 0],
                                        rotateZ: [0, 5, -5, 0],
                                        filter: ["drop-shadow(0 0 20px rgba(79,70,229,0.1))", "drop-shadow(0 0 40px rgba(124,58,237,0.2))", "drop-shadow(0 0 20px rgba(79,70,229,0.1))"]
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="relative flex items-center justify-center"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-600 blur-3xl opacity-10 scale-150" />
                                    <div className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-2xl overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <Star className="w-24 h-24 text-indigo-600 fill-indigo-50 animate-pulse" strokeWidth={1.5} />
                                    </div>

                                    {/* Orbital Elements */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute -inset-8 border border-indigo-100 rounded-full pointer-events-none"
                                    />
                                    <motion.div
                                        style={{ top: '10%', left: '80%' }}
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                        className="absolute w-2 h-2 bg-indigo-400 rounded-full blur-[1px]"
                                    />
                                    <motion.div
                                        style={{ bottom: '20%', right: '70%' }}
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                        className="absolute w-1.5 h-1.5 bg-violet-400 rounded-full blur-[1px]"
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Feature Box */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative"
                    >
                        {/* Glassmorphism Box */}
                        <div className="relative p-8 rounded-[2.5rem] bg-white/40 border border-gray-100 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

                            <div className="grid gap-6">
                                {featurePoints.map((point, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        viewport={{ once: true }}
                                        className="flex items-center gap-4 group cursor-default"
                                    >
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-300 shadow-sm">
                                            <div className="text-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                                {point.icon}
                                            </div>
                                        </div>
                                        <span className="text-gray-700 text-lg group-hover:text-indigo-600 transition-colors duration-300 font-semibold tracking-wide">
                                            {point.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Decorative Corner Glow */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-violet-600/5 rounded-full blur-3xl" />
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
                    </motion.div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes orbit {
                    from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
                    to   { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
                }
            `}} />
        </section>
    );
};

export default WhyReviewsMatter;

