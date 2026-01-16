import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ModernNav from '../../components/ModernNav';
import {
    Bell, Plus, Edit2, Trash2, Loader2, Save, X, CheckCircle, 
    AlertCircle, MapPin, Briefcase, DollarSign, Clock, BellOff
} from 'lucide-react';

interface JobAlert {
    id: number;
    alert_name: string;
    keywords: string;
    location: string;
    min_salary: number | null;
    max_salary: number | null;
    job_type: string;
    experience_level: string;
    frequency: 'instant' | 'daily' | 'weekly';
    is_active: boolean;
    last_sent_at: string | null;
    created_at: string;
}

const JobAlerts = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [alerts, setAlerts] = useState<JobAlert[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        alert_name: '',
        keywords: '',
        location: '',
        min_salary: '',
        max_salary: '',
        job_type: '',
        experience_level: '',
        frequency: 'daily' as 'instant' | 'daily' | 'weekly',
        is_active: true
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error'>('success');

    useEffect(() => {
        console.log('🔄 JobAlerts: Component mounted, initializing...');
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        console.log('📥 JobAlerts: Fetching job alerts from API...');
        try {
            const response = await api.get('/candidate/job_alerts.php');
            console.log('✅ JobAlerts: API Response:', response.data);
            if (response.data.success) {
                console.log(`🔔 JobAlerts: Loaded ${response.data.data.length} job alerts`);
                setAlerts(response.data.data);
            }
        } catch (error) {
            console.error('❌ JobAlerts: Failed to fetch job alerts', error);
        } finally {
            console.log('🏁 JobAlerts: Loading complete');
            setLoading(false);
        }
    };

    const handleAdd = () => {
        console.log('➕ JobAlerts: Opening modal to create new job alert');
        setEditingId(null);
        setFormData({
            alert_name: '',
            keywords: '',
            location: '',
            min_salary: '',
            max_salary: '',
            job_type: '',
            experience_level: '',
            frequency: 'daily',
            is_active: true
        });
        setShowModal(true);
    };

    const handleEdit = (alert: JobAlert) => {
        console.log(`✏️ JobAlerts: Opening modal to edit alert ID ${alert.id}: "${alert.alert_name}"`);
        console.log('Alert details:', alert);
        setEditingId(alert.id);
        setFormData({
            alert_name: alert.alert_name,
            keywords: alert.keywords || '',
            location: alert.location || '',
            min_salary: alert.min_salary?.toString() || '',
            max_salary: alert.max_salary?.toString() || '',
            job_type: alert.job_type || '',
            experience_level: alert.experience_level || '',
            frequency: alert.frequency,
            is_active: alert.is_active
        });
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(`💾 JobAlerts: Submitting ${editingId ? 'update' : 'create'} request...`);
        setSaving(true);
        setMessage('');

        const payload = {
            ...formData,
            min_salary: formData.min_salary ? parseFloat(formData.min_salary) : null,
            max_salary: formData.max_salary ? parseFloat(formData.max_salary) : null,
            ...(editingId && { id: editingId })
        };

        console.log('📝 JobAlerts: Payload:', payload);

        try {
            if (editingId) {
                console.log(`🔄 JobAlerts: Updating job alert ID ${editingId}`);
                await api.put('/candidate/job_alerts.php', payload);
                console.log('✅ JobAlerts: Update successful');
                setMessage('Job alert updated successfully!');
            } else {
                console.log('➕ JobAlerts: Creating new job alert');
                await api.post('/candidate/job_alerts.php', payload);
                console.log('✅ JobAlerts: Create successful');
                setMessage('Job alert created successfully!');
            }
            setMessageType('success');
            setShowModal(false);
            fetchAlerts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error: any) {
            console.error('❌ JobAlerts: Save failed:', error);
            console.error('Error details:', error.response?.data);
            setMessage(error.response?.data?.message || 'Failed to save job alert');
            setMessageType('error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        console.log(`🗑️ JobAlerts: Delete requested for ID ${id}`);
        if (!confirm('Are you sure you want to delete this job alert?')) {
            console.log('❌ JobAlerts: Delete cancelled by user');
            return;
        }

        console.log(`🗑️ JobAlerts: Deleting job alert ID ${id}...`);
        try {
            await api.delete('/candidate/job_alerts.php', { data: { id } });
            console.log('✅ JobAlerts: Delete successful');
            setMessage('Job alert deleted successfully!');
            setMessageType('success');
            fetchAlerts();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('❌ JobAlerts: Delete failed:', error);
            setMessage('Failed to delete job alert');
            setMessageType('error');
        }
    };

    const toggleActive = async (alert: JobAlert) => {
        const newStatus = !alert.is_active;
        console.log(`🔄 JobAlerts: Toggling alert ID ${alert.id} to ${newStatus ? 'ACTIVE' : 'INACTIVE'}`);
        try {
            await api.put('/candidate/job_alerts.php', {
                id: alert.id,
                alert_name: alert.alert_name,
                keywords: alert.keywords,
                location: alert.location,
                min_salary: alert.min_salary,
                max_salary: alert.max_salary,
                job_type: alert.job_type,
                experience_level: alert.experience_level,
                frequency: alert.frequency,
                is_active: newStatus
            });
            console.log(`✅ JobAlerts: Toggle successful - Alert is now ${newStatus ? 'ACTIVE' : 'INACTIVE'}`);
            fetchAlerts();
        } catch (error) {
            console.error('❌ JobAlerts: Toggle failed:', error);
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Job Alerts</h1>
                    <p className="text-gray-600">Get notified when new jobs match your criteria</p>
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
                        Create New Job Alert
                    </motion.button>
                </div>

                {/* Job Alerts List */}
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                                alert.is_active 
                                    ? 'border-blue-100 hover:shadow-lg' 
                                    : 'border-gray-100 opacity-60'
                            }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-2 rounded-lg ${
                                            alert.is_active 
                                                ? 'bg-blue-50 text-blue-600' 
                                                : 'bg-gray-100 text-gray-400'
                                        }`}>
                                            {alert.is_active ? (
                                                <Bell className="w-5 h-5" />
                                            ) : (
                                                <BellOff className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                {alert.alert_name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {alert.frequency.charAt(0).toUpperCase() + alert.frequency.slice(1)} notifications
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                                        {alert.keywords && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">Keywords:</span>
                                                <span>{alert.keywords}</span>
                                            </div>
                                        )}
                                        {alert.location && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">Location:</span>
                                                <span>{alert.location}</span>
                                            </div>
                                        )}
                                        {(alert.min_salary || alert.max_salary) && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <DollarSign className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">Salary:</span>
                                                <span>
                                                    {alert.min_salary && `$${alert.min_salary.toLocaleString()}`}
                                                    {alert.min_salary && alert.max_salary && ' - '}
                                                    {alert.max_salary && `$${alert.max_salary.toLocaleString()}`}
                                                </span>
                                            </div>
                                        )}
                                        {alert.job_type && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">Type:</span>
                                                <span>{alert.job_type}</span>
                                            </div>
                                        )}
                                        {alert.experience_level && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Briefcase className="w-4 h-4 text-gray-400" />
                                                <span className="font-medium">Level:</span>
                                                <span>{alert.experience_level}</span>
                                            </div>
                                        )}
                                    </div>

                                    {alert.last_sent_at && (
                                        <p className="text-xs text-gray-400">
                                            Last sent: {new Date(alert.last_sent_at).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-2 ml-4">
                                    <button
                                        onClick={() => toggleActive(alert)}
                                        className={`px-4 py-2 font-semibold rounded-lg transition-colors ${
                                            alert.is_active
                                                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {alert.is_active ? 'Active' : 'Inactive'}
                                    </button>
                                    <button
                                        onClick={() => handleEdit(alert)}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(alert.id)}
                                        className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {alerts.length === 0 && (
                    <div className="text-center py-16">
                        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No job alerts yet</h3>
                        <p className="text-gray-500 mb-6">Create your first job alert to get notified of new opportunities</p>
                        <button
                            onClick={handleAdd}
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Create Job Alert
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
                            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingId ? 'Edit Job Alert' : 'Create Job Alert'}
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
                                        Alert Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.alert_name}
                                        onChange={(e) => setFormData({ ...formData, alert_name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        placeholder="e.g., Remote Software Engineer Jobs"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Keywords
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.keywords}
                                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="e.g., React, Node.js"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="e.g., Remote, New York"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Min Salary
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.min_salary}
                                            onChange={(e) => setFormData({ ...formData, min_salary: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="e.g., 80000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Max Salary
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.max_salary}
                                            onChange={(e) => setFormData({ ...formData, max_salary: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="e.g., 120000"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Job Type
                                        </label>
                                        <select
                                            value={formData.job_type}
                                            onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        >
                                            <option value="">Any</option>
                                            <option value="permanent">Permanent</option>
                                            <option value="contract">Contract</option>
                                            <option value="temporary">Temporary</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Experience Level
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.experience_level}
                                            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                            placeholder="e.g., 3-5 years"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Notification Frequency
                                    </label>
                                    <select
                                        value={formData.frequency}
                                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        required
                                    >
                                        <option value="instant">Instant</option>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Bell className="w-4 h-4 text-blue-500" />
                                        Alert is active
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

export default JobAlerts;
