import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const SendCampaign = () => {
    const { user } = useContext(AuthContext);
    const [contacts, setContacts] = useState([]);
    const [sending, setSending] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const { data } = await api.get('/contacts');
            setContacts(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSend = async () => {
        // 1. Filter to get only pending contacts
        const pendingContacts = contacts.filter(c => c.status === 'pending');

        if (!pendingContacts.length) {
            toast.error('No pending contacts to send to');
            return;
        }

        // 2. Update the confirmation message to reflect the real count
        const confirmSend = window.confirm(`Are you sure you want to send WhatsApp messages to ${pendingContacts.length} pending contacts?`);
        if (!confirmSend) return;

        setSending(true);
        try {
            // 3. Map only the pending IDs
            const contactIds = pendingContacts.map(c => c._id);
            const { data } = await api.post('/contacts/send-reviews', { contactIds });

            setResults(data.results);
            toast.success('Campaign finished');
            fetchContacts(); // Refresh status to show updated counts
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send campaign');
        } finally {
            setSending(false);
        }
    };
    const pendingCount = contacts.filter(c => c.status === 'pending').length;
    const sentCount = contacts.filter(c => c.status === 'sent').length;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            <div className="lg:col-span-5 flex justify-center py-4 lg:py-0">
                {/* REDUCED HEIGHT & WIDTH: changed to w-[300px] and h-[520px] */}
                <div className="relative w-[300px] h-[520px] bg-[#EFEAE2] border-[12px] border-gray-900 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col">

                    {/* Top Notch - scaled down to fit the new width */}
                    <div className="absolute top-0 inset-x-0 h-5 w-32 bg-gray-900 mx-auto rounded-b-2xl z-20"></div>

                    {/* WhatsApp Header - reduced top padding (pt-8) so the notch doesn't overlap */}
                    <div className="bg-[#008069] text-white pt-8 pb-3 px-3 flex items-center gap-2 relative z-10 shadow-md">
                        <div className="flex items-center gap-1 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-[15px] font-semibold leading-tight">Customer</h2>
                            <p className="text-[11px] text-gray-200">online</p>
                        </div>
                        <div className="flex gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                        </div>
                    </div>

                    {/* Chat Area Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}></div>

                    {/* Messages Container */}
                    <div className="flex-1 p-3 overflow-y-auto z-10 flex flex-col gap-2">

                        {/* Received Message Bubble */}
                        <div className="relative bg-white rounded-xl rounded-tl-none p-2 shadow-sm max-w-[90%] self-start mt-2">
                            {/* Tail */}
                            <div className="absolute top-0 -left-[8px] w-0 h-0 border-t-[10px] border-t-white border-l-[10px] border-l-transparent"></div>

                            {/* Text size reduced slightly to fit the smaller phone screen */}
                            <div className="text-[13.5px] text-gray-800 leading-snug">
                                {user?.reviewLink ? (
                                    <>
                                        Hi [Customer Name], thank you for choosing <strong>{user.businessName}</strong>. We'd love your feedback! Please leave us a review here: <a href={user.reviewLink} className="text-blue-500 break-all">{user.reviewLink}</a>
                                    </>
                                ) : (
                                    <span className="text-red-500">Warning: No review link set!</span>
                                )}
                            </div>

                            <div className="text-[10px] text-gray-400 text-right mt-1 font-medium">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* LEFT COLUMN: Controls & Results */}
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-xl font-bold mb-4">Send Review Campaign</h2>

                    {/* Raw Text Preview */}
                    <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message Content</h3>
                        <div className="p-3 bg-white border rounded text-sm text-gray-700 italic">
                            {user?.reviewLink ? (
                                <>
                                    Hi [Customer Name], Thank you for choosing <span className="font-semibold text-indigo-600">{user.businessName}</span>. We'd love your feedback! Please leave us a review here: <span className="text-blue-500 underline">{user.reviewLink}</span>
                                </>
                            ) : (
                                <span className="text-red-500">Warning: No review link set! Please add one in the Dashboard.</span>
                            )}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded text-center">
                            <div className="text-2xl font-bold text-blue-700">{contacts.length}</div>
                            <div className="text-sm text-blue-600">Total Contacts</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded text-center">
                            <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
                            <div className="text-sm text-yellow-600">Pending</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded text-center">
                            <div className="text-2xl font-bold text-green-700">{sentCount}</div>
                            <div className="text-sm text-green-600">Sent</div>
                        </div>
                    </div>

                    {/* Action Button */}
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
                            disabled={sending || pendingCount === 0 || user?.paymentStatus === 'pending'}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition shadow-lg active:scale-95 ${sending || pendingCount === 0 || user?.paymentStatus === 'pending'
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            {sending ? 'Sending...' : user?.paymentStatus === 'pending' ? 'Payment Required' : `RUN CAMPAIGN (Send to ${pendingCount} Pending)`}
                        </button>
                    </div>
                </div>

                {/* Results Table */}
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

            {/* RIGHT COLUMN: Mobile WhatsApp Mockup */}


        </div>
    );
};

export default SendCampaign; 