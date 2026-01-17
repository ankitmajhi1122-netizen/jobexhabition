import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import ModernNav from '../../components/ModernNav';
import {
    FileText, Plus, Edit2, Trash2, Star, Loader2,
    Save, X, CheckCircle, AlertCircle
} from 'lucide-react';

interface CoverLetter {
    id: number;
    template_name: string;
    content: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

const CoverLetters = () => {
    const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        template_name: '',
        content: '',
        is_default: false
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        console.log('🔄 CoverLetters: Component mounted, initializing...');
        fetchCoverLetters();
    }, []);

    const fetchCoverLetters = async () => {
        console.log('📥 CoverLetters: Fetching cover letters from API...');
        try {
            const response = await api.get('/candidate/cover_letters.php');
            console.log('✅ CoverLetters: API Response:', response.data);
            if (response.data.success) {
                console.log(`📄 CoverLetters: Loaded ${response.data.data.length} cover letters`);
                setCoverLetters(response.data.data);
            }
        } catch (error) {
            console.error('❌ CoverLetters: Failed to fetch cover letters', error);
        } finally {
            console.log('🏁 CoverLetters: Loading complete');
            setLoading(false);
        }
    };

    const handleAdd = () => {
        console.log('➕ CoverLetters: Opening modal to create new cover letter');
        setEditingId(null);
        setFormData({ template_name: '', content: '', is_default: false });
        setShowModal(true);
    };

    const handleEdit = (letter: CoverLetter) => {
        console.log(`✏️ CoverLetters: Opening modal to edit letter ID ${letter.id}: "${letter.template_name}"`);
        setEditingId(letter.id);
        setFormData({
            template_name: letter.template_name,
            content: letter.content,
            is_default: letter.is_default
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`💾 CoverLetters: Submitting ${editingId ? 'update' : 'create'} request...`);
        console.log('📝 CoverLetters: Form data:', formData);
        setSaving(true);
        setMessage('');

        try {
            if (editingId) {
                console.log(`🔄 CoverLetters: Updating cover letter ID ${editingId}`);
                await api.put('/candidate/cover_letters.php', { ...formData, id: editingId });
                console.log('✅ CoverLetters: Update successful');
                setMessage('Cover letter updated successfully!');
            } else {
                console.log('➕ CoverLetters: Creating new cover letter');
                await api.post('/candidate/cover_letters.php', formData);
                console.log('✅ CoverLetters: Create successful');
                setMessage('Cover letter created successfully!');
            }
            setMessageType('success');
            setShowModal(false);
            fetchCoverLetters();
            setTimeout(() => setMessage(''), 3000);
        } catch (error: any) {
            console.error('❌ CoverLetters: Save failed:', error);
            console.error('Error details:', error.response?.data);
            setMessage(error.response?.data?.message || 'Failed to save cover letter');
            setMessageType('error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        console.log(`🗑️ CoverLetters: Delete requested for ID ${id}`);
        if (!confirm('Are you sure you want to delete this cover letter?')) {
            console.log('❌ CoverLetters: Delete cancelled by user');
            return;
        }

        console.log(`🗑️ CoverLetters: Deleting cover letter ID ${id}...`);
        try {
            await api.delete('/candidate/cover_letters.php', { data: { id } });
            console.log('✅ CoverLetters: Delete successful');
            setMessage('Cover letter deleted successfully!');
            setMessageType('success');
            fetchCoverLetters();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ CoverLetters: Delete failed:', error);
            setMessage('Failed to delete cover letter');
            setMessageType('error');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <ModernNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Cover Letters</h1>
                    <p className="text-gray-600">Manage your cover letter templates</p>
                </div>

                {/* Message */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
                                messageType === 'success' 
                                    ? 'bg-green-50 text-green-800 border border-green-200' 
                                    : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                        >
                            {messageType === 'success' ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <AlertCircle className="w-5 h-5" />
                            )}
                            <p className="font-medium">{message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Add Button */}
                <div className="mb-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAdd}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Create New Cover Letter
                    </motion.button>
                </div>

                {/* Cover Letters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coverLetters.map((letter) => (
                        <motion.div
                            key={letter.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                            {letter.template_name}
                                            {letter.is_default && (
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            )}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Updated {new Date(letter.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 line-clamp-4">
                                    {letter.content}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(letter)}
                                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(letter.id)}
                                    className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {coverLetters.length === 0 && (
                    <div className="text-center py-16">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No cover letters yet</h3>
                        <p className="text-gray-500 mb-6">Create your first cover letter template</p>
                        <button
                            onClick={handleAdd}
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Create Cover Letter
                        </button>
                    </div>
                )}
            </main>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingId ? 'Edit Cover Letter' : 'Create Cover Letter'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Template Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.template_name}
                                        onChange={(e) => setFormData({ ...formData, template_name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="e.g., Software Engineer Template"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cover Letter Content
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                        rows={12}
                                        placeholder="Write your cover letter here..."
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_default"
                                        checked={formData.is_default}
                                        onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="is_default" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        Set as default template
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-5 h-5" />
                                                {editingId ? 'Update' : 'Create'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CoverLetters;
