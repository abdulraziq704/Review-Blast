/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const ReviewSlider = () => {
    const reviews = [
        {
            name: "Ahmed Khan",
            role: "Restaurant Owner",
            text: "ReviewBlast transformed our business. We went from 3.8 to 4.7 stars on Google in just two months. The WhatsApp integration is brilliant!",
            rating: 5
        },
        {
            name: "Sana Malik",
            role: "Boutique Manager",
            text: "Incredible tool. Pakistani customers respond so much better to WhatsApp than email. Highly recommended for local businesses.",
            rating: 5
        },
        {
            name: "Zaid Sheikh",
            role: "E-commerce Founder",
            text: "The CSV upload is so simple. I upload my daily customer list, and ReviewBlast handles the rest. My SEO is climbing every week.",
            rating: 5
        },
        {
            name: "Fatima Ali",
            role: "Clinic Director",
            text: "Simple, effective, and professional. The 3-month Growth plan is perfect for us. Great support from the team as well.",
            rating: 4
        }
    ];

    return (
        <section className="py-24 bg-indigo-900 text-white overflow-hidden relative">
            {/* Decorative dots */}
            <div className="absolute top-10 right-10 opacity-20">
                <div className="grid grid-cols-6 gap-2">
                    {[...Array(36)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl sm:text-5xl font-extrabold mb-4"
                    >
                        Trusted by Businesses <span className="text-indigo-300">Across Pakistan</span>
                    </motion.h2>
                    <p className="text-indigo-200 text-lg">Join 500+ businesses already growing with ReviewBlast.</p>
                </div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="pb-12"
                >
                    {reviews.map((review, idx) => (
                        <SwiperSlide key={idx}>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-indigo-800/50 backdrop-blur-sm p-8 rounded-3xl border border-indigo-700 h-full flex flex-col"
                            >
                                <div className="flex mb-4">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <Quote className="w-10 h-10 text-indigo-500 mb-4 opacity-50" />
                                <p className="text-gray-100 flex-grow text-lg italic leading-relaxed mb-6">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center mt-auto">
                                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-xl mr-4 uppercase">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white leading-none mb-1">{review.name}</h4>
                                        <p className="text-indigo-300 text-sm uppercase tracking-wider">{review.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default ReviewSlider;
