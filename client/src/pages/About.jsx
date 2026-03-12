import { Link } from 'react-router-dom';
import WhyReviewsMatter from '../components/WhyReviewsMatter';

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


                <WhyReviewsMatter />

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
