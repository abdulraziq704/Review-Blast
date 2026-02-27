import React from 'react';
import PricingSection from '../components/PricingSection';
import { motion } from 'framer-motion';

const Plans = () => {
    return (
        <div className="bg-white min-h-screen">
            <div className="pt-20 pb-12 bg-indigo-600 text-white text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
                >
                    <h1 className="text-4xl sm:text-6xl font-black mb-4">Choose Your Success Plan</h1>
                    <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
                        Scale your business with automated WhatsApp reviews. Select a plan below to get started.
                    </p>
                </motion.div>
            </div>

            <PricingSection />

            <div className="max-w-4xl mx-auto px-4 pb-24 text-center">
                <div className="p-8 bg-gray-50 rounded-3xl border border-gray-100 italic text-gray-500">
                    "Since using ReviewBlast, our restaurant's Google reviews jumped from 120 to over 500 in just two months. The automated WhatsApp requests are a game changer for Pakistani businesses."
                    <p className="mt-4 font-bold text-gray-900">— Ahmed Khan, Spice Kitchen</p>
                </div>
            </div>
        </div>
    );
};

export default Plans;
