import React from 'react';
import { motion } from 'framer-motion';

const VideoSection = ({ title = "How to Use ReviewBlast", videoId = "76PHPUITlK4" }) => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="mb-12 text-center">
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-3 rounded-full font-bold text-sm">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                        </span>
                        Step-by-step video guide
                    </div>
                </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-5xl font-black text-gray-900 mb-4 font-outfit"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 text-lg max-w-2xl mx-auto"
                    >
                        Watch this short tutorial to see how easy it is to automate your Google Reviews and grow your business reputation.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative max-w-4xl mx-auto aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-gray-50 bg-gray-100"
                >
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </motion.div>

                
            </div>
        </section>
    );
};

export default VideoSection;
