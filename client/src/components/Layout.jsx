import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Send,
    LogOut,
    MessageSquare
} from 'lucide-react';

const Layout = () => {
    const { user, loading, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }
    const isActive = (path) => location.pathname === path
        ? 'bg-indigo-700 text-white'
        : 'text-indigo-100 hover:bg-indigo-600';

    const NavItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/contacts', label: 'Contacts', icon: <Users size={20} /> },
        { path: '/send', label: 'Send Reviews', icon: <Send size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-16 md:w-64 bg-indigo-800 text-white flex flex-col transition-all duration-300">
                <div className="flex items-center justify-center md:justify-start gap-4 p-4 h-16 border-b border-indigo-700 bg-indigo-900/50">
                    
                    <img
                        src="https://ik.imagekit.io/opspndgdf/Review_Blast_logo.png"
                        alt="ReviewBlast"
                        className="hidden md:block w-40 mt-1 object-contain brightness-0 invert"
                    />
                </div>

                <nav className="flex-1 p-2 md:p-4 space-y-2 mt-4">
                    {NavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-center md:justify-start gap-3 p-3 md:px-4 md:py-2 rounded-xl transition-all duration-200 ${isActive(item.path)}`}
                            title={item.label}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span className="hidden md:block font-medium truncate">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-2 md:p-4 border-t border-indigo-700 bg-indigo-900/20">
                    <div className="hidden md:block mb-4 text-xs opacity-60 uppercase tracking-widest px-2">
                        Account
                    </div>
                    <div className="hidden md:flex items-center gap-3 px-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-bold truncate">{user.name}</div>
                            <div className="text-[10px] opacity-50 truncate uppercase">{user.plan} Plan</div>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center justify-center md:justify-start gap-3 w-full bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white p-3 md:px-4 md:py-2 rounded-xl transition-all duration-200 border border-red-600/20"
                        title="Logout"
                    >
                        <LogOut size={20} />
                        <span className="hidden md:block font-bold">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto flex flex-col h-full bg-gray-50">
                <header className="bg-white border-b border-gray-200 px-4 md:px-8 h-16 flex justify-between items-center shrink-0">
                    <h1 className="text-lg md:text-xl font-bold text-gray-900">
                        {location.pathname === '/dashboard' && 'Dashboard'}
                        {location.pathname === '/contacts' && 'Contact Management'}
                        {location.pathname === '/send' && 'Send Review Campaign'}
                    </h1>
                    <div className="flex md:hidden">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-100">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>
                <main className="p-4 md:p-8 flex-1">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
