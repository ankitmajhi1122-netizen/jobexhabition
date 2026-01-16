import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText,
    Bell, MapPin, Calendar, CheckCircle2,
    Clock, XCircle, ChevronRight, Building2, Briefcase, LogOut
} from 'lucide-react';

interface Application {
    application_id: number;
    job_id: number;
    title: string;
    // ... (keeping other lines implicit or I will replace the whole block if needed, but replace_file_content works on chunks)
    // Actually I need to update interface AND the mapping.
    // Let's do interface first.
    // Wait, I can do it in one go if they are close? No, interface is at top, map is at bottom.
    // I will use two tool calls or one MultiReplace?
    // MultiReplace is better.

    company_name: string;
    location: string;
    status: string;
    applied_at: string;
    logo_url?: string;
}

const MyApplications = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("=== MyApplications: Component Mounted ===");
        console.log("MyApplications: User data:", JSON.stringify(user, null, 2));
        console.log("MyApplications: User ID:", user?.id);
        console.log("MyApplications: User Name:", user?.name);
        console.log("MyApplications: User Email:", user?.email);
        console.log("MyApplications: Timestamp:", new Date().toISOString());
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        console.log("=== MyApplications: Fetching Applications ===");
        console.log("MyApplications: API endpoint: /candidate/applications.php");
        console.log("MyApplications: Request started at:", new Date().toISOString());
        
        try {
            const response = await api.get('/candidate/applications.php');
            
            console.log("=== MyApplications: Response Received ===");
            console.log("MyApplications: HTTP Status:", response.status);
            console.log("MyApplications: Response headers:", response.headers);
            console.log("MyApplications: Full response data:", JSON.stringify(response.data, null, 2));
            console.log("MyApplications: Success flag:", response.data.success);
            console.log("MyApplications: Message:", response.data.message);
            
            if (response.data.success) {
                const apps = response.data.data;
                console.log("MyApplications: Applications count:", apps.length);
                console.log("MyApplications: Applications array:", apps);
                
                // Log each application in detail
                apps.forEach((app: Application, index: number) => {
                    console.log(`MyApplications: Application ${index + 1}:`, {
                        id: app.application_id,
                        job_id: app.job_id,
                        title: app.title,
                        company: app.company_name,
                        location: app.location,
                        status: app.status,
                        applied_at: app.applied_at,
                        logo_url: app.logo_url
                    });
                });
                
                console.log("MyApplications: Setting applications state...");
                setApplications(apps);
                console.log("MyApplications: State updated successfully");
            } else {
                console.warn("MyApplications: Response success=false");
                console.warn("MyApplications: Error message:", response.data.message);
            }
        } catch (error: any) {
            console.error("=== MyApplications: ERROR ===");
            console.error("MyApplications: Failed to fetch applications");
            console.error("MyApplications: Error message:", error.message);
            console.error("MyApplications: Error response:", error.response?.data);
            console.error("MyApplications: Error status:", error.response?.status);
            console.error("MyApplications: Error headers:", error.response?.headers);
            console.error("MyApplications: Full error object:", error);
            console.error("MyApplications: Stack trace:", error.stack);
        } finally {
            console.log("MyApplications: Setting loading to false");
            setLoading(false);
            console.log("MyApplications: Fetch process completed");
        }
    };

    const handleLogout = () => {
        console.log("MyApplications: Logout initiated");
        console.log("MyApplications: Current user:", user?.name);
        logout();
        console.log("MyApplications: Navigating to login");
        navigate('/login');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'shortlisted': return 'bg-green-100 text-green-700 border-green-200';
            case 'hired': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
            case 'viewed': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'shortlisted': return <CheckCircle2 className="w-4 h-4" />;
            case 'hired': return <Briefcase className="w-4 h-4" />;
            case 'rejected': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Navigation Bar (Top - specific for Candidate based on Profile page) */}
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
                            <Link to="/candidate/dashboard" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                            <Link to="/jobs" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Find Jobs</Link>
                            <Link to="/candidate/applications" className="text-blue-600 font-bold transition-colors">My Applications</Link>
                            <Link to="/candidate/profile" className="text-gray-500 hover:text-blue-600 font-medium transition-colors">Profile</Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative rounded-full hover:bg-gray-50">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="h-9 w-9 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200 shadow-sm cursor-pointer" onClick={() => navigate('/candidate/profile')}>
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 pt-24 px-4 pb-12 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
                        <p className="text-gray-500 mt-1">Track the status of your job applications.</p>
                    </motion.div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading your applications...</p>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 border-dashed">
                            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-10 h-10 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">No Applications Yet</h2>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">You haven't applied to any jobs yet. Start browsing thousands of jobs and find your dream career today.</p>
                            <Link to="/jobs" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                                <Briefcase className="w-5 h-5 mr-2" /> Browse Jobs
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app, index) => (
                                <motion.div
                                    key={app.application_id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => navigate(`/jobs/${app.job_id}`)}
                                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className="h-14 w-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                                {app.logo_url ? (
                                                    <img src={app.logo_url} alt={app.company_name} className="h-10 w-10 object-contain" />
                                                ) : (
                                                    <Building2 className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                    {app.title}
                                                </h3>
                                                <p className="text-gray-600 font-medium">{app.company_name || 'Incognito Recruiter'}</p>
                                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                                                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {app.location}</span>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                                            <div className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 ${getStatusColor(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                <span className="uppercase tracking-wide text-xs">{app.status}</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-400" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default MyApplications;
