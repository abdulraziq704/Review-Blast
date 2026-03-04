import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import InstructionModal from '../components/InstructionModal';

const Dashboard = () => {
    const { user, setUser } = useContext(AuthContext);
    const [stats, setStats] = useState({ totalContacts: 0, sentMessages: 0 });
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        businessName: user?.businessName || '',
        reviewLink: user?.reviewLink || ''
    });
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const plansMapping = {
        startup: { name: 'Startup', monthlyPrice: 1500, yearlyPrice: 15000 },
        growth: { name: 'Growth', monthlyPrice: 2500, yearlyPrice: 25000 },
        business: { name: 'Business', monthlyPrice: 4500, yearlyPrice: 45000 }
    };
    const currentPlan = plansMapping[user.plan?.toLowerCase()] || plansMapping.startup;

    useEffect(() => {
        const initialization = async () => {
            try {
                // 1. Fetch Stats
                const { data: contactData } = await api.get('/contacts');
                setStats({
                    totalContacts: contactData.length,
                    sentMessages: contactData.filter(c => ['sent', 'delivered', 'read'].includes(c.status)).length
                });


                // 2. Fetch Fresh User Data from DB (The source of truth)
                const { data: userData } = await api.get('/auth/me');
                if (userData) {
                    setProfileData({
                        name: userData.name || '',
                        businessName: userData.businessName || '',
                        reviewLink: userData.reviewLink || ''
                    });
                    // Sync the context so other pages have fresh data
                    if (setUser) {
                        setUser(prev => ({ ...prev, ...userData }));
                    }
                }
            } catch (err) {
                console.error('Initialization error:', err);
            }
        };
        initialization();
    }, [setUser]);

    const handleUpdateProfile = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const { data } = await api.put('/auth/profile', profileData);

            // Success: update context
            if (setUser) {
                setUser(prev => ({ ...prev, ...data }));
            }

            toast.success('Profile updated successfully!');
        } catch {
            toast.error('Failed to update profile.');
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    return (
        <div className="space-y-6 pb-12">
            {/* Payment Status Banner */}
            {user.paymentStatus === 'pending' && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm animate-pulse">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3 flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="text-sm font-bold text-red-800">Account Pending Status</h3>
                                <p className="text-sm text-red-700">
                                    Your account pending status is not approved yet. We take up to 2 hours after your payment to activate your status. If any issues exist, contact support: <a href="https://wa.me/923284638553" target="_blank" rel="noopener noreferrer" className="font-black underline decoration-red-300 underline-offset-2 hover:text-red-900 transition-colors">03284638553</a>
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-700 transition shadow-lg shadow-red-200 shrink-0"
                            >
                                How to Pay & Activate
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Welcome Card */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-3xl font-extrabold text-gray-900">Welcome, {user.name}!</h2>
                    <p className="text-gray-500 mt-2 text-lg">
                        Managing reviews for <span className="font-bold text-indigo-600 underline decoration-indigo-200 underline-offset-4">{user.businessName}</span>
                    </p>

                    <div className="mt-8 pt-6 border-t border-gray-50">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Current Plan: {user.plan}</h3>
                        <div className="bg-gray-100 h-4 w-full rounded-full overflow-hidden shadow-inner">
                            <div
                                className={`h-full transition-all duration-1000 ease-out rounded-full ${(stats.sentMessages / user.contactLimit) > 0.9 ? 'bg-red-500' : 'bg-indigo-600'
                                    }`}
                                style={{ width: `${Math.min((stats.sentMessages / user.contactLimit) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-sm font-medium text-gray-600">{stats.sentMessages} / {user.contactLimit} Messages sent</span>
                            <span className="text-sm font-bold text-indigo-600">{Math.round((stats.sentMessages / user.contactLimit) * 100)}%</span>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Card */}
                <div className="bg-indigo-700 p-8 rounded-2xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-indigo-100 text-sm font-bold uppercase tracking-wider">Messages Sent</h3>
                        <p className="text-5xl font-black mt-2">{stats.sentMessages}</p>
                    </div>
                    <div className="mt-6 relative z-10">
                        <Link to="/send" className="block w-full bg-white text-indigo-700 font-bold py-3 rounded-xl text-center hover:bg-indigo-50 transition active:scale-95 shadow-md">
                            Run Campaign
                        </Link>
                    </div>
                    {/* Decorative pattern */}
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-indigo-600 rounded-full opacity-50 blur-2xl"></div>
                </div>
            </div>

            {/* Business Settings */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Business Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side: Business Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Business Name</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                value={profileData.businessName}
                                onChange={(e) => setProfileData(prev => ({ ...prev, businessName: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Google Review Link</label>
                            <input
                                type="text"
                                placeholder="https://g.page/r/your-id/review"
                                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                value={profileData.reviewLink}
                                onChange={(e) => setProfileData(prev => ({ ...prev, reviewLink: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Right Side: Actions */}
                    <div className="flex flex-col justify-end gap-4">
                        <p className="text-[11px] text-gray-400 italic leading-relaxed">
                            Updating your business name will reflect across all campaign messages and your dashboard header instantly.
                        </p>

                        <div>
                            <button
                                onClick={handleUpdateProfile}
                                disabled={loading}
                                className={`w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-50' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : 'Save Business Settings'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-widest opacity-50">Quick Navigation</h3>
                <div className="flex flex-wrap gap-4">
                    <Link to="/contacts" className="flex-1 min-w-[150px] text-center py-4 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition border border-gray-200 flex items-center justify-center gap-2">
                        Contacts List
                    </Link>
                    <Link to="/contacts" className="flex-1 min-w-[150px] text-center py-4 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition border border-indigo-100 flex items-center justify-center gap-2">
                        Import New List
                    </Link>
                    <Link to="/send" className="flex-1 min-w-[150px] text-center py-4 bg-green-50 text-green-700 rounded-xl font-bold hover:bg-green-100 transition border border-green-100 flex items-center justify-center gap-2">
                        Send Campaign
                    </Link>
                </div>
            </div>

            {/* NEW Instruction Modal */}
            <InstructionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedPlan={currentPlan}
                billingCycle="monthly" // Default to monthly for dashboard view
                onProceed={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Dashboard;