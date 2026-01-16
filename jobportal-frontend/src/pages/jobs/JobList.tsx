import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, IndianRupee, Clock, Building2, Filter, Loader2, ArrowRight, Bookmark, Zap, TrendingUp, Star, Heart } from 'lucide-react';
import api from '../../api/axios';
import ModernNav from '../../components/ModernNav';

interface Job {
    id: number;
    title: string;
    company_name: string;
    location: string;
    salary_min: number;
    salary_max: number;
    job_type: string;
    created_at: string;
}

const JobList = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        location: '',
        job_type: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [savedJobs, setSavedJobs] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.location) params.append('location', filters.location);
            if (filters.job_type) params.append('job_type', filters.job_type);

            const response = await api.get(`/jobs/list.php?${params.toString()}`);
            setJobs(response.data.data);
        } catch (err: any) {
            setError('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchJobs();
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const toggleSaveJob = (jobId: number, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSavedJobs(prev => 
            prev.includes(jobId) 
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Modern Navigation */}
            <ModernNav activeTab="jobs" />

            {/* Main Content */}
            <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
                {/* Header with Floating Elements */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center relative"
                >
                    {/* Floating decorative elements */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute top-0 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20 blur-xl"
                    />
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-0 right-10 w-32 h-32 bg-purple-100 rounded-full opacity-20 blur-xl"
                    />
                    
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-4 border border-blue-100">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-600">{jobs.length}+ Active Opportunities</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 relative">
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Find Your Dream Job
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover exciting opportunities from <span className="font-semibold text-gray-900">top companies</span> and innovative <span className="font-semibold text-gray-900">startups</span> 🚀
                    </p>
                </motion.div>

                {/* Search and Filters */}
                <div className="font-sans">
                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSearch}
                    className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 md:p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full relative group">
                            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by job title, skills, or company..."
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>

                        <div className="w-full md:w-64 relative group">
                            <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="City, state, or remote"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all outline-none text-gray-900 placeholder-gray-400"
                                value={filters.location}
                                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-4 rounded-xl border-2 transition-all ${showFilters ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-lg shadow-blue-100' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Filter className="h-5 w-5" />
                        </button>

                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <Zap className="w-5 h-5" />
                            Search Jobs
                        </button>
                    </div>
                </motion.form>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0, y: -20 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -20 }}
                            className="overflow-hidden mb-8"
                        >
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-200 shadow-lg">
                                <div className="flex flex-wrap gap-4 items-center">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-blue-600" />
                                        Job Type:
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {['All Types', 'Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFilters({ ...filters, job_type: type === 'All Types' ? '' : type })}
                                                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                                                    (filters.job_type === '' && type === 'All Types') || filters.job_type === type
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

                {/* Results Section */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                        <p className="text-gray-500">Loading opportunities...</p>
                    </div>
                ) : (
                    <>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                                    <Briefcase className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {jobs.length} {jobs.length === 1 ? 'Opportunity' : 'Opportunities'} Found
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Perfect matches for your search</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-semibold text-gray-700">Recommended</span>
                                </div>
                            </div>
                        </motion.div>

                        {jobs.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl shadow-lg border-2 border-dashed border-gray-300"
                            >
                                <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search className="w-12 h-12 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No jobs found</h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    We couldn't find any jobs matching your criteria. Try broadening your search or clearing filters.
                                </p>
                                <button
                                    onClick={() => {
                                        setFilters({ search: '', location: '', job_type: '' });
                                        fetchJobs();
                                    }}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {jobs.map((job, idx) => (
                                    <motion.div 
                                        key={job.id} 
                                        variants={item}
                                        whileHover={{ y: -8 }}
                                        className="h-full"
                                    >
                                        <Link to={`/jobs/${job.id}`} className="block h-full">
                                            <div className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 h-full border-2 border-gray-100 hover:border-blue-300 relative overflow-hidden flex flex-col">
                                                {/* Gradient overlay on hover */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 transition-all duration-500 rounded-3xl" />
                                                
                                                {/* New badge for recent jobs */}
                                                {idx < 3 && (
                                                    <div className="absolute top-4 right-4 z-10">
                                                        <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                                            <Zap className="w-3 h-3" />
                                                            NEW
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="relative z-10 flex flex-col h-full">
                                                    {/* Header with logo */}
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                                                            <Building2 className="w-7 h-7 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all line-clamp-2 mb-1">
                                                                {job.title}
                                                            </h3>
                                                            <div className="flex items-center text-gray-600 text-sm font-semibold">
                                                                <span className="truncate">{job.company_name}</span>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Save button */}
                                                        <button
                                                            onClick={(e) => toggleSaveJob(job.id, e)}
                                                            className="p-2 rounded-xl hover:bg-red-50 transition-all group/save"
                                                        >
                                                            <Heart 
                                                                className={`w-5 h-5 transition-all ${
                                                                    savedJobs.includes(job.id) 
                                                                        ? 'fill-red-500 text-red-500' 
                                                                        : 'text-gray-400 group-hover/save:text-red-500'
                                                                }`}
                                                            />
                                                        </button>
                                                    </div>

                                                    {/* Location & Tags */}
                                                    <div className="space-y-3 mb-4 flex-grow">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl group-hover:bg-blue-50 transition-colors">
                                                            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                            <span className="font-medium">{job.location}</span>
                                                        </div>
                                                        
                                                        <div className="flex flex-wrap gap-2">
                                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                {job.job_type}
                                                            </span>
                                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200">
                                                                <IndianRupee className="w-3 h-3 mr-1" />
                                                                ₹{(parseFloat(job.salary_min.toString()) / 100000).toFixed(1)}L - ₹{(parseFloat(job.salary_max.toString()) / 100000).toFixed(1)}L
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Footer */}
                                                    <div className="pt-4 border-t-2 border-gray-100 group-hover:border-blue-100 transition-colors flex justify-between items-center">
                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl text-sm group-hover:shadow-lg group-hover:scale-105 transition-all">
                                                            Apply Now
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default JobList;
