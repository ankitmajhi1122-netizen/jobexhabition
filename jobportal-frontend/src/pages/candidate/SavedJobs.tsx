import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bookmark, MapPin, Building2, IndianRupee, Clock, Briefcase,
    Trash2, Loader2, BookmarkCheck,
    FileText, ChevronRight, Calendar, AlertCircle
} from 'lucide-react';
import ModernNav from '../../components/ModernNav';

interface SavedJob {
    saved_job_id: number;
    job_id: number;
    notes: string;
    saved_at: string;
    title: string;
    location: string;
    job_type: string;
    salary_min: number;
    salary_max: number;
    company_name: string;
    logo_url?: string;
    created_at: string;
}

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingJobId, setRemovingJobId] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log("=== SavedJobs: Component Mounted ===");
        console.log("SavedJobs: Timestamp:", new Date().toISOString());
        console.log("SavedJobs: Initiating saved jobs fetch...");
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        console.log("=== SavedJobs: Fetching Saved Jobs ===");
        console.log("SavedJobs: API endpoint: /candidate/saved_jobs.php");
        console.log("SavedJobs: Request started at:", new Date().toISOString());
        
        try {
            const response = await api.get('/candidate/saved_jobs.php');
            
            console.log("=== SavedJobs: Response Received ===");
            console.log("SavedJobs: HTTP Status:", response.status);
            console.log("SavedJobs: Response headers:", response.headers);
            console.log("SavedJobs: Full response data:", JSON.stringify(response.data, null, 2));
            console.log("SavedJobs: Success flag (boolean):", response.data.success);
            console.log("SavedJobs: Message:", response.data.message);
            
            if (response.data.success) {
                const jobs = response.data.data;
                console.log("SavedJobs: Saved jobs count:", jobs.length);
                console.log("SavedJobs: Saved jobs array:", jobs);
                
                // Log each saved job in detail
                jobs.forEach((job: SavedJob, index: number) => {
                    console.log(`SavedJobs: Job ${index + 1}:`, {
                        saved_job_id: job.saved_job_id,
                        job_id: job.job_id,
                        title: job.title,
                        company: job.company_name,
                        location: job.location,
                        job_type: job.job_type,
                        salary_range: `${job.salary_min} - ${job.salary_max}`,
                        notes: job.notes,
                        saved_at: job.saved_at
                    });
                });
                
                console.log("SavedJobs: Setting saved jobs state...");
                setSavedJobs(jobs);
                console.log("SavedJobs: State updated successfully");
            } else {
                console.warn("SavedJobs: Response status not success");
                console.warn("SavedJobs: Error message:", response.data.message);
            }
        } catch (error: any) {
            console.error("=== SavedJobs: ERROR ===");
            console.error("SavedJobs: Failed to fetch saved jobs");
            console.error("SavedJobs: Error message:", error.message);
            console.error("SavedJobs: Error response:", error.response?.data);
            console.error("SavedJobs: Error status:", error.response?.status);
            console.error("SavedJobs: Error headers:", error.response?.headers);
            console.error("SavedJobs: Full error object:", error);
            setMessage('Failed to load saved jobs');
        } finally {
            console.log("SavedJobs: Setting loading to false");
            setLoading(false);
            console.log("SavedJobs: Fetch process completed");
        }
    };

    const handleRemove = async (jobId: number) => {
        console.log(`SavedJobs: Remove button clicked for job ID: ${jobId}`);
        
        if (!confirm('Remove this job from saved?')) {
            console.log("SavedJobs: User cancelled removal");
            return;
        }

        console.log(`SavedJobs: User confirmed removal of job ${jobId}`);
        console.log("SavedJobs: Setting removing state...");
        setRemovingJobId(jobId);

        try {
            console.log("SavedJobs: Sending DELETE request...");
            console.log("SavedJobs: Endpoint: /candidate/saved_jobs.php");
            console.log("SavedJobs: Payload:", { job_id: jobId });
            
            const response = await api.delete('/candidate/saved_jobs.php', {
                data: { job_id: jobId }
            });

            console.log("SavedJobs: Delete response:", response.data);
            console.log(`SavedJobs: Job ${jobId} removed successfully from backend`);
            console.log("SavedJobs: Updating local state...");
            
            const previousCount = savedJobs.length;
            setSavedJobs(prev => prev.filter(job => job.job_id !== jobId));
            
            console.log(`SavedJobs: Saved jobs count: ${previousCount} -> ${previousCount - 1}`);
            setMessage('Job removed from saved');
            console.log("SavedJobs: Success message set, will clear in 3 seconds");
            
            setTimeout(() => {
                console.log("SavedJobs: Clearing success message");
                setMessage('');
            }, 3000);
        } catch (error: any) {
            console.error("=== SavedJobs: Remove Error ===");
            console.error('SavedJobs: Failed to remove job');
            console.error("SavedJobs: Error message:", error.message);
            console.error("SavedJobs: Error response:", error.response?.data);
            console.error("SavedJobs: Full error:", error);
            setMessage('Failed to remove job');
        } finally {
            console.log("SavedJobs: Clearing removing state");
            setRemovingJobId(null);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <ModernNav activeTab="saved" />

            {/* Main Content */}
            <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-yellow-100 rounded-xl">
                            <BookmarkCheck className="w-8 h-8 text-yellow-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
                            <p className="text-gray-500 mt-1">Your bookmarked opportunities</p>
                        </div>
                    </div>
                    
                    {savedJobs.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600" />
                            <p className="text-sm text-blue-800">
                                <strong>{savedJobs.length}</strong> {savedJobs.length === 1 ? 'job' : 'jobs'} saved for later review
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Message */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mb-6 rounded-xl p-4 flex items-center gap-3 ${
                                message.includes('removed') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                        >
                            <AlertCircle className="w-5 h-5" />
                            <p className="font-semibold">{message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Saved Jobs List */}
                {savedJobs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm"
                    >
                        <div className="bg-yellow-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bookmark className="w-12 h-12 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Saved Jobs Yet</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Start saving jobs you're interested in for quick access later. Click the bookmark icon on any job listing.
                        </p>
                        <Link 
                            to="/jobs" 
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                        >
                            <Briefcase className="w-5 h-5 mr-2" />
                            Browse Jobs
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {savedJobs.map((job, index) => (
                            <motion.div
                                key={job.saved_job_id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all overflow-hidden group"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Company Logo */}
                                        <div className="shrink-0">
                                            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                                                {job.logo_url ? (
                                                    <img src={job.logo_url} alt={job.company_name} className="w-12 h-12 object-contain" />
                                                ) : (
                                                    <Building2 className="w-8 h-8 text-gray-400" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Job Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-gray-600 font-medium">{job.company_name}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={() => handleRemove(job.job_id)}
                                                        disabled={removingJobId === job.job_id}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Remove from saved"
                                                    >
                                                        {removingJobId === job.job_id ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-5 h-5" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Job Info Tags */}
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                                                    <MapPin className="w-4 h-4" />
                                                    {job.location}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                                    <Clock className="w-4 h-4" />
                                                    {job.job_type}
                                                </span>
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                                                    <IndianRupee className="w-4 h-4" />
                                                    ₹{(job.salary_min / 100000).toFixed(1)}L - ₹{(job.salary_max / 100000).toFixed(1)}L
                                                </span>
                                            </div>

                                            {/* Notes */}
                                            {job.notes && (
                                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                                                    <p className="text-sm text-yellow-800">
                                                        <strong>Notes:</strong> {job.notes}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Footer */}
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        Saved {new Date(job.saved_at).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <Link
                                                    to={`/jobs/${job.job_id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                                                >
                                                    View Details
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default SavedJobs;
