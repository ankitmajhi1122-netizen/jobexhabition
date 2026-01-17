import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, Clock, Eye, CheckCircle2, XCircle, Calendar,
    Building2, MapPin, IndianRupee, Search, LayoutGrid,
    List, TrendingUp, Loader2, AlertCircle, ChevronRight
} from 'lucide-react';
import ModernNav from '../../components/ModernNav';

interface Application {
    application_id: number;
    job_id: number;
    title: string;
    company_name: string;
    location: string;
    salary_min: number;
    salary_max: number;
    status: string;
    applied_at: string;
}

const MyApplicationsNew = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        console.log("MyApplications: Fetching applications");
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/candidate/applications.php');
            if (response.data.success) {
                setApplications(response.data.data || []);
                console.log(`MyApplications: Loaded ${response.data.data?.length || 0} applications`);
            }
        } catch (error) {
            console.error('MyApplications: Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    const statusConfig = {
        applied: { label: 'Applied', color: 'bg-blue-500', icon: Clock, gradient: 'from-blue-500 to-blue-600' },
        viewed: { label: 'Viewed', color: 'bg-purple-500', icon: Eye, gradient: 'from-purple-500 to-purple-600' },
        shortlisted: { label: 'Shortlisted', color: 'bg-green-500', icon: CheckCircle2, gradient: 'from-green-500 to-emerald-600' },
        rejected: { label: 'Rejected', color: 'bg-red-500', icon: XCircle, gradient: 'from-red-500 to-red-600' },
        hired: { label: 'Hired', color: 'bg-yellow-500', icon: TrendingUp, gradient: 'from-yellow-500 to-orange-600' }
    };

    const getStatusApps = (status: string) => 
        applications.filter(app => app.status === status);

    const filteredApplications = applications.filter(app => {
        const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            app.company_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatSalary = (min: number, max: number) => {
        return `₹${(min / 100000).toFixed(1)}L - ₹${(max / 100000).toFixed(1)}L`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <ModernNav activeTab="applications" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                            <Briefcase className="w-8 h-8 text-white" />
                        </div>
                        My Applications
                    </h1>
                    <p className="text-gray-600">Track and manage your job applications</p>
                </motion.div>

                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {Object.entries(statusConfig).map(([status, config], index) => {
                        const count = getStatusApps(status).length;
                        const Icon = config.icon;
                        return (
                            <motion.div
                                key={status}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all cursor-pointer"
                                onClick={() => setFilterStatus(status)}
                            >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config.gradient} flex items-center justify-center mb-3`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-2xl font-bold text-gray-900">{count}</p>
                                <p className="text-sm text-gray-600">{config.label}</p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by job title or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">All Status</option>
                        {Object.entries(statusConfig).map(([status, config]) => (
                            <option key={status} value={status}>{config.label}</option>
                        ))}
                    </select>

                    {/* View Toggle */}
                    <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-200">
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Kanban View */}
                {viewMode === 'kanban' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {Object.entries(statusConfig).map(([status, config]) => {
                            const statusApps = getStatusApps(status);
                            const Icon = config.icon;
                            return (
                                <div key={status} className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`p-2 rounded-lg bg-gradient-to-r ${config.gradient}`}>
                                            <Icon className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{config.label}</h3>
                                            <p className="text-sm text-gray-500">{statusApps.length} jobs</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        <AnimatePresence>
                                            {statusApps.map((app, index) => (
                                                <motion.div
                                                    key={app.application_id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ delay: index * 0.02 }}
                                                    onClick={() => navigate(`/jobs/${app.job_id}`)}
                                                    className="bg-gray-50 rounded-xl p-3 hover:shadow-md transition-all cursor-pointer border border-gray-100 hover:border-blue-300"
                                                >
                                                    <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{app.title}</h4>
                                                    <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                                                        <Building2 className="w-3 h-3" />
                                                        {app.company_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(app.applied_at)}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>

                                        {statusApps.length === 0 && (
                                            <div className="text-center py-8 text-gray-400">
                                                <p className="text-sm">No applications</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                    <div className="space-y-4">
                        {filteredApplications.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No Applications Found</h3>
                                <p className="text-gray-600 mb-6">Start applying to jobs to track them here</p>
                                <button
                                    onClick={() => navigate('/jobs')}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                                >
                                    Browse Jobs
                                </button>
                            </div>
                        ) : (
                            filteredApplications.map((app, index) => {
                                const config = statusConfig[app.status as keyof typeof statusConfig];
                                return (
                                    <motion.div
                                        key={app.application_id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer"
                                        onClick={() => navigate(`/jobs/${app.job_id}`)}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900">{app.title}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${config?.gradient}`}>
                                                        {config?.label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="w-4 h-4" />
                                                        {app.company_name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {app.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <IndianRupee className="w-4 h-4" />
                                                        {formatSalary(app.salary_min, app.salary_max)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        Applied {formatDate(app.applied_at)}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-6 h-6 text-gray-400" />
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyApplicationsNew;
