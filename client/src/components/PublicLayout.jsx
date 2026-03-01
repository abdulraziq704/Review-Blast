import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';


const PublicLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <Link to="/" className="flex gap-x-2 items-center select-none">
                                {/* Logo Symbol */}
                                <img
                                    className="w-16"
                                    src="https://ik.imagekit.io/opspndgdf/reviww_blast_nav-removebg-preview.png"
                                    alt="Review Blast Logo"
                                />

                                {/* <h2 className='text-2xl font-bold  '>Review Blast</h2> */}

                                {/* Logo Text */}
                                <span className="text-3xl font-bold tracking-tighter text-slate-900">

                                    <span className="hidden md:inline">
                                        Review<span className="text-blue-600 font-semibold">Blast</span>
                                    </span>

                                </span>                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-sm font-medium hover:text-indigo-600 transition-colors">Home</Link>
                            <Link to="/pricing" className="text-sm font-medium hover:text-indigo-600 transition-colors">Pricing</Link>
                            <Link to="/about" className="text-sm font-medium hover:text-indigo-600 transition-colors">About</Link>
                            <Link to="/contact" className="text-sm font-medium hover:text-indigo-600 transition-colors">Contact</Link>
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>

                            <Link to="/register" className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 active:scale-95">
                                Get Started
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={toggleMenu}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-b border-gray-100 shadow-xl transition-all duration-300 ease-in-out overflow-hidden`}>
                    <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
                        <Link to="/" onClick={toggleMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors">Home</Link>
                        <Link to="/pricing" onClick={toggleMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors">Pricing</Link>
                        <Link to="/about" onClick={toggleMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors">About</Link>
                        <Link to="/contact" onClick={toggleMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors">Contact</Link>
                        <Link to="/login" onClick={toggleMenu} className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-colors">Sign In</Link>

                        <div className="pt-4 px-3">
                            <Link to="/register" onClick={toggleMenu} className="flex w-full items-center justify-center px-4 py-3 border border-transparent text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all active:scale-95">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="col-span-2">
                            <Link to="/" className="flex items-center   pb-4">
                                {/* Logo Symbol */}
                                <img
                                    className="w-40"
                                    src="https://ik.imagekit.io/opspndgdf/Untitled_design__1_-removebg-preview.png"
                                    alt="Review Blast Logo Footer"
                                />


                            </Link>
                            <p className="text-gray-500 max-w-xs text-sm leading-relaxed">
                                Automate your Google Review requests and build an unstoppable online reputation with ReviewBlast.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h4>
                            <ul className="space-y-2">
                                <li><Link to="/" className="text-sm text-gray-500 hover:text-indigo-600">Features</Link></li>
                                <li><Link to="/pricing" className="text-sm text-gray-500 hover:text-indigo-600">Pricing</Link></li>

                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><Link to="/contact" className="text-sm text-gray-500 hover:text-indigo-600">Contact Us</Link></li>
                                <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-indigo-600">Privacy Policy</Link></li>
                                <li><Link to="/terms" className="text-sm text-gray-500 hover:text-indigo-600">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                        <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} ReviewBlast. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
