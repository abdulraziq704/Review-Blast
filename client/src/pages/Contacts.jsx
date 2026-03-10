import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import CSVUpload from '../components/CSVUpload';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Install react-icons

const Contacts = () => {
    const location = useLocation();
    const [contacts, setContacts] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [editingContact, setEditingContact] = useState(null);
    const [newContact, setNewContact] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(false);

    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    const fetchContacts = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/contacts');
            setContacts(data);
        } catch {
            toast.error('Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchContacts(); }, []);

    // Filter contacts based on tab
    const filteredContacts = contacts.filter(c => {
        if (activeTab === 'history') return c.status !== 'pending';
        return c.status === 'pending';
    });

    // Selection Logic
    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === filteredContacts.length ? [] : filteredContacts.map(c => c._id));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this contact?')) return;
        try {
            await api.delete(`/contacts/${id}`);
            toast.success('Contact removed');
            fetchContacts();
        } catch {
            toast.error('Failed to delete contact');
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedIds.length} contacts?`)) return;

        try {
            await api.post('/contacts/bulk-delete', { contactIds: selectedIds });
            toast.success('Contacts deleted successfully');
            setSelectedIds([]);
            fetchContacts();
        } catch {
            toast.error('Bulk delete failed');
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/contacts', newContact);
            toast.success('Contact added');
            setNewContact({ name: '', phone: '' });
            fetchContacts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error');
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/contacts/${editingContact._id}`, editingContact);
            toast.success('Contact updated');
            setEditingContact(null);
            fetchContacts();
        } catch {
            toast.error('Update failed');
        }
    };

    // Add this inside your Contacts component
    const handlePhoneInput = (e) => {
        const value = e.target.value;
        // Regex: Allow only numbers, and allow '+' ONLY if it is the first character
        const cleaned = value.replace(/(?!^\+)\D/g, '');

        if (editingContact) {
            setEditingContact({ ...editingContact, phone: cleaned });
        } else {
            setNewContact({ ...newContact, phone: cleaned });
        }
    };


    return (
        <div className="space-y-6">
            {/* Add/Edit Form */}
            {activeTab === 'active' && (
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">{editingContact ? 'Edit Contact' : 'Add Single Contact'}</h2>
                    <form onSubmit={editingContact ? handleUpdate : handleAddSubmit} className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            className="border p-2 rounded flex-1"
                            value={editingContact ? editingContact.name : newContact.name}
                            onChange={(e) => editingContact ? setEditingContact({ ...editingContact, name: e.target.value }) : setNewContact({ ...newContact, name: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Phone (e.g. +92300...)"
                            className="border p-2 rounded flex-1"
                            // Conditional value based on if we are editing or adding
                            value={editingContact ? editingContact.phone : newContact.phone}
                            // New validation handler
                            onChange={handlePhoneInput}
                            required
                        />
                        <button type="submit" className={`px-6 py-2 rounded text-white ${editingContact ? 'bg-orange-500' : 'bg-indigo-600'}`}>
                            {editingContact ? 'Update' : 'Add'}
                        </button>
                        {editingContact && <button onClick={() => setEditingContact(null)} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>}
                    </form>
                </div>
            )}

            {activeTab === 'active' && (
                <div className="bg-white p-6 rounded shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Upload Users via CSV</h2>
                        <a
                            href="https://docs.google.com/spreadsheets/d/1OBs_YrBr3BZEDGR81h5BabNvi6zaWkc-QKmmtK1eAj4/edit?usp=sharing"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline transition-colors"
                        >
                            See Sample File
                        </a>
                    </div>
                    <CSVUpload onUploadSuccess={fetchContacts} />
                </div>
            )}

            <div className="bg-white p-6 rounded shadow">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => { setActiveTab('active'); setSelectedIds([]); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'active' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Active Contacts
                        </button>
                        <button
                            onClick={() => { setActiveTab('history'); setSelectedIds([]); }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-white text-indigo-600 shadow' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            History
                        </button>
                    </div>

                    {selectedIds.length > 0 && activeTab === 'active' && (
                        <button onClick={handleBulkDelete} className="bg-red-600 text-white text-xs px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2">
                            <FaTrash size={12} /> Delete Selected ({selectedIds.length})
                        </button>
                    )}
                </div>

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">
                        {activeTab === 'active' ? 'Contact List' : 'Successfully Sent History'} ({filteredContacts.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {activeTab === 'active' && (
                                    <th className="px-6 py-3 text-left"><input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === filteredContacts.length && filteredContacts.length > 0} /></th>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                {activeTab === 'active' && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={activeTab === 'active' ? 5 : 3} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                                            <span className="font-medium animate-pulse">Loading contacts...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {filteredContacts.map((contact) => (
                                        <tr key={contact._id} className={selectedIds.includes(contact._id) ? 'bg-indigo-50' : ''}>
                                            {activeTab === 'active' && (
                                                <td className="px-6 py-4"><input type="checkbox" checked={selectedIds.includes(contact._id)} onChange={() => toggleSelect(contact._id)} /></td>
                                            )}
                                            <td className="px-6 py-4">{contact.name}</td>
                                            <td className="px-6 py-4">{contact.phone}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs rounded-full ${contact.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {contact.status}
                                                </span>
                                            </td>
                                            {activeTab === 'active' && (
                                                <td className="px-6 py-4 flex gap-3">
                                                    <button onClick={() => setEditingContact(contact)} className="text-blue-600 hover:text-blue-900"><FaEdit /></button>
                                                    <button onClick={() => handleDelete(contact._id)} className="text-red-600 hover:text-red-900"><FaTrash /></button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    {filteredContacts.length === 0 && (
                                        <tr>
                                            <td colSpan={activeTab === 'active' ? 5 : 3} className="px-6 py-8 text-center text-gray-500">
                                                No contacts found in {activeTab === 'active' ? 'Active' : 'History'}.
                                            </td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

export default Contacts;