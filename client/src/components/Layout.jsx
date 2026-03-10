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
    const NavItems = [
        { path: '/dashboard-app/stats', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/dashboard-app/contacts', label: 'Contacts', icon: <Users size={20} /> },
        { path: '/dashboard-app/send', label: 'Send Reviews', icon: <Send size={20} /> },
    ];

    const isPathActive = (path) => {
        if (path === '/dashboard-app/stats' && location.pathname === '/dashboard') return true;
        if (path === '/dashboard-app/contacts' && location.pathname === '/contacts') return true;
        if (path === '/dashboard-app/send' && location.pathname === '/send') return true;
        return location.pathname === path;
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar - Desktop Only */}
            <div className="hidden md:flex w-64 bg-indigo-800 text-white flex-col transition-all duration-300">
                <div className="flex items-center justify-start gap-4 p-3 h-16 border-b border-indigo-700 bg-indigo-900/50">
                    <img
                        src="https://ik.imagekit.io/opspndgdf/Review_Blast_logo.png"
                        alt="ReviewBlast"
                        className="w-40 mt-1 object-contain brightness-0 invert"
                    />
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    {NavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                                isPathActive(item.path)
                                    ? 'bg-indigo-700 text-white'
                                    : 'text-indigo-100 hover:bg-indigo-600'
                            }`}
                            title={item.label}
                        >
                            <span className="shrink-0">{item.icon}</span>
                            <span className="font-medium truncate">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-indigo-700 bg-indigo-900/20">
                    <div className="mb-4 text-xs opacity-60 uppercase tracking-widest px-2">
                        Account
                    </div>
                    <div className="flex items-center gap-3 px-2 mb-4">
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
                        className="flex items-center gap-3 w-full bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-xl transition-all duration-200 border border-red-600/20"
                        title="Logout"
                    >
                        <LogOut size={20} />
                        <span className="font-bold">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden relative">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 px-4 md:px-8 h-16 flex justify-between items-center shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <img
                            src="https://ik.imagekit.io/opspndgdf/Review_Blast_logo.png"
                            alt="ReviewBlast"
                            className="md:hidden w-32 object-contain"
                        />
                        <h1 className="hidden md:block text-xl font-bold text-gray-900 truncate">
                            {isPathActive('/dashboard-app/stats') ? 'Dashboard' : ''}
                            {isPathActive('/dashboard-app/contacts') ? 'Contact Management' : ''}
                            {isPathActive('/dashboard-app/send') ? 'Send Review Campaign' : ''}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                           {/* Add any desktop header actions here if needed */}
                        </div>
                        
                        {/* Mobile Logout Button */}
                        <button
                            onClick={logout}
                            className="md:hidden p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            aria-label="Logout"
                        >
                            <LogOut size={20} />
                        </button>

                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-indigo-100">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>

                {/* Mobile Bottom Navigation Bar */}
                <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 flex justify-between items-center z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    {NavItems.map((item) => {
                        const active = isPathActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                                    active
                                        ? 'text-indigo-600 bg-indigo-50'
                                        : 'text-gray-400 hover:text-gray-600'
                                }`}
                            >
                                <span className={`shrink-0 transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
                                    {item.icon}
                                </span>
                                <span className={`text-[10px] font-bold uppercase tracking-tight transition-all duration-300 ${active ? 'opacity-100' : 'opacity-70'}`}>
                                    {item.label.split(' ')[0]}
                                </span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};


export default Layout;
