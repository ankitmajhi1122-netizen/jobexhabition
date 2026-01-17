import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Briefcase, FileText, Eye, CheckCircle2, XCircle, Clock,
    LogOut, TrendingUp, Search, Bookmark, Trophy, BarChart3,
    ArrowUpRight, Zap, Target, Star, Award, Activity
} from 'lucide-react';
import NotificationBell from '../../components/NotificationBell';



const CandidateDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        applications: 0,
        shortlisted: 0,
        views: 0,
        saved: 0,
        applied: 0,
        viewed: 0,
        rejected: 0,
        hired: 0,
        responseRate: 0,
        successRate: 0,
        profileCompleteness: 0
    });
    const [recentViewers, setRecentViewers] = useState<any[]>([]);

    useEffect(() => {
        console.log("=== CandidateDashboard: Component Mounted ===");
        console.log("CandidateDashboard: User data:", JSON.stringify(user, null, 2));
        console.log("CandidateDashboard: User ID:", user?.id);
        console.log("CandidateDashboard: User Name:", user?.name);
        console.log("CandidateDashboard: User Role:", user?.role);

        const fetchDashboardData = async () => {
            console.log("CandidateDashboard: Starting to fetch dashboard data...");
            console.log("CandidateDashboard: Timestamp:", new Date().toISOString());
            
            try {
                console.log("CandidateDashboard: Making parallel API calls...");
                
                // Parallel fetching
                const [appsRes, viewsRes, profileRes, savedRes, analyticsRes] = await Promise.all([
                    api.get('/candidate/applications.php'),
                    api.get('/candidate/profile_views.php'),
                    api.get('/candidate/profile.php'),
                    api.get('/candidate/saved_jobs.php'),
                    api.get('/candidate/analytics.php')
                ]);

                console.log("=== CandidateDashboard: All Responses Received ===");

                // Process Applications
                let appCount = 0;
                let shortCount = 0;
                let appliedCount = 0;
                let viewedCount = 0;
                let rejectedCount = 0;
                let hiredCount = 0;
                
                if (appsRes.data.success) {
                    const apps = appsRes.data.data;
                    appCount = apps.length;
                    shortCount = apps.filter((a: any) => a.status === 'shortlisted').length;
                    appliedCount = apps.filter((a: any) => a.status === 'applied').length;
                    viewedCount = apps.filter((a: any) => a.status === 'viewed').length;
                    rejectedCount = apps.filter((a: any) => a.status === 'rejected').length;
                    hiredCount = apps.filter((a: any) => a.status === 'hired').length;
                }

                // Process Views
                let viewCount = 0;
                let viewers = [];
                if (viewsRes.data.status === 'success') {
                    viewCount = viewsRes.data.data.total_unique_views;
                    viewers = viewsRes.data.data.views;
                }

                // Process Profile
                let profileCompleteness = 0;
                if (profileRes.data.success) {
                    profileCompleteness = profileRes.data.data.profile_completeness || 0;
                }

                // Process Saved Jobs
                let savedCount = 0;
                if (savedRes.data.success) {
                    savedCount = savedRes.data.data.length;
                }

                // Process Analytics for trends
                let responseRate = 0;
                let successRate = 0;
                if (analyticsRes.data.success) {
                    responseRate = analyticsRes.data.data.applications.response_rate || 0;
                    successRate = analyticsRes.data.data.applications.success_rate || 0;
                }

                const finalStats = { 
                    applications: appCount, 
                    shortlisted: shortCount, 
                    views: viewCount,
                    saved: savedCount,
                    applied: appliedCount,
                    viewed: viewedCount,
                    rejected: rejectedCount,
                    hired: hiredCount,
                    responseRate,
                    successRate,
                    profileCompleteness
                };
                
                console.log("CandidateDashboard: Final Stats:", finalStats);
                
                setStats(finalStats);
                setRecentViewers(viewers);

            } catch (error: any) {
                console.error("=== CandidateDashboard: ERROR ===");
                console.error("CandidateDashboard: Failed to fetch dashboard data");
                console.error("CandidateDashboard: Error message:", error.message);
                console.error("CandidateDashboard: Error response:", error.response?.data);
                console.error("CandidateDashboard: Error status:", error.response?.status);
                console.error("CandidateDashboard: Full error:", error);
            }
        };

        if (user) {
            console.log("CandidateDashboard: User exists, fetching data...");
            fetchDashboardData();
        } else {
            console.warn("CandidateDashboard: No user found, skipping data fetch");
        }
    }, [user]);

    const handleLogout = () => {
        console.log("CandidateDashboard: Logout button clicked");
        console.log("CandidateDashboard: Calling logout function");
        logout();
        console.log("CandidateDashboard: Navigating to login page");
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

                    {/* Enhanced Stats Grid with Gradients */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Applications */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.2 }}
                            className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-white/80 text-sm font-semibold">Total</span>
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-1">{stats.applications}</h3>
                                <p className="text-blue-100 text-sm font-medium">Applications</p>
                            </div>
                        </motion.div>

                        {/* Shortlisted */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.3 }}
                            className="relative bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-1 text-white">
                                        <ArrowUpRight className="w-4 h-4" />
                                        <span className="text-sm font-bold">+{stats.hired}</span>
                                    </div>
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-1">{stats.shortlisted}</h3>
                                <p className="text-green-100 text-sm font-medium">Shortlisted</p>
                            </div>
                        </motion.div>

                        {/* Profile Views */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.4 }}
                            className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                    <Activity className="w-5 h-5 text-white/80" />
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-1">{stats.views}</h3>
                                <p className="text-purple-100 text-sm font-medium">Profile Views</p>
                            </div>
                        </motion.div>

                        {/* Saved Jobs */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: 0.5 }}
                            className="relative bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Bookmark className="w-6 h-6 text-white" />
                                    </div>
                                    <Star className="w-5 h-5 text-white/80" />
                                </div>
                                <h3 className="text-4xl font-bold text-white mb-1">{stats.saved}</h3>
                                <p className="text-orange-100 text-sm font-medium">Saved Jobs</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Performance Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Success Rate */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                                        <Target className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">Success Rate</span>
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-green-500" />
                            </div>
                            <div className="flex items-end gap-2">
                                <h3 className="text-4xl font-bold text-gray-900">{stats.successRate}%</h3>
                                <span className="text-sm text-gray-500 mb-1">conversion</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.successRate}%` }}
                                    transition={{ duration: 1, delay: 0.8 }}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                                />
                            </div>
                        </motion.div>

                        {/* Response Rate */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl">
                                        <Activity className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">Response Rate</span>
                                </div>
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                            <div className="flex items-end gap-2">
                                <h3 className="text-4xl font-bold text-gray-900">{stats.responseRate}%</h3>
                                <span className="text-sm text-gray-500 mb-1">replies</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.responseRate}%` }}
                                    transition={{ duration: 1, delay: 0.9 }}
                                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                                />
                            </div>
                        </motion.div>

                        {/* Profile Completeness */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                                        <Award className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">Profile Strength</span>
                                </div>
                                <Zap className="w-5 h-5 text-purple-500" />
                            </div>
                            <div className="flex items-end gap-2">
                                <h3 className="text-4xl font-bold text-gray-900">{stats.profileCompleteness}%</h3>
                                <span className="text-sm text-gray-500 mb-1">complete</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.profileCompleteness}%` }}
                                    transition={{ duration: 1, delay: 1 }}
                                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Application Status Breakdown with Mini Graph */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="bg-white p-6 rounded-2xl border-2 border-gray-100 shadow-sm mb-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                                Application Status Breakdown
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {/* Applied */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-xs font-semibold text-gray-600">Applied</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{stats.applied}</p>
                            </div>

                            {/* Viewed */}
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="w-4 h-4 text-blue-500" />
                                    <span className="text-xs font-semibold text-blue-600">Viewed</span>
                                </div>
                                <p className="text-2xl font-bold text-blue-900">{stats.viewed}</p>
                            </div>

                            {/* Shortlisted */}
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span className="text-xs font-semibold text-green-600">Shortlisted</span>
                                </div>
                                <p className="text-2xl font-bold text-green-900">{stats.shortlisted}</p>
                            </div>

                            {/* Rejected */}
                            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-xs font-semibold text-red-600">Rejected</span>
                                </div>
                                <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
                            </div>

                            {/* Hired */}
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <Trophy className="w-4 h-4 text-purple-500" />
                                    <span className="text-xs font-semibold text-purple-600">Hired</span>
                                </div>
                                <p className="text-2xl font-bold text-purple-900">{stats.hired}</p>
                            </div>
                        </div>

                        {/* Mini Bar Chart */}
                        {stats.applications > 0 && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex items-end justify-between gap-2 h-32">
                                    <div className="flex-1 flex flex-col items-center">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(stats.applied / stats.applications) * 100}%` }}
                                            transition={{ duration: 0.8, delay: 1 }}
                                            className="w-full bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg min-h-[20px]"
                                        />
                                        <span className="text-xs text-gray-600 mt-2 font-semibold">{((stats.applied / stats.applications) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(stats.viewed / stats.applications) * 100}%` }}
                                            transition={{ duration: 0.8, delay: 1.1 }}
                                            className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg min-h-[20px]"
                                        />
                                        <span className="text-xs text-blue-600 mt-2 font-semibold">{((stats.viewed / stats.applications) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(stats.shortlisted / stats.applications) * 100}%` }}
                                            transition={{ duration: 0.8, delay: 1.2 }}
                                            className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg min-h-[20px]"
                                        />
                                        <span className="text-xs text-green-600 mt-2 font-semibold">{((stats.shortlisted / stats.applications) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(stats.rejected / stats.applications) * 100}%` }}
                                            transition={{ duration: 0.8, delay: 1.3 }}
                                            className="w-full bg-gradient-to-t from-red-500 to-red-400 rounded-t-lg min-h-[20px]"
                                        />
                                        <span className="text-xs text-red-600 mt-2 font-semibold">{((stats.rejected / stats.applications) * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="flex-1 flex flex-col items-center">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${(stats.hired / stats.applications) * 100}%` }}
                                            transition={{ duration: 0.8, delay: 1.4 }}
                                            className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg min-h-[20px]"
                                        />
                                        <span className="text-xs text-purple-600 mt-2 font-semibold">{((stats.hired / stats.applications) * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

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
