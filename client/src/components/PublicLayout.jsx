import { Link, Outlet } from 'react-router-dom';

const PublicLayout = () => {
    return (
        <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
<Link to="/" className="flex items-center select-none">
  {/* Logo Symbol */}
  <img
    className="w-16"
    src="https://ik.imagekit.io/opspndgdf/reviww_blast_nav-removebg-preview.png"
    alt="Review Blast Logo"
  />

  {/* <h2 className='text-2xl font-bold  '>Review Blast</h2> */}
  
  {/* Logo Text */}
   <img
    className="w-52 mt-2"
    src="https://ik.imagekit.io/opspndgdf/Review_Blast_logo.png"
    alt="Review Blast Logo"
  />
</Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-sm font-medium hover:text-indigo-600 transition-colors">Home</Link>
                            <Link to="/about" className="text-sm font-medium hover:text-indigo-600 transition-colors">About</Link>
                            <Link to="/contact" className="text-sm font-medium hover:text-indigo-600 transition-colors">Contact</Link>
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
                            <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105">
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
                                <li><Link to="/login" className="text-sm text-gray-500 hover:text-indigo-600">Pricing</Link></li>
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
