import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, IndianRupee, Clock, Building2, Filter, Loader2, ArrowRight } from 'lucide-react';
import api from '../../api/axios';

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-700 text-white py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold mb-4"
                    >
                        Find Your Dream Job
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-primary-100 max-w-2xl mx-auto"
                    >
                        Explore thousands of job opportunities from top companies and startups.
                    </motion.p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 font-sans">
                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleSearch}
                    className="bg-white rounded-xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-4 items-center"
                >
                    <div className="flex-1 w-full relative">
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Job title, keywords, or company..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <div className="w-full md:w-1/4 relative">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Location"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-600' : 'text-gray-500'}`}
                    >
                        <Filter className="h-5 w-5" />
                    </button>

                    <button
                        type="submit"
                        className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-primary-500/30 flex items-center justify-center gap-2"
                    >
                        Search Jobs
                    </button>
                </motion.form>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-white mt-2 p-4 rounded-xl shadow-md border border-gray-100 flex gap-4 items-center">
                                <label className="text-sm font-medium text-gray-700">Job Type:</label>
                                <select
                                    className="p-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                                    value={filters.job_type}
                                    onChange={(e) => setFilters({ ...filters, job_type: e.target.value })}
                                >
                                    <option value="">All Types</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-12">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
                        <span className="font-bold">Error:</span> {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                        <p className="text-gray-500">Loading opportunities...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">
                                {jobs.length > 0 ? `${jobs.length} Jobs Found` : 'No Jobs Found'}
                            </h2>
                        </div>

                        {jobs.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs matched your search</h3>
                                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                                <button
                                    onClick={() => {
                                        setFilters({ search: '', location: '', job_type: '' });
                                        // Trigger fetch in useEffect when filters change, but here direct call might be needed if not dependent strictly
                                        // Actually easier to just reload page or manually call fetch, but simplest is clear state then user clicks search, 
                                        // or we can auto-trigger with a useEffect on filters (debounced). 
                                        // For now, let user clear manually or re-search.
                                    }}
                                    className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        ) : (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {jobs.map(job => (
                                    <motion.div key={job.id} variants={item}>
                                        <Link to={`/jobs/${job.id}`} className="block h-full">
                                            <div className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 h-full border border-gray-100 hover:border-primary-100 relative overflow-hidden flex flex-col">

                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex items-center text-gray-500 mt-1 text-sm font-medium">
                                                            <Building2 className="w-4 h-4 mr-1.5" />
                                                            {job.company_name}
                                                        </div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex-shrink-0 flex items-center justify-center text-gray-500 group-hover:text-primary-600 group-hover:bg-primary-50 transition-colors">
                                                        <Briefcase className="w-5 h-5" />
                                                    </div>
                                                </div>

                                                <div className="space-y-3 mb-6 flex-grow">
                                                    <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                                        <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                                                        {job.location}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            {job.job_type}
                                                        </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <IndianRupee className="w-3 h-3 mr-1" />
                                                            {parseFloat(job.salary_min.toString()).toLocaleString()} - {parseFloat(job.salary_max.toString()).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                                                    <span className="text-gray-400">
                                                        Posted {new Date(job.created_at).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-primary-600 font-semibold flex items-center group-hover:translate-x-1 transition-transform">
                                                        View Details <ArrowRight className="w-4 h-4 ml-1" />
                                                    </span>
                                                </div>

                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default JobList;
