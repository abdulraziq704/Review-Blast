import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Copy, Check } from 'lucide-react';

const InstructionModal = ({ isOpen, onClose, selectedPlan, billingCycle, onProceed }) => {
    const [copiedField, setCopiedField] = useState(null);

    // Lock body scroll when modal is open
    React.useEffect(() => {
        if (isOpen) {
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollBarWidth}px`;
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        };
    }, [isOpen]);

    if (!selectedPlan) return null;

    const price = billingCycle === 'monthly' ? selectedPlan.monthlyPrice : selectedPlan.yearlyPrice;

    const handleCopy = (text, fieldId) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // QR Image Mapping
    const getQRImage = () => {
        if (billingCycle === 'yearly') {
            return 'https://ik.imagekit.io/opspndgdf/static%20qr.jpg';
        }

        switch (selectedPlan.id) {
            case 'startup':
                return 'https://ik.imagekit.io/opspndgdf/starupplan.jpg';
            case 'growth':
                return 'https://ik.imagekit.io/opspndgdf/growth.jpg';
            case 'business':
                return 'https://ik.imagekit.io/opspndgdf/business.jpg';
            default:
                return 'https://ik.imagekit.io/opspndgdf/static%20qr.jpg';
        }
    };

    const CopyButton = ({ text, fieldId }) => (
        <button
            onClick={() => handleCopy(text, fieldId)}
            className="p-1.5 hover:bg-gray-200 rounded-md transition-colors ml-2 group relative"
            title="Copy to clipboard"
        >
            {copiedField === fieldId ? (
                <Check size={14} className="text-green-600" />
            ) : (
                <Copy size={14} className="text-gray-400 group-hover:text-indigo-600" />
            )}
            {copiedField === fieldId && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg">
                    Copied!
                </span>
            )}
        </button>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm overflow-x-hidden"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl relative custom-scrollbar"
                    >
                        <style>{`
                            .custom-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                            .custom-scrollbar {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }
                        `}</style>
                        <div className="p-6 sm:p-10 overflow-x-hidden rounded-[2rem] sm:rounded-[2.5rem]">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-900 transition z-10 bg-gray-100 p-2 rounded-full"
                            >
                                <X size={24} />
                            </button>

                            <div className="text-center mb-6 sm:mb-8 mt-4">
                                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 font-outfit">Payment Instructions</h3>
                                <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs sm:text-sm">
                                    {selectedPlan.name} Plan • PKR {price.toLocaleString()} / {billingCycle === 'monthly' ? 'Month' : 'Year'}
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* Left Side: JazzCash */}
                                <div className="bg-red-50 p-5 sm:p-6 rounded-3xl border-2 border-red-100 flex flex-col">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-red-100">JC</div>
                                        <h4 className="text-2xl font-bold text-red-900 font-outfit">JazzCash</h4>
                                    </div>
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-tight mb-1">Account Name</p>
                                            <p className="text-lg font-black text-red-900">Hafiz Muhammad Abdul Raziq</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-tight mb-1">Phone Number</p>
                                            <div className="flex items-center bg-white p-3 rounded-2xl border border-red-100 shadow-sm">
                                                <p className="text-xl font-black text-red-900">0321-4417295</p>
                                                <div className="ml-auto">
                                                    <CopyButton text="03214417295" fieldId="jc_num" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="mt-auto pt-6 border-t border-red-200/50">
                                        <p className="text-[14px] font-bold text-red-700 uppercase tracking-tight mb-4 text-center">Scan to Pay: Hafiz Shop</p>
                                        <div className="bg-white p-3 rounded-[2rem] shadow-sm border border-red-100 flex items-center justify-center">
                                            <img
                                                src={getQRImage()}
                                                alt="JazzCash QR"
                                                className="w-full h-auto max-w-[200px] rounded-2xl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Banks */}
                                <div className="space-y-4">
                                    {/* UBL Card */}
                                    <div className="bg-blue-50 p-5 sm:p-6 rounded-3xl border-2 border-blue-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">UB</div>
                                            <h4 className="text-xl font-bold text-blue-900 font-outfit">UBL Bank</h4>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tight">Account Name</p>
                                                <p className="text-base font-black text-blue-900">Hafiz Muhammad Abdul Raziq</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-tight mb-1">Account / IBAN</p>
                                                <div className="flex items-center bg-white p-3 rounded-xl border border-blue-100 shadow-sm">
                                                    <p className="text-sm font-black text-blue-900 break-all">PK78 UNIL 0109 0003 2379 1399</p>
                                                    <div className="ml-auto">
                                                        <CopyButton text="PK78 UNIL 0109 0003 2379 1399" fieldId="ubl_iban" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* NayaPay Card */}
                                    <div className="bg-orange-50 p-5 sm:p-6 rounded-3xl border-2 border-orange-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-100">NP</div>
                                            <h4 className="text-xl font-bold text-orange-900 font-outfit">NayaPay</h4>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-tight">Account Name</p>
                                                <p className="text-base font-black text-orange-900">Hafiz Muhammad Abdul Raziq</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-tight mb-1">Account / IBAN</p>
                                                <div className="flex items-center bg-white p-3 rounded-xl border border-orange-100 shadow-sm">
                                                    <p className="text-sm font-black text-orange-900">03214417295</p>
                                                    <div className="ml-auto">
                                                        <CopyButton text="03214417295" fieldId="np_num" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-5 sm:p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
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
                                className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-[1.25rem] sm:rounded-[1.5rem] font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-95"
                            >
                                Get Started Now
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default InstructionModal;
