import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, Briefcase, Users,
    Building2, LogOut, Bell, Save, MapPin, Globe,
    Phone, Loader2
} from 'lucide-react';

const CompanyProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [profile, setProfile] = useState({
        company_name: '',
        contact_person: '',
        phone: '',
        address: '',
        website: '',
        // For consultancy
        registration_no: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/company/profile.php');
            if (response.data.status === 'success') {
                // Pre-fill data if exists
                const data = response.data.data;
                setProfile({
                    company_name: data.company_name || '',
                    contact_person: data.contact_person || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    website: data.website || '',
                    registration_no: data.registration_no || ''
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/company/profile.php', profile);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar Navigation */}
            <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-20 shadow-xl">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/50">
                        <LayoutDashboard className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">RecruitPro</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2 mt-2">Main Menu</div>
                    <Link to="/company/dashboard" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link to="/company/post-job" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                        <PlusCircle className="w-5 h-5" />
                        Post Job
                    </Link>
                    <Link to="/company/my-jobs" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                        <Briefcase className="w-5 h-5" />
                        My Jobs
                    </Link>
                    <Link to="/company/applicants" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                        <Users className="w-5 h-5" />
                        Applicants
                    </Link>

                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-8 mb-3 px-2">Settings</div>
                    <Link to="/company/profile" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-md transition-all hover:bg-blue-500">
                        <Building2 className="w-5 h-5" />
                        Company Profile
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-xl w-full transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 transition-all">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-100 h-16 flex items-center justify-between px-8 sticky top-0 z-10 backdrop-blur-sm bg-white/90">
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Company Settings</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative rounded-full hover:bg-gray-50">
                            <Bell className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Recruiter'}</p>
                                <p className="text-xs text-gray-500">Company Admin</p>
                            </div>
                            <div className="h-10 w-10 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-100 shadow-sm">
                                {user?.name?.charAt(0) || 'C'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
                        <p className="text-gray-500 mt-1">Manage your company information and branding.</p>
                    </motion.div>

                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`p-4 rounded-xl mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    {fetching ? (
                        <div className="text-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-500">Loading profile details...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Company Details Card */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                                    <Building2 className="w-5 h-5 text-blue-600" /> Organization Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="col-span-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Company Name</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="company_name"
                                                value={profile.company_name}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                placeholder="e.g. Acme Corp"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Website</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="website"
                                                value={profile.website}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                placeholder="https://example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Registration No.</label>
                                        <input
                                            type="text"
                                            name="registration_no"
                                            value={profile.registration_no}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="Optional"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details Card */}
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                                    <Phone className="w-5 h-5 text-blue-600" /> Contact Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Contact Person</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="contact_person"
                                                value={profile.contact_person}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                placeholder="Full Name"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="phone"
                                                value={profile.phone}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-2 md:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                            <textarea
                                                name="address"
                                                value={profile.address}
                                                onChange={handleChange}
                                                rows={3}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                                                placeholder="Full office address..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5 mr-2" /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};

export default CompanyProfile;
