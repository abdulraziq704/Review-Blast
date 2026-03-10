/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Upload, TrendingUp } from 'lucide-react';

const WhyReviewBlast = () => {
    const features = [
        {
            icon: <ShieldCheck className="w-8 h-8" />,
            title: "Official WhatsApp API",
            description: "We use official Twilio WhatsApp APIs ensuring your messages land safely in the 'Main' inbox, not 'Spam'.",
            color: "indigo"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "98% Open Rates",
            description: "Unlike emails that get ignored, WhatsApp messages are read within minutes. Get seen instantly.",
            color: "purple"
        },
        {
            icon: <Upload className="w-8 h-8" />,
            title: "Bulk CSV Support",
            description: "Import 100 or 10,000 customers in seconds. Our system handles the heavy lifting automatically.",
            color: "pink"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Local SEO Dominance",
            description: "More stars mean higher ranking. Become the #1 search result for your business in your city.",
            color: "blue"
        }
    ];

    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-4 block"
                    >
                        The Review Blast Advantage
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-6xl font-black text-gray-900 mb-6"
                    >
                        Why Choose <span className="text-indigo-600">Review Blast?</span>
                    </motion.h2>
                    <p className="text-gray-600 text-xl max-w-3xl mx-auto font-medium">
                        Stop begging for reviews. Automate your reputation with the only tool designed for the Pakistani marketplace.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all group"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-100 text-${feature.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyReviewBlast;
