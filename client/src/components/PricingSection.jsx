/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Rocket } from 'lucide-react';
import InstructionModal from './InstructionModal';

const PricingSection = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
    const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const plans = [
        {
            id: 'startup',
            name: 'Startup',
            monthlyPrice: 1500,
            yearlyPrice: 15000, // Roughly 2 months free
            contacts: 300,
            features: ['300 Contacts monthly', 'WhatsApp AI Blast', 'CSV Support', 'Basic Analytics'],
            icon: <Rocket className="w-6 h-6" />,
            accent: 'indigo'
        },
        {
            id: 'growth',
            name: 'Growth',
            monthlyPrice: 2500,
            yearlyPrice: 25000,
            contacts: 500,
            features: ['500 Contacts monthly', 'Priority Sending', 'Direct WhatsApp Support', 'Weekly Reports'],
            popular: true,
            icon: <Zap className="w-6 h-6" />,
            accent: 'purple'
        },
        {
            id: 'business',
            name: 'Business',
            monthlyPrice: 4500,
            yearlyPrice: 45000,
            contacts: 1000,
            features: ['1000 Contacts monthly', 'API Access (Coming Soon)', 'Dedicated Manager', 'Custom Templates'],
            icon: <Crown className="w-6 h-6" />,
            accent: 'pink'
        }
    ];

    const handleSelectPlan = (plan) => {
        setSelectedPlanForModal(plan);
        setIsModalOpen(true);
    };

    const handleProceedToRegister = () => {
        navigate(`/register?plan=${selectedPlanForModal.id}&cycle=${billingCycle}`);
    };

    return (
        <section id="pricing" className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl sm:text-6xl font-black text-gray-900 mb-6"
                    >
                        Choose Your <span className="text-indigo-600">Growth Plan</span>
                    </motion.h2>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center space-x-4">
                        <span className={`text-lg font-bold ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-400'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="w-16 h-8 bg-gray-200 rounded-full relative p-1 transition-colors hover:bg-indigo-300"
                        >
                            <motion.div
                                animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                                className="w-6 h-6 bg-indigo-600 rounded-full shadow-md"
                            />
                        </button>
                        <span className={`text-lg font-bold ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-400'}`}>
                            Yearly <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full ml-1">SAVE 20%</span>
                        </span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`bg-white p-8 rounded-[2.5rem] shadow-xl border-2 transition-all hover:scale-105 ${plan.popular ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-transparent'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-4 rounded-2xl bg-${plan.accent}-100 text-${plan.accent}-600`}>
                                    {plan.icon}
                                </div>
                                {plan.popular && (
                                    <span className="bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                        Best Value
                                    </span>
                                )}
                            </div>

                            <h3 className="text-2xl font-black text-gray-900 mb-2">{plan.name}</h3>
                            <div className="mb-8">
                                <span className="text-5xl font-black text-gray-900">
                                    PKR {billingCycle === 'monthly' ? plan.monthlyPrice.toLocaleString() : plan.yearlyPrice.toLocaleString()}
                                </span>
                                <span className="text-gray-500 ml-2">/ {billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center text-gray-600 font-medium">
                                        <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-4">
                                <button
                                    onClick={() => handleSelectPlan(plan)}
                                    className={`w-full py-4 rounded-2xl font-black text-lg transition shadow-lg active:scale-95 ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                        }`}
                                >
                                    Select This Plan
                                </button>
                                <button
                                    onClick={() => handleSelectPlan(plan)}
                                    className="w-full text-center text-sm font-bold text-gray-400 hover:text-indigo-600 transition"
                                >
                                    Payment Instructions
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* NEW Instruction Modal */}
            <InstructionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedPlan={selectedPlanForModal}
                billingCycle={billingCycle}
                onProceed={handleProceedToRegister}
            />
        </section>
    );
};

export default PricingSection;

