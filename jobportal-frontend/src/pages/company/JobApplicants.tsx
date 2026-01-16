import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { motion } from 'framer-motion';
import {
    LayoutDashboard, PlusCircle, Briefcase, Users,
    Building2, LogOut, Bell, Mail, Phone, MapPin,
    FileText, CheckCircle2, XCircle, Globe, Linkedin, DollarSign
} from 'lucide-react';

interface Applicant {
    application_id: number;
    candidate_id: number; // Ensure backend sends this
    status: string;
    applied_at: string;
    full_name: string;
    email: string;
    phone: string;
    skills: string;
    experience_years: number;
    resume_url: string;
    city: string;
    education: string;
    current_role: string;
    bio: string;
    portfolio_url: string;
    linkedin_url: string;
    expected_salary: string;
}

const JobApplicants = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const jobId = searchParams.get('job_id');
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (jobId) {
            fetchApplicants();
        }
    }, [jobId]);

    const fetchApplicants = async () => {
        try {
            const response = await api.get(`/company/applicants.php?job_id=${jobId}`);
            if (response.data.success) {
                setApplicants(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch applicants', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId: number, newStatus: string) => {
        if (!confirm(`Are you sure you want to mark this candidate as ${newStatus}?`)) return;

        try {
            const response = await api.post('/company/update_status.php', {
                application_id: applicationId,
                status: newStatus
            });

            if (response.data.success) {
                alert(`Candidate ${newStatus} successfully! Email notification sent.`);
                // Refresh list
                fetchApplicants();
            }
        } catch (error: any) {
            console.error('Failed to update status', error);
            alert(error.response?.data?.message || 'Failed to update status');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!jobId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Job Selected</h2>
                    <p className="text-gray-500 mb-4">Please select a job to view its applicants.</p>
                    <Link to="/company/my-jobs" className="text-blue-600 hover:text-blue-700 font-medium">
                        Go to My Jobs
                    </Link>
                </div>
            </div>
        );
    }

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
                    <Link to="/company/applicants" className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-md transition-all hover:bg-blue-500">
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
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Candidate Review</h2>
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
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
                        <p className="text-gray-500 mt-1">Reviewing candidates for Job ID: #{jobId}</p>
                    </motion.div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Loading candidates...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {applicants.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-bold text-gray-900">No applicants found</h3>
                                    <p className="text-gray-500 mb-6">This job hasn't received any applications yet.</p>
                                </div>
                            ) : (
                                applicants.map((applicant, index) => (
                                    <motion.div
                                        key={applicant.application_id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between gap-6">
                                            {/* Candidate Info */}
                                            <div className="flex gap-4">
                                                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
                                                    {applicant.full_name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-bold text-gray-900">{applicant.full_name}</h3>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100 text-blue-700`}>
                                                            {applicant.status}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-2">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-gray-400" /> {applicant.email}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-gray-400" /> {applicant.phone || 'N/A'}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" /> {applicant.city || 'N/A'}
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Role & Bio */}
                                                {applicant.current_role && (
                                                    <div className="mt-2 text-sm font-semibold text-blue-600">
                                                        {applicant.current_role}
                                                    </div>
                                                )}
                                                {applicant.bio && (
                                                    <p className="mt-2 text-sm text-gray-600 italic line-clamp-2">
                                                        "{applicant.bio}"
                                                    </p>
                                                )}

                                                {/* Links & Salary */}
                                                <div className="flex flex-wrap gap-4 mt-3">
                                                    {applicant.linkedin_url && (
                                                        <a href={applicant.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-blue-700 hover:underline">
                                                            <Linkedin className="w-3 h-3" /> LinkedIn
                                                        </a>
                                                    )}
                                                    {applicant.portfolio_url && (
                                                        <a href={applicant.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-purple-700 hover:underline">
                                                            <Globe className="w-3 h-3" /> Portfolio
                                                        </a>
                                                    )}
                                                    {applicant.expected_salary && (
                                                        <span className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">
                                                            <DollarSign className="w-3 h-3" /> Exp: {applicant.expected_salary}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {applicant.skills?.split(',').map((skill, i) => (
                                                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium border border-gray-200">
                                                            {skill.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Experience & Actions */}
                                        <div className="flex flex-col items-end justify-between min-w-[200px]">
                                            <div className="text-right mb-4">
                                                <p className="text-sm font-semibold text-gray-900 flex items-center gap-2 justify-end">
                                                    <Briefcase className="w-4 h-4 text-blue-600" />
                                                    {applicant.experience_years} Years Experience
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">Applied: {new Date(applicant.applied_at).toLocaleDateString()}</p>
                                            </div>

                                            <div className="flex gap-3 w-full md:w-auto">
                                                {applicant.resume_url && (
                                                    <a
                                                        href={applicant.resume_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={() => {
                                                            // Record view silently
                                                            if (applicant.candidate_id) {
                                                                api.post('/company/record_view.php', { candidate_id: applicant.candidate_id });
                                                            }
                                                        }}
                                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                                                    >
                                                        <FileText className="w-4 h-4" /> Resume
                                                    </a>
                                                )}

                                                {/* Action Buttons */}
                                                <button
                                                    onClick={() => handleStatusUpdate(applicant.application_id, 'shortlisted')}
                                                    className="flex items-center justify-center p-2 text-green-600 bg-green-50 rounded-xl hover:bg-green-100 border border-green-200 transition-colors"
                                                    title="Shortlist"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(applicant.application_id, 'rejected')}
                                                    className="flex items-center justify-center p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 border border-red-200 transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
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
        </div >
    );
};

export default JobApplicants;
