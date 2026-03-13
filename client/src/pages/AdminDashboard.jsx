/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import AuthContext from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && user?.role === 'admin') {
            fetchUsers();
        }
    }, [authLoading, user]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (userId, status) => {
        try {
            await api.put(`/admin/users/${userId}`, { paymentStatus: status });
            toast.success('Payment status updated');
            fetchUsers();
        } catch {
            toast.error('Update failed');
        }
    };

    const handleUpdatePlan = async (userId, plan) => {
        try {
            await api.put(`/admin/users/${userId}`, { plan });
            toast.success(`Plan updated to ${plan}`);
            fetchUsers();
        } catch {
            toast.error('Plan update failed');
        }
    };

    const handleUpdateCycle = async (userId, billingCycle) => {
        try {
            await api.put(`/admin/users/${userId}`, { billingCycle });
            toast.success(`Cycle updated to ${billingCycle}`);
            fetchUsers();
        } catch {
            toast.error('Cycle update failed');
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.businessName && u.businessName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // 1. Wait for Auth Check
    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // 2. Check Role
    if (user?.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-100 max-w-md mx-4">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m0 0v2m0-2h2m-2 0H10m10-4.5V12a8 8 0 11-16 0c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-500 mb-8">Your account does not have administrative privileges. If this is an error, please re-login.</p>
                    <a href="/" className="inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900">Admin Panel</h1>
                        <p className="text-gray-500">Manage users and payments across the platform</p>
                    </div>

                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Search by name, email or business..."
                            className="w-full px-5 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">User / Business</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Plan & Cycle</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Contact Usage</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Payment Status</th>
                                        <th className="px-6 py-4 text-sm font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((u) => (
                                        <motion.tr
                                            key={u._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-6">
                                                <div className="font-bold text-gray-900">{u.name}</div>
                                                <div className="text-gray-500 text-sm">{u.email}</div>
                                                <div className="text-indigo-600 text-xs font-bold mt-1 uppercase tracking-tighter flex items-center gap-2">
                                                    {u.businessName || 'No Business Name'}
                                                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest ${u.currency === 'USD' ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>
                                                        {u.currency === 'USD' ? 'INTERNATIONAL' : 'LOCAL'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-medium">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase w-fit ${u.plan === 'business' ? 'bg-purple-100 text-purple-700' :
                                                        u.plan === 'growth' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {u.plan}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase w-fit ${u.billingCycle === 'yearly' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>
                                                        {u.billingCycle || 'monthly'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="w-full max-w-[150px]">
                                                    <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                                        <span>{u.contactCount || 0} / {u.contactLimit}</span>
                                                        <span>{Math.round(((u.contactCount || 0) / u.contactLimit) * 100)}%</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-500 ${((u.contactCount || 0) / u.contactLimit) > 0.9 ? 'bg-red-500' :
                                                                ((u.contactCount || 0) / u.contactLimit) > 0.7 ? 'bg-amber-500' : 'bg-indigo-600'
                                                                }`}
                                                            style={{ width: `${Math.min(100, ((u.contactCount || 0) / u.contactLimit) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <button
                                                    onClick={() => handleUpdateStatus(u._id, u.paymentStatus === 'done' ? 'pending' : 'done')}
                                                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all transform active:scale-95 ${u.paymentStatus === 'done'
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200 shadow-lg shadow-red-100'
                                                        }`}
                                                >
                                                    {u.paymentStatus === 'done' ? 'Verified' : 'Verify Now'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <select
                                                        value={u.plan}
                                                        onChange={(e) => handleUpdatePlan(u._id, e.target.value)}
                                                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    >
                                                        <option value="startup">Startup</option>
                                                        <option value="growth">Growth</option>
                                                        <option value="business">Business</option>
                                                    </select>
                                                    <select
                                                        value={u.billingCycle || 'monthly'}
                                                        onChange={(e) => handleUpdateCycle(u._id, e.target.value)}
                                                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                    >
                                                        <option value="monthly">Monthly</option>
                                                        <option value="yearly">Yearly</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredUsers.length === 0 && (
                            <div className="py-20 text-center">
                                <p className="text-gray-400 text-lg">No users found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
