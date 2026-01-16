import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    TrendingUp, FileText, Eye, CheckCircle, XCircle, Clock, Award,
    Bell, LogOut, Loader2, Briefcase, BarChart3, PieChart, Activity
} from 'lucide-react';
import ModernNav from '../../components/ModernNav';

interface AnalyticsData {
    applications: {
        total: number;
        applied: number;
        viewed: number;
        shortlisted: number;
        rejected: number;
        hired: number;
        response_rate: number;
        success_rate: number;
    };
    monthly_trend: Array<{ month: string; count: number }>;
    profile_views: {
        total: number;
        unique_companies: number;
        days_viewed: number;
    };
    top_job_types: Array<{ job_type: string; count: number }>;
    profile_completeness: number;
}

const Analytics = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("=== Analytics: Component Mounted ===");
        console.log("Analytics: User data:", JSON.stringify(user, null, 2));
        console.log("Analytics: User ID:", user?.id);
        console.log("Analytics: User Name:", user?.name);
        console.log("Analytics: Timestamp:", new Date().toISOString());
        console.log("Analytics: Initiating fetch...");
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        console.log("=== Analytics: Fetching Data ===");
        console.log("Analytics: API endpoint: /candidate/analytics.php");
        console.log("Analytics: Request started at:", new Date().toISOString());
        
        try {
            const response = await api.get('/candidate/analytics.php');
            
            console.log("=== Analytics: Response Received ===");
            console.log("Analytics: HTTP Status:", response.status);
            console.log("Analytics: Response headers:", response.headers);
            console.log("Analytics: Full response:", JSON.stringify(response.data, null, 2));
            console.log("Analytics: Success flag (boolean):", response.data.success);
            
            if (response.data.success) {
                const analyticsData = response.data.data;
                console.log("=== Analytics: Processing Data ===");
                console.log("Analytics: Applications stats:", analyticsData.applications);
                console.log("Analytics: Total applications:", analyticsData.applications.total);
                console.log("Analytics: Response rate:", analyticsData.applications.response_rate);
                console.log("Analytics: Success rate:", analyticsData.applications.success_rate);
                console.log("Analytics: Profile views:", analyticsData.profile_views);
                console.log("Analytics: Monthly trend:", analyticsData.monthly_trend);
                console.log("Analytics: Top job types:", analyticsData.top_job_types);
                console.log("Analytics: Profile completeness:", analyticsData.profile_completeness);
                console.log("Analytics: Setting state...");
                setData(analyticsData);
                console.log("Analytics: State updated successfully");
            }
        } catch (error: any) {
            console.error("=== Analytics: ERROR ===");
            console.error('Analytics: Failed to fetch');
            console.error("Analytics: Error message:", error.message);
            console.error("Analytics: Error response:", error.response?.data);
            console.error("Analytics: Error status:", error.response?.status);
            console.error("Analytics: Full error:", error);
        } finally {
            console.log("Analytics: Setting loading to false");
            setLoading(false);
            console.log("Analytics: Fetch completed");
        }
    };

    const handleLogout = () => {
        console.log("Analytics: Logout initiated");
        console.log("Analytics: Current user:", user?.name);
        logout();
        console.log("Analytics: Navigating to login");
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!data) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">No analytics data available</p>
        </div>;
    }

    const statusData = [
        { label: 'Applied', value: data.applications.applied, color: 'bg-blue-500', icon: Clock },
        { label: 'Viewed', value: data.applications.viewed, color: 'bg-purple-500', icon: Eye },
        { label: 'Shortlisted', value: data.applications.shortlisted, color: 'bg-green-500', icon: CheckCircle },
        { label: 'Rejected', value: data.applications.rejected, color: 'bg-red-500', icon: XCircle }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <ModernNav activeTab="dashboard" />

            {/* Main Content */}
            <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    </div>
                    <p className="text-gray-500">Track your job search performance and insights</p>
                </motion.div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                        <FileText className="w-8 h-8 mb-3 opacity-80" />
                        <p className="text-blue-100 text-sm font-medium">Total Applications</p>
                        <p className="text-4xl font-bold mt-1">{data.applications.total}</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                        <TrendingUp className="w-8 h-8 mb-3 opacity-80" />
                        <p className="text-green-100 text-sm font-medium">Response Rate</p>
                        <p className="text-4xl font-bold mt-1">{data.applications.response_rate}%</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                        <Award className="w-8 h-8 mb-3 opacity-80" />
                        <p className="text-purple-100 text-sm font-medium">Success Rate</p>
                        <p className="text-4xl font-bold mt-1">{data.applications.success_rate}%</p>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                        <Eye className="w-8 h-8 mb-3 opacity-80" />
                        <p className="text-orange-100 text-sm font-medium">Profile Views</p>
                        <p className="text-4xl font-bold mt-1">{data.profile_views.total}</p>
                    </motion.div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Application Status Breakdown */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <PieChart className="w-5 h-5 text-blue-600" />
                            Application Status
                        </h3>
                        <div className="space-y-4">
                            {statusData.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <item.icon className="w-4 h-4 text-gray-600" />
                                            <span className="font-medium text-gray-700">{item.label}</span>
                                        </div>
                                        <span className="font-bold text-gray-900">{item.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${data.applications.total > 0 ? (item.value / data.applications.total) * 100 : 0}%` }}
                                            transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                                            className={`h-full ${item.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Profile Views Details */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-600" />
                            Profile Engagement
                        </h3>
                        <div className="space-y-6">
                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                <p className="text-sm text-purple-600 font-medium mb-1">Total Views</p>
                                <p className="text-3xl font-bold text-purple-900">{data.profile_views.total}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <p className="text-sm text-blue-600 font-medium mb-1">Unique Companies</p>
                                    <p className="text-2xl font-bold text-blue-900">{data.profile_views.unique_companies}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                    <p className="text-sm text-green-600 font-medium mb-1">Days Viewed</p>
                                    <p className="text-2xl font-bold text-green-900">{data.profile_views.days_viewed}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Monthly Trend */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Application Trend (Last 6 Months)
                    </h3>
                    <div className="flex items-end justify-between gap-4 h-64">
                        {data.monthly_trend.map((item, idx) => {
                            const maxCount = Math.max(...data.monthly_trend.map(m => m.count), 1);
                            const height = (item.count / maxCount) * 100;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="text-sm font-bold text-gray-900">{item.count}</div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.8, delay: 0.8 + idx * 0.1 }}
                                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg min-h-[20px]"
                                    />
                                    <div className="text-xs text-gray-500 font-medium">{item.month.split('-')[1]}</div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Top Job Types */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        Most Applied Job Types
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {data.top_job_types.map((item, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <p className="text-sm text-gray-600 font-medium mb-1 capitalize">{item.job_type.replace('_', ' ')}</p>
                                <p className="text-2xl font-bold text-gray-900">{item.count} <span className="text-sm font-normal text-gray-500">applications</span></p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default Analytics;
