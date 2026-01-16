import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, Briefcase, Users,
    Building2, LogOut, TrendingUp, Bell
} from 'lucide-react';

const CompanyDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        active_jobs: 0,
        total_applicants: 0,
        applications_today: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/company/dashboard_stats.php');
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard stats', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const statCards = [
        {
            label: 'Active Jobs',
            value: stats.active_jobs,
            icon: Briefcase,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100'
        },
        {
            label: 'Total Applicants',
            value: stats.total_applicants,
            icon: Users,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            border: 'border-purple-100'
        },
        {
            label: 'Applications Today',
            value: stats.applications_today,
            icon: TrendingUp,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100'
        },
    ];

    const actions = [
        {
            title: 'Post a New Job',
            desc: 'Create a new opening to find talent',
            icon: PlusCircle,
            link: '/company/post-job',
            // Improved contrast: distinct blue background with very light text
            className: 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-200 border-none',
            iconColor: 'text-white',
            descColor: 'text-blue-100', // Lighter for better readability on blue
            color: 'blue'
        },
        {
            title: 'Manage Jobs',
            desc: 'View and edit your job listings',
            icon: Briefcase,
            link: '/company/my-jobs',
            className: 'bg-white text-gray-900 border border-gray-200 hover:border-blue-300 hover:shadow-md',
            iconColor: 'text-blue-600',
            descColor: 'text-gray-500'
        },
        {
            title: 'Company Profile',
            desc: 'Update your company branding',
            icon: Building2,
            link: '/company/profile',
            className: 'bg-white text-gray-900 border border-gray-200 hover:border-blue-300 hover:shadow-md',
            iconColor: 'text-blue-600',
            descColor: 'text-gray-500'
        },
    ];

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
                    <Link to="/company/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-md transition-all hover:bg-blue-500">
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
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative rounded-full hover:bg-gray-50">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
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
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'Recruiter'}! 👋</h1>
                        <p className="text-gray-500 mt-1">Here's what's happening with your hiring pipeline today.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {statCards.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group`}
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        {/* Real 'eye-catching' colored stats */}
                                        <h3 className={`text-4xl font-bold ${stat.color}`}>
                                            {loading ? '-' : stat.value}
                                        </h3>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {actions.map((action, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + (index * 0.1) }}
                            >
                                <Link
                                    to={action.link}
                                    className={`relative block p-8 rounded-2xl transition-all duration-300 h-full flex flex-col justify-between overflow-hidden group ${action.className}`}
                                >
                                    <div className="relative z-10">
                                        <div className="mb-6 inline-block p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                                            <action.icon className={`w-8 h-8 ${action.iconColor}`} />
                                        </div>
                                        <h3 className={`text-xl font-bold mb-2 ${action.iconColor.replace('text-', 'text-')}`}>{action.title}</h3>
                                        <p className={`text-sm font-medium leading-relaxed ${action.descColor}`}>
                                            {action.desc}
                                        </p>
                                    </div>

                                    {/* Decorator for colored card */}
                                    {action.color?.includes('blue') && (
                                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                                    )}
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Recent Jobs Placeholder */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-lg font-bold text-gray-900">Recent Job Activity</h2>
                            <Link to="/company/my-jobs" className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                View All <TrendingUp className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Briefcase className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-gray-900 font-medium mb-1">No applications yet</h3>
                            <p className="text-gray-500 text-sm">Post a job to start receiving candidates!</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CompanyDashboard;
