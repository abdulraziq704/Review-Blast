import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">Our Mission</h2>
                    <p className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                        Building Trust in the Digital Age
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto leading-relaxed">
                        At ReviewBlast, we believe your reputation is your most valuable asset. We help you showcase the quality of your work through the voice of your customers.
                    </p>
                </div>

                <div className="mt-20">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why ReviewBlast?</h3>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                In today's market, 93% of consumers say online reviews impact their purchasing decisions. Yet, getting customers to leave reviews can be a manual, time-consuming struggle.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                We've built a bridge between your business and your satisfied customers. By leveraging the power of WhatsApp, we ensure your review requests get seen and acted upon, helping you build a wall of social proof that converts visitors into loyal clients.
                            </p>
                        </div>
                        <div className="bg-indigo-600 rounded-3xl p-12 text-white">
                            <h4 className="text-xl font-bold mb-4">Our Values</h4>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <span className="bg-white/20 p-1 rounded-md mr-3 text-sm">✓</span>
                                    <span>Transparency in all customer interactions</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-white/20 p-1 rounded-md mr-3 text-sm">✓</span>
                                    <span>Data privacy and security as a priority</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="bg-white/20 p-1 rounded-md mr-3 text-sm">✓</span>
                                    <span>Simplicity and ease of use for busy owners</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-32 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Ready to grow your reputation?</h3>
                    <Link to="/register" className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-bold rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105">
                        Join ReviewBlast Today
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;
