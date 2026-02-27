import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, CreditCard, MessageSquare } from 'lucide-react';

const InstructionModal = ({ isOpen, onClose, selectedPlan, billingCycle, onProceed }) => {
    if (!selectedPlan) return null;

    const price = billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 sm:p-10 relative">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition"
                            >
                                <X size={28} />
                            </button>

                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-black text-gray-900 mb-2">Payment Instructions</h3>
                                <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">
                                    {selectedPlan.name} Plan • PKR {price.toLocaleString()} / {billingCycle === 'monthly' ? 'Month' : 'Year'}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-red-50 p-6 rounded-3xl border-2 border-red-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-red-100">JC</div>
                                        <h4 className="text-xl font-bold text-red-900 font-outfit">JazzCash</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Account Name</p>
                                            <p className="text-base font-black text-red-900">Shahzaib Mughal</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">Phone Number</p>
                                            <p className="text-xl font-black text-red-900">0300-4752646</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-6 rounded-3xl border-2 border-indigo-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100">BK</div>
                                        <h4 className="text-xl font-bold text-indigo-900 font-outfit">Bank Transfer</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Bank Name (UBL)</p>
                                            <p className="text-base font-black text-indigo-900">United Bank Ltd</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Account / IBAN</p>
                                            <p className="text-base font-black text-indigo-900">1234-5678-9012</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Smartphone className="w-4 h-4 text-indigo-600" />
                                    Next Steps:
                                </h5>
                                <ol className="text-xs text-gray-600 space-y-2 list-decimal list-inside font-medium border-l-2 border-indigo-100 pl-4 ml-1">
                                    <li>Transfer amount to any method above.</li>
                                    <li>Take a screenshot of the receipt.</li>
                                    <li>WhatsApp screenshot to <span className="font-bold text-indigo-600">03284638553</span></li>
                                    <li>Your account activates in 30 mins!</li>
                                </ol>
                            </div>

                            <button
                                onClick={onProceed}
                                className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-95"
                            >
                                I've Ready, Proceed to Register
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstructionModal;
