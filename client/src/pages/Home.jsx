import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Upload,
    Send,
    BarChart3,
    MessageSquare,
    ShieldCheck,
    Zap,
    Users,
    Star
} from 'lucide-react';
import PricingSection from '../components/PricingSection';
import ReviewSlider from '../components/ReviewSlider';

const Home = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="overflow-hidden bg-white">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-32 lg:pt-48 lg:pb-48 bg-gradient-to-b from-indigo-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl sm:text-7xl lg:text-7xl font-black tracking-tight text-gray-900 mb-8 leading-tight">
                            Get 10x More <span className="text-indigo-600">Google Reviews</span> <br className="hidden lg:block" /> using WhatsApp
                        </h1>
                        <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 mb-12 leading-relaxed">
                            Designed specifically for <span className="font-bold text-gray-900 underline decoration-indigo-500">Pakistani business owners</span>. Automate your reputation, build trust, and dominate local search results.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <Link to="/plans" className="px-10 py-5 rounded-full bg-indigo-600 text-white font-black text-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-2xl shadow-indigo-200">
                                Start My Free Trial
                            </Link>
                            <a href="#process" className="px-10 py-5 rounded-full border-2 border-gray-200 text-gray-700 font-bold text-xl hover:border-indigo-600 hover:text-indigo-600 transition-all">
                                See How It Works
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Decorative Elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-10 hidden xl:block opacity-20"
                >
                    <MessageSquare size={120} className="text-indigo-500" />
                 </motion.div>
                <motion.div
                    animate={{ y: [0, 20, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-10 hidden xl:block opacity-20"
                >
                    {/* <Star size={100} className="text-yellow-500 fill-current" /> */}
                    <img src="https://ik.imagekit.io/opspndgdf/reviww_blast_nav-removebg-preview.png" alt="" />

                </motion.div>
            </section>

            {/* 3-Step Success Process */}
            <section id="process" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">The "3-Step Success" Process</h2>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto">From messy customer lists to a wall of 5-star reviews.</p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-12 lg:gap-20"
                    >
                        {/* Step 1 */}
                        <motion.div variants={itemVariants} className="flex flex-col items-center">
                            <div className="relative mb-10 group">
                                <div className="absolute -inset-4 bg-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative w-full aspect-[9/16] max-w-[280px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center text-white">
                                    <Upload size={64} className="text-indigo-400 mb-6" />
                                    <h4 className="text-2xl font-bold mb-4">Upload Your List</h4>
                                    <p className="text-gray-400 text-sm">Drag and drop your customer CSV file. We handle the formatting automatically.</p>
                                </div>
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-lg">1</div>
                            </div>
                        </motion.div>

                        {/* Step 2 */}
                        <motion.div variants={itemVariants} className="flex flex-col items-center">
                            <div className="relative mb-10 group">
                                <div className="absolute -inset-4 bg-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative w-full aspect-[9/16] max-w-[280px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center text-white">
                                    <Zap size={64} className="text-purple-400 mb-6" />
                                    <h4 className="text-2xl font-bold mb-4">Automate the Send</h4>
                                    <p className="text-gray-400 text-sm">Official Twilio API ensures your messages land safely. Your customers see a professional WhatsApp request.</p>
                                </div>
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-lg">2</div>
                            </div>
                        </motion.div>

                        {/* Step 3 */}
                        <motion.div variants={itemVariants} className="flex flex-col items-center">
                            <div className="relative mb-10 group">
                                <div className="absolute -inset-4 bg-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                <div className="relative w-full aspect-[9/16] max-w-[280px] bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6 text-center text-white text-indigo-100">
                                    <Star size={64} className="text-pink-400 mb-6" />
                                    <h4 className="text-2xl font-bold mb-4">See the Results</h4>
                                    <p className="text-gray-400 text-sm">Your customer receives a one-tap link to your Google Business profile. Reviews start rolling in instantly.</p>
                                </div>
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center font-black text-2xl text-white shadow-lg">3</div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">Core Features</h2>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: <MessageSquare />, title: "WhatsApp API", desc: "Reliable, high-open rate messaging." },
                            { icon: <ShieldCheck />, title: "Twilio Safety", desc: "Official verification for your business." },
                            { icon: <Upload />, title: "CSV Support", desc: "Bulk import 1000s of contacts in seconds." },
                            { icon: <BarChart3 />, title: "Real-time Analytics", desc: "Track every review request sent." }
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                            >
                                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                                    {f.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                                <p className="text-gray-600">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section Component */}
            <PricingSection />

            {/* Review Slider Component */}
            <ReviewSlider />

            {/* CTA Section */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="bg-indigo-600 rounded-[3rem] p-12 sm:p-20 text-center text-white shadow-2xl shadow-indigo-200 relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h2 className="text-4xl sm:text-6xl font-black mb-8 leading-tight">Ready to Become the Best Rated Business in Town?</h2>
                            <p className="text-indigo-100 text-xl mb-12 max-w-2xl mx-auto">Join hundreds of Pakistani entrepreneurs who are using ReviewBlast to automate their growth. No credit card required to start.</p>
                            <Link to="/plans" className="inline-block px-12 py-6 rounded-full bg-white text-indigo-600 font-black text-2xl hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-xl">
                                Get Started Now
                            </Link>
                        </div>
                        {/* Background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
