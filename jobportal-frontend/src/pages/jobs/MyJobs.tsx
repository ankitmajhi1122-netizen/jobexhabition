import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, Briefcase, Users,
    Building2, LogOut, Bell, Search, MapPin, Calendar,
    Edit, Trash2
} from 'lucide-react';

interface Job {
    id: number;
    title: string;
    location: string;
    status: string;
    created_at: string;
    job_type: string;
    salary_min: string;
    salary_max: string;
}

const MyJobs = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState('');
    const [filter, setFilter] = useState('all');

    const fetchMyJobs = async () => {
        try {
            const response = await api.get('/company/my_jobs.php');
            if (response.data.success) {
                setJobs(response.data.data);
            } else {
                // Fallback if data format differs or empty
                setJobs(Array.isArray(response.data) ? response.data : []);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch your jobs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Filter logic
    const filteredJobs = jobs.filter(job => {
        if (filter === 'all') return true;
        return job.status === filter;
    });

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
                    <Link to="/company/my-jobs" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-md transition-all hover:bg-blue-500">
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
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Manage Jobs</h2>
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

                <div className="p-8 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Your Job Postings</h1>
                            <p className="text-gray-500 mt-1">Manage and track your active job listings.</p>
                        </div>
                        <Link to="/company/post-job" className="btn-primary flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                            <PlusCircle className="w-5 h-5" /> Post New Job
                        </Link>
                    </motion.div>

                    {/* Filters and Search - Conceptual UI */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === 'all' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                            >
                                All Jobs
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === 'active' ? 'bg-green-50 text-green-700 border border-green-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                            >
                                Active
                            </button>
                            <button
                                onClick={() => setFilter('closed')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === 'closed' ? 'bg-gray-100 text-gray-700 border border-gray-200' : 'text-gray-600 hover:bg-gray-50 border border-transparent'}`}
                            >
                                Closed
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading your jobs...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredJobs.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
                                    <p className="text-gray-500 mb-6">You haven't posted any jobs matching this filter.</p>
                                    {filter !== 'all' && (
                                        <button onClick={() => setFilter('all')} className="text-blue-600 font-medium hover:underline">
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                filteredJobs.map((job, index) => (
                                    <motion.div
                                        key={job.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col md:flex-row md:items-center justify-between gap-4"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {job.title}
                                                </h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {job.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" /> {job.location}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Briefcase className="w-4 h-4" /> {job.job_type}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" /> Posted {new Date(job.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                                            <Link
                                                to={`/company/applicants?job_id=${job.id}`}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                            >
                                                <Users className="w-4 h-4" /> View Applicants
                                            </Link>
                                            <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors" title="Edit Job">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Job">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyJobs;
