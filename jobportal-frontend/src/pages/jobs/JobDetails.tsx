import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MapPin, Building2, IndianRupee, Clock, Briefcase, Calendar,
    AlertCircle, ArrowLeft, Share2, Loader2, Send
} from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/jobs/details.php?id=${id}`);
                setJob(response.data.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user?.role !== 'candidate') {
            alert('Only candidates can apply for jobs.');
            return;
        }

        setApplying(true);
        try {
            console.log('Sending application for Job ID:', id);
            const response = await api.post('/jobs/apply.php', { job_id: id });
            console.log('Apply Response:', response.data);
            alert('Application submitted successfully!');
        } catch (error: any) {
            console.error('Apply Error:', error.response || error);
            alert(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
    );

    if (!job) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job posting you are looking for does not exist or has been removed.</p>
            <button
                onClick={() => navigate('/jobs')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
                Browse Jobs
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Banner */}
            <div className="bg-gradient-to-r from-primary-800 to-secondary-900 text-white pt-24 pb-32 px-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl mix-blend-overlay"></div>
                    <div className="absolute top-1/2 -right-24 w-64 h-64 rounded-full bg-primary-400 blur-3xl mix-blend-overlay"></div>
                </div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-primary-100 hover:text-white mb-6 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Jobs
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row justify-between items-start gap-6"
                    >
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{job.title}</h1>
                            <div className="flex items-center text-xl text-primary-100 mb-4">
                                <Building2 className="w-5 h-5 mr-2" />
                                {job.company_name}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
                                    <MapPin className="w-4 h-4 mr-1.5" /> {job.location}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
                                    <Briefcase className="w-4 h-4 mr-1.5" /> {job.job_type}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm">
                                    <Clock className="w-4 h-4 mr-1.5" /> Posted {new Date(job.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button className="p-3 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm border border-white/20 transition">
                                <Share2 className="w-5 h-5" />
                            </button>
                            {/* Primary Action Button (Desktop) */}
                            {isAuthenticated && user?.role === 'candidate' ? (
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="hidden md:flex items-center px-8 py-3 bg-white text-primary-900 font-bold rounded-lg hover:bg-gray-100 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition shadow-xl"
                                >
                                    {applying ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Applying...
                                        </>
                                    ) : (
                                        <>
                                            Apply Now <Send className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </button>
                            ) : !isAuthenticated ? (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="hidden md:flex px-8 py-3 bg-white text-primary-900 font-bold rounded-lg hover:bg-gray-100 transition shadow-xl"
                                >
                                    Login to Apply
                                </button>
                            ) : null}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-8">
                        {/* Key Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-start">
                                <div className="p-2 bg-green-100 rounded-lg mr-4">
                                    <IndianRupee className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Salary Range</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        ₹{parseFloat(job.salary_min).toLocaleString()} - ₹{parseFloat(job.salary_max).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Experience Required</p>
                                    <p className="text-lg font-bold text-gray-900">{job.experience_required}</p>
                                </div>
                            </div>

                            {/* Consultancy Warning Block */}
                            {job.is_consultancy_job === 1 && (
                                <div className="col-span-1 md:col-span-2 mt-2 bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold text-orange-800 text-sm uppercase tracking-wide mb-1">Consultancy Job</h4>
                                        <p className="text-sm text-orange-700">
                                            <strong>Service Charge:</strong> {job.service_charge} <br />
                                            <strong>Terms:</strong> {job.terms_conditions}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                    <div className="w-1 h-8 bg-primary-600 rounded-full mr-3"></div>
                                    Job Description
                                </h2>
                                <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                    {job.description}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Sticky Action Button */}
                        <div className="mt-8 md:hidden">
                            {isAuthenticated && user?.role === 'candidate' ? (
                                <button
                                    onClick={handleApply}
                                    disabled={applying}
                                    className="w-full flex justify-center items-center px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {applying ? 'Applying...' : 'Apply Now'}
                                </button>
                            ) : !isAuthenticated ? (
                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 shadow-lg"
                                >
                                    Login to Apply
                                </button>
                            ) : null}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default JobDetails;
