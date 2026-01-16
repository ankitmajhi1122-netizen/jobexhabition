import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import {
    Briefcase, FileText, Eye, TrendingUp, Search, Bell, LogOut,
    ChevronRight, Calendar, MapPin, Building2, Clock, Target,
    Award, BarChart3, Bookmark, Zap, ArrowUpRight, Star, Users,
    CheckCircle2, Loader2, Menu, X
} from 'lucide-react';
import NotificationBell from '../../components/NotificationBell';

const DashboardNew = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        applications: 0,
        shortlisted: 0,
        profileViews: 0,
        savedJobs: 0
    });
    const [recentJobs, setRecentJobs] = useState([]);
    const [profileStrength, setProfileStrength] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [profile, applications, views, savedJobs] = await Promise.all([
                api.get('/candidate/profile.php'),
                api.get('/candidate/applications.php'),
                api.get('/candidate/profile_views.php'),
                api.get('/candidate/saved_jobs.php')
            ]);

            console.log('DashboardNew: Profile data:', profile.data);
            console.log('DashboardNew: Applications data:', applications.data);
            console.log('DashboardNew: Views data:', views.data);
            console.log('DashboardNew: Saved jobs data:', savedJobs.data);

            setStats({
                applications: applications.data.data?.length || 0,
                shortlisted: applications.data.data?.filter((a: any) => a.status === 'shortlisted').length || 0,
                profileViews: views.data.data?.total_unique_views || 0,
                savedJobs: savedJobs.data.data?.length || 0
            });

            setProfileStrength(profile.data.data?.profile_completeness || 0);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return '☀️ Good Morning';
        if (hour < 18) return '🌤️ Good Afternoon';
        return '🌙 Good Evening';
    };

    const quickActions = [
        { icon: Search, label: 'Find Jobs', color: 'from-blue-500 to-blue-600', link: '/jobs' },
        { icon: Bookmark, label: 'Saved Jobs', color: 'from-yellow-500 to-orange-600', link: '/candidate/saved-jobs' },
        { icon: Award, label: 'Achievements', color: 'from-purple-500 to-pink-600', link: '/candidate/achievements' },
        { icon: BarChart3, label: 'Analytics', color: 'from-green-500 to-emerald-600', link: '/candidate/analytics' },
        { icon: FileText, label: 'My Resume', color: 'from-indigo-500 to-purple-600', link: '/candidate/resume' },
        { icon: Target, label: 'Profile', color: 'from-rose-500 to-red-600', link: '/candidate/profile' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Modern Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
                                <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                JobPortal
                            </span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            <Link to="/candidate/dashboard" className="px-4 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg">
                                Dashboard
                            </Link>
                            <Link to="/jobs" className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all">
                                Find Jobs
                            </Link>
                            <Link to="/candidate/applications" className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all">
                                Applications
                            </Link>
                            <Link to="/candidate/profile" className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-all">
                                Profile
                            </Link>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <NotificationBell />
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform"
                                onClick={() => navigate('/candidate/profile')}>
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <button onClick={() => { logout(); navigate('/login'); }} 
                                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                        
                        <div className="relative z-10">
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {getGreeting()}, {user?.name?.split(' ')[0] || 'There'}! 👋
                            </h1>
                            <p className="text-blue-100 text-lg mb-6">Ready to find your dream job?</p>
                            
                            <div className="flex flex-wrap gap-4">
                                <Link to="/jobs" className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 shadow-lg transition-all flex items-center gap-2">
                                    <Search className="w-5 h-5" />
                                    Browse Jobs
                                </Link>
                                <Link to="/candidate/profile" className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 backdrop-blur-xl transition-all flex items-center gap-2 border border-white/20">
                                    <Target className="w-5 h-5" />
                                    Complete Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Profile Strength Widget */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Profile Strength</h3>
                                <p className="text-gray-500 text-sm mb-4">Complete your profile to get more visibility</p>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${profileStrength}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2">{profileStrength}% Complete</p>
                            </div>
                            <div className="ml-6">
                                <div className="relative w-24 h-24">
                                    <svg className="transform -rotate-90 w-24 h-24">
                                        <circle cx="48" cy="48" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
                                        <motion.circle 
                                            cx="48" cy="48" r="40" 
                                            stroke="url(#gradient)" 
                                            strokeWidth="8" 
                                            fill="none"
                                            strokeDasharray={`${2 * Math.PI * 40}`}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - profileStrength / 100) }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            strokeLinecap="round"
                                        />
                                        <defs>
                                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#3B82F6" />
                                                <stop offset="100%" stopColor="#A855F7" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-gray-900">{profileStrength}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                            <FileText className="w-8 h-8 mb-3 opacity-80 group-hover:scale-110 transition-transform" />
                            <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                            <p className="text-4xl font-bold mt-1">{stats.applications}</p>
                            <ArrowUpRight className="w-4 h-4 ml-auto mt-2 opacity-50" />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                            <CheckCircle2 className="w-8 h-8 mb-3 opacity-80 group-hover:scale-110 transition-transform" />
                            <p className="text-green-100 text-sm font-medium">Shortlisted</p>
                            <p className="text-4xl font-bold mt-1">{stats.shortlisted}</p>
                            <ArrowUpRight className="w-4 h-4 ml-auto mt-2 opacity-50" />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                            <Eye className="w-8 h-8 mb-3 opacity-80 group-hover:scale-110 transition-transform" />
                            <p className="text-purple-100 text-sm font-medium">Profile Views</p>
                            <p className="text-4xl font-bold mt-1">{stats.profileViews}</p>
                            <ArrowUpRight className="w-4 h-4 ml-auto mt-2 opacity-50" />
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all cursor-pointer group">
                            <Bookmark className="w-8 h-8 mb-3 opacity-80 group-hover:scale-110 transition-transform" />
                            <p className="text-orange-100 text-sm font-medium">Saved Jobs</p>
                            <p className="text-4xl font-bold mt-1">{stats.savedJobs}</p>
                            <ArrowUpRight className="w-4 h-4 ml-auto mt-2 opacity-50" />
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {quickActions.map((action, index) => (
                            <Link key={index} to={action.link}>
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 + index * 0.05 }}
                                    className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer group border border-gray-100"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                                        <action.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="font-semibold text-gray-900 text-sm">{action.label}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Activity Suggestions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended for You</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-blue-300 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <TrendingUp className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-1">Complete Your Profile</h3>
                                    <p className="text-gray-600 text-sm mb-3">Add your skills and experience to attract more recruiters</p>
                                    <Link to="/candidate/profile" className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                        Update Now <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-purple-300 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-purple-50 rounded-xl">
                                    <Award className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 mb-1">Unlock Achievements</h3>
                                    <p className="text-gray-600 text-sm mb-3">You're close to earning your next badge!</p>
                                    <Link to="/candidate/achievements" className="text-purple-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                                        View Progress <ChevronRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default DashboardNew;
