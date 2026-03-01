/* eslint-disable no-unused-vars */
import React from 'react';
import PricingSection from '../components/PricingSection';
import { motion } from 'framer-motion';
import ReviewSlider from '../components/ReviewSlider';

const Pricing = () => {
    return (
        <div className="bg-white min-h-screen">


            <PricingSection />

            <ReviewSlider />
        </div>
    );
};

export default Pricing;

