import React from 'react';
import VideoSection from '../components/VideoSection';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Users, TrendingUp } from 'lucide-react';

const Guide = () => {
    const steps = [
        {
            icon: <Users className="w-6 h-6" />,
            title: "Import Contacts",
            desc: "Upload your customer list via CSV or add them manually in the contacts section."
        },
        {
            icon: <MessageSquare className="w-6 h-6" />,
            title: "Craft Your Message",
            desc: "Use our professional templates to ask for reviews via WhatsApp effectively."
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Run Campaign",
            desc: "Start your campaign and watch your Google ratings soar automatically."
        }
    ];

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <header className="py-20 bg-indigo-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-6xl font-black mb-6 font-outfit"
                    >
                        How to Use <span className="text-indigo-300">ReviewBlast</span>
                    </motion.h1>
                    <p className="text-indigo-100 text-xl max-w-3xl mx-auto leading-relaxed">
                        Master the platform and start gathering 5-star Google reviews from your customers in minutes.
                    </p>
                </div>
            </header>

            {/* Video Section */}
            <VideoSection
                title="Full Platform Walkthrough"
                videoId="76PHPUITlK4"
            />

            {/* Step-by-Step Guide */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 font-outfit">Step-by-Step Excellence</h2>
                        <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative group"
                            >
                                <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 font-outfit">{step.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">
                                    {step.desc}
                                </p>
                                <div className="absolute top-8 right-8 text-6xl font-black text-gray-50 opacity-5 group-hover:opacity-10 transition-opacity">
                                    0{idx + 1}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="bg-indigo-600 rounded-[3rem] p-10 sm:p-16 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-black mb-6 font-outfit">Still have questions?</h2>
                            <p className="text-indigo-100 text-lg mb-8">
                                Our support team is here to help you set up your account and start your first campaign.
                            </p>
                            <a
                                href="https://wa.me/923284638553"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-indigo-50 transition shadow-lg active:scale-95"
                            >
                                Chat on WhatsApp
                            </a>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-x-1/2 translate-y-1/2"></div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Guide;
