/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';

const WhatsAppChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [message, setMessage] = useState('');
    const phoneNumber = "923284638553"; // Pakistani international format

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
        setMessage('');
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
            {/* Tooltip popping up on hover */}
            <AnimatePresence>
                {isHovered && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 10, scale: 0.8 }}
                        className="bg-white px-4 py-2 rounded-xl shadow-xl border border-gray-100 text-indigo-600 font-bold text-sm mb-2 mr-2 pointer-events-none whitespace-nowrap"
                    >
                        Need help? Chat with us!
                        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-gray-100 rotate-45"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9, originY: 1, originX: 1 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="w-[350px] max-w-[90vw] bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 overflow-hidden flex flex-col pointer-events-auto mb-2"
                    >
                        {/* Header */}
                        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center relative overflow-hidden">
                            {/* Decorative background circle */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                            
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden border-2 border-white/20 shadow-lg">
                                    <img src="/favicon-96x96.png" alt="Review Blast" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg leading-tight">Review Blast</h4>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <p className="text-xs text-indigo-100">Live Support</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors relative z-10"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Chat Context */}
                        <div className="p-8 bg-gray-50 flex-grow min-h-[120px]">
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 inline-block max-w-[85%]"
                            >
                                <p className="text-gray-700 text-[15px] leading-relaxed">
                                    Assalam-o-Alaikum! 👋 <br/>
                                    How can we help your business grow with <span className="font-bold text-indigo-600">ReviewBlast</span> today?
                                </p>
                            </motion.div>
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-5 bg-white border-t border-gray-100 flex items-center gap-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message here..."
                                className="flex-grow p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-200"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_30px_-5px_rgba(37,211,102,0.4)] transition-colors duration-500 relative pointer-events-auto ${
                    isOpen ? 'bg-white text-indigo-600' : 'bg-[#25D366] text-white'
                }`}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                            animate={{ opacity: 1, rotate: 0, scale: 1 }}
                            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X className="w-8 h-8" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="whatsapp"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full h-full flex items-center justify-center"
                        >
                            {/* Premium Pulsing Ring */}
                            <motion.div
                                animate={{ scale: [1, 1.3, 1.4], opacity: [0.6, 0.3, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                className="absolute inset-0 bg-[#25D366] rounded-full -z-10"
                            />
                            
                            {/* Notification Ping Badge */}
                            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full z-20">
                                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
                            </div>
                            
                            <img
                                src="/Digital_Glyph_White.png"
                                alt="WhatsApp"
                                className="w-8 h-8 object-contain relative z-10 drop-shadow-md"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default WhatsAppChat;
