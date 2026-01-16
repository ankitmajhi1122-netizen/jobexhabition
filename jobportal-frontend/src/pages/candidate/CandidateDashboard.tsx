import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Briefcase, FileText, User,
    LogOut, Bell, TrendingUp, Search, Bookmark, Trophy, BarChart3
} from 'lucide-react';
import NotificationBell from '../../components/NotificationBell';



const CandidateDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        applications: 0,
        shortlisted: 0,
        views: 0
    });
    const [recentViewers, setRecentViewers] = useState<any[]>([]);

    useEffect(() => {
        console.log("CandidateDashboard: Component mounted, user:", user);

        const fetchDashboardData = async () => {
            console.log("CandidateDashboard: Fetching dashboard data...");
            try {
                // Parallel fetching
                const [appsRes, viewsRes] = await Promise.all([
                    api.get('/candidate/applications.php'),
                    api.get('/candidate/profile_views.php')
                ]);

                console.log("CandidateDashboard: Applications data:", appsRes.data);
                console.log("CandidateDashboard: Views data:", viewsRes.data);

                // Process Applications
                let appCount = 0;
                let shortCount = 0;
                if (appsRes.data.success) {
                    const apps = appsRes.data.data;
                    appCount = apps.length;
                    shortCount = apps.filter((a: any) => a.status === 'shortlisted').length;
                }

                // Process Views
                let viewCount = 0;
                let viewers = [];
                if (viewsRes.data.status === 'success') {
                    viewCount = viewsRes.data.data.total_unique_views;
                    viewers = viewsRes.data.data.views;
                }

                setStats({ applications: appCount, shortlisted: shortCount, views: viewCount });
                setRecentViewers(viewers);

            } catch (error) {
                console.error("CandidateDashboard: Failed to fetch dashboard data", error);
            }
        };

        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Same Top Navigation as MyApplications for consistency */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/20">
                                <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">JobPortal</span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/candidate/dashboard" className="text-blue-600 font-bold transition-colors">Dashboard</Link>
                            <Link to="/jobs" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Find Jobs</Link>
                            <Link to="/candidate/applications" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">My Applications</Link>
                            <Link to="/candidate/saved-jobs" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Saved Jobs</Link>
                            <Link to="/candidate/profile" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Profile</Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <NotificationBell />
                            <div className="h-9 w-9 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200 shadow-sm cursor-pointer" onClick={() => navigate('/candidate/profile')}>
                                {user?.name?.charAt(0) || 'C'}
                            </div>
                            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 pt-24 px-4 pb-12 w-full">
                <div className="max-w-7xl mx-auto">
                    {/* Welcome */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 text-center md:text-left"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Hello, {user?.name?.split(' ')[0] || 'Candidate'}! 👋</h1>
                        <p className="text-gray-500 text-lg">Ready to find your next career opportunity?</p>
                    </motion.div>

                    {/* Search Hero Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl shadow-blue-900/20 mb-12 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold mb-6">Find the perfect job for your skills</h2>
                            <div className="bg-white p-2 rounded-2xl shadow-lg flex flex-col md:flex-row gap-2">
                                <div className="flex-1 flex items-center px-4 bg-gray-50 rounded-xl">
                                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                                    <input type="text" placeholder="Job title or keyword" className="w-full py-3 bg-transparent outline-none text-gray-800 placeholder-gray-400" />
                                </div>
                                <button onClick={() => navigate('/jobs')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                                    Search
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                                <FileText className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Applications</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.applications}</h3>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
                                <TrendingUp className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Shortlisted</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.shortlisted}</h3>
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                                <User className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-gray-500 font-medium">Profile Views</p>
                                <h3 className="text-3xl font-bold text-gray-900">{stats.views}</h3>
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <Link to="/candidate/saved-jobs" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-yellow-300 hover:shadow-md transition-all group">
                            <Bookmark className="w-10 h-10 text-yellow-500 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-gray-900 text-lg mb-1">Saved Jobs</h3>
                            <p className="text-gray-500 text-sm">View bookmarked opportunities</p>
                        </Link>
                        <Link to="/candidate/achievements" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-300 hover:shadow-md transition-all group">
                            <Trophy className="w-10 h-10 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-gray-900 text-lg mb-1">Achievements</h3>
                            <p className="text-gray-500 text-sm">View badges and points</p>
                        </Link>
                        <Link to="/candidate/analytics" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-md transition-all group">
                            <BarChart3 className="w-10 h-10 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                            <h3 className="font-bold text-gray-900 text-lg mb-1">Analytics</h3>
                            <p className="text-gray-500 text-sm">Track your job search progress</p>
                        </Link>
                    </div>

                    {/* Who Viewed Section (New) */}
                    {recentViewers.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Who Viewed Your Profile</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recentViewers.map((view, i) => (
                                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500">
                                            {view.company_name?.charAt(0) || 'C'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{view.company_name}</h4>
                                            <p className="text-xs text-gray-500">Viewed {new Date(view.viewed_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

export default CandidateDashboard;
