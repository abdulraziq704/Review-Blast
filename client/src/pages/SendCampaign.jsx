import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const SendCampaign = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalContacts: 0, pendingContacts: 0, sentHistory: 0 });
    const [loadingStats, setLoadingStats] = useState(true);
    const [sending, setSending] = useState(false);
    const [results, setResults] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState('Standard');

    const templates = {
        'Standard': {
            slug: 'Standard',
            text: (name, business) => <>Hello <strong>{name || '[Customer Name]'}</strong>,<br /><br />Thank you for choosing <strong>{business || '[Business Name]'}</strong>. We truly appreciate your visit and hope you had a great experience with us.<br /><br />If you have a moment, we would love to hear your thoughts. Your feedback helps us improve and helps others make better choices.<br /><br />Please share your review here:</>
        },
        'Friendly': {
            slug: 'Friendly',
            text: (name, business) => <>Hi <strong>{name || '[Customer Name]'}</strong>! 👋<br /><br />We hope you enjoyed your time at <strong>{business || '[Business Name]'}</strong>. It was a pleasure having you!<br /><br />If you loved our service, would you mind leaving us a quick review? It means the world to us!<br /><br />Link below:</>
        },
        'Incentive': {
            slug: 'Incentive',
            text: (name, business) => <>Hello <strong>{name || '[Customer Name]'}</strong>,<br /><br />Thank you for visiting <strong>{business || '[Business Name]'}</strong>! 🌟<br /><br />We're constantly striving to improve. Could you share your feedback with us? As a thank you, show this review on your next visit for a surprise!<br /><br />Review here:</>
        },
        'Direct': {
            slug: 'Direct',
            text: (name, business) => <>Hello <strong>{name || '[Customer Name]'}</strong>, Thank you for your recent visit to <strong>{business || '[Business Name]'}</strong>.<br /><br />Your service record is now updated.<br /><br />You can view your details and provide feedback here: </>
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoadingStats(true);
        try {
            const { data } = await api.get('/contacts/stats');
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingStats(false);
        }
    };

    const handleSend = async () => {
        if (!stats.pendingContacts) {
            toast.error('No pending contacts to send to');
            return;
        }

        const confirmSend = window.confirm(`Are you sure you want to send WhatsApp messages to ${stats.pendingContacts} pending contacts?`);
        if (!confirmSend) return;

        setSending(true);
        try {
            const { data } = await api.post('/contacts/send-reviews', { 
                contactIds: [], 
                messageTemplate: templates[selectedTemplate].slug 
            });
            setResults(data.results);
            toast.success('Campaign started! Processing in background.');
            fetchStats();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send campaign');
        } finally {
            setSending(false);
        }
    };

    const handleStatClick = () => {
        navigate('/dashboard-app/contacts', { state: { activeTab: 'history' } });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {!user && (
                <div className="lg:col-span-12 flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            {user && (
                <>
                    <div className="lg:col-span-5 flex justify-center py-4 lg:py-0">
                        <div className="relative w-[300px] h-[600px] overflow-hidden flex flex-col">
                            <img
                                src="/reviewblast_mockups.webp"
                                alt="WhatsApp Mockup"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-0 top-[14%] bottom-[12%] px-6 overflow-y-auto z-10 flex flex-col gap-2">
                                <div className="relative bg-white rounded-xl rounded-tl-none p-3 shadow-sm max-w-[95%] self-start mt-2 ml-1">
                                    <div className="absolute top-0 -left-[8px] w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>
                                    <div className="text-[13px] text-gray-800 leading-snug">
                                        {templates[selectedTemplate].text(null, user?.businessName)}
                                        <br /><br />
                                        <a href={user?.reviewLink} className="text-blue-500 break-all">{user?.reviewLink}</a><br /><br />
                                        Thank you again for your time and support!
                                    </div>
                                    <div className="text-[10px] text-gray-400 text-right mt-1 font-medium">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-6 rounded shadow">
                            <h2 className="text-xl font-bold mb-4">Send Review Campaign</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded text-center">
                                    <div className="text-2xl font-bold text-blue-700">
                                        {loadingStats ? '...' : stats.totalContacts}
                                    </div>
                                    <div className="text-sm text-blue-600">Total Contacts</div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded text-center">
                                    <div className="text-2xl font-bold text-yellow-700">
                                        {loadingStats ? '...' : stats.pendingContacts}
                                    </div>
                                    <div className="text-sm text-yellow-600">Pending</div>
                                </div>
                                <button
                                    onClick={handleStatClick}
                                    disabled={loadingStats}
                                    className="bg-green-50 p-4 rounded text-center hover:bg-green-100 transition-colors border border-green-100 cursor-pointer disabled:opacity-50"
                                >
                                    <div className="text-2xl font-bold text-green-700">
                                        {loadingStats ? '...' : stats.sentHistory}
                                    </div>
                                    <div className="text-sm text-green-600">Sent History</div>
                                </button>
                            </div>

                            <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-3">Campaign Setup</h3>
                                <div className="space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 text-sm">
                                        <span className="text-gray-600">Business Name:</span>
                                        <span className="font-semibold text-gray-900 truncate">{user?.businessName}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 text-sm items-start sm:items-center">
                                        <span className="text-gray-600">Review Link:</span>
                                        <span className="text-blue-600 truncate max-w-full sm:max-w-[200px] text-xs underline font-medium">{user?.reviewLink || 'Not Set'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Select Message Template</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {Object.keys(templates).map((tempName) => (
                                        <button
                                            key={tempName}
                                            onClick={() => setSelectedTemplate(tempName)}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${selectedTemplate === tempName
                                                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
                                                : 'border-gray-100 bg-white hover:border-indigo-300'
                                                }`}
                                        >
                                            <div className={`text-xs font-bold mb-1 ${selectedTemplate === tempName ? 'text-indigo-600' : 'text-gray-600'}`}>
                                                {tempName}
                                            </div>
                                            <div className="text-[10px] text-gray-400 line-clamp-2 leading-tight">
                                                {templates[tempName].slug} Message Template
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                {user?.paymentStatus === 'pending' && (
                                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        Account Restricted: Payment status is pending.
                                    </div>
                                )}
                                <button
                                    onClick={handleSend}
                                    disabled={sending || loadingStats || stats.pendingContacts === 0 || user?.paymentStatus === 'pending'}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg active:scale-95 ${sending || loadingStats || stats.pendingContacts === 0 || user?.paymentStatus === 'pending'
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        }`}
                                >
                                    {sending ? 'Sending...' : user?.paymentStatus === 'pending' ? 'Payment Required' : `RUN CAMPAIGN (Send to ${stats.pendingContacts} Pending)`}
                                </button>
                            </div>
                        </div>

                        {results && (
                            <div className="bg-white p-6 rounded shadow">
                                <h3 className="text-lg font-bold mb-4">Last Run Results</h3>
                                <div className="max-h-64 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {results.map((res, idx) => (
                                                <tr key={idx}>
                                                    <td className="px-6 py-4">{res.phone}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${res.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {res.status}
                                                        </span>
                                                        {res.error && <span className="ml-2 text-xs text-red-500">{res.error}</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SendCampaign;