import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, Briefcase, Users,
    Building2, LogOut, Bell, CheckCircle2, AlertCircle,
    MapPin, Wallet, Calendar, FileText, Globe, Loader2
} from 'lucide-react';

const PostJob = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Initial state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        job_type: 'permanent',
        location: '',
        salary_min: '',
        salary_max: '',
        experience_required: '',
        // Consultancy only
        service_charge: '',
        terms_conditions: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await api.post('/jobs/create.php', formData);
            setMessage({ type: 'success', text: 'Job Posted Successfully! Redirecting...' });

            setTimeout(() => {
                navigate('/company/dashboard');
            }, 2000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to post job' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar Navigation (Consistent with Dashboard) */}
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
                    <Link to="/company/post-job" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-md transition-all hover:bg-blue-500">
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
                    <Link to="/company/profile" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
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
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Post a Job</h2>
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

                <div className="p-8 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-900">Create New Opportunity</h1>
                        <p className="text-gray-500 mt-1">Fill in the details to post a new job opening for candidates.</p>
                    </motion.div>

                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                        >
                            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Job Details Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                                <Briefcase className="w-5 h-5 text-blue-600" /> Job Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">Job Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        required
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="e.g. Senior React Developer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Category</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="category"
                                            required
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="e.g. IT, Sales"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="e.g. Remote, New York"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Job Type</label>
                                    <div className="relative">
                                        <select
                                            name="job_type"
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none bg-white"
                                        >
                                            <option value="permanent">Permanent</option>
                                            <option value="temporary">Temporary</option>
                                            <option value="contract">Contract</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Experience</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            name="experience_required"
                                            required
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="e.g. 3-5 Years"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Min Salary (Annual)</label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            name="salary_min"
                                            required
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Max Salary (Annual)</label>
                                    <div className="relative">
                                        <Wallet className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            name="salary_max"
                                            required
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                                <FileText className="w-5 h-5 text-blue-600" /> Description & Requirements
                            </h2>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Job Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={8}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-y"
                                    placeholder="Enter detailed job description, responsibilities, and requirements..."
                                ></textarea>
                            </div>
                        </div>

                        {user?.role === 'consultancy' && (
                            <div className="bg-amber-50 p-8 rounded-2xl border border-amber-200">
                                <h3 className="font-bold text-amber-900 mb-6 flex items-center gap-2">
                                    <Globe className="w-5 h-5" /> Consultancy Terms
                                </h3>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-amber-900">Service Charge</label>
                                        <input
                                            type="text"
                                            name="service_charge"
                                            required
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-white"
                                            placeholder="e.g. 15 Days Salary"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-amber-900">Terms & Conditions</label>
                                        <textarea
                                            name="terms_conditions"
                                            required
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none bg-white"
                                            placeholder="Enter terms..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 text-gray-600 hover:bg-gray-100 font-semibold rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Posting...
                                    </>
                                ) : (
                                    <>
                                        Post Job <PlusCircle className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default PostJob;
