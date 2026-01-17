import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationBell from '../../components/NotificationBell';
import SkillsManager from '../../components/SkillsManager';
import WorkExperienceManager from '../../components/WorkExperienceManager';
import EducationManager from '../../components/EducationManager';
import {
    User, Phone, MapPin, Briefcase,
    Code, Award, Save, Loader2, CheckCircle2, AlertCircle,
    LayoutDashboard, LogOut, FileText, Upload,
    Sparkles, Target, Zap, Link as LinkIcon, DollarSign, Camera
} from 'lucide-react';

const CandidateProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        phone: '',
        skills: '',
        experience_years: 0,
        resume_url: '',
        city: '',
        education: '',
        current_role: '',
        bio: '',
        portfolio_url: '',
        linkedin_url: '',
        expected_salary: '',
        photo_url: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        console.log("CandidateProfile: Fetching profile data...");
        try {
            const response = await api.get('/candidate/profile.php');
            console.log("CandidateProfile: Fetched data:", response.data);
            // Ensure experience_years is a number, default to 0 if null/undefined
            const fetchedProfile = {
                ...response.data.data,
                experience_years: response.data.data.experience_years ? parseInt(response.data.data.experience_years) : 0
            };
            setProfile(fetchedProfile);
        } catch (error) {
            console.error('CandidateProfile: Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleResumeUpload = async () => {
        if (!resumeFile) return;
        setUploadingResume(true);
        setMessage('');
        console.log("CandidateProfile: Uploading resume...", resumeFile.name);

        const formData = new FormData();
        formData.append('resume', resumeFile);

        try {
            const res = await api.post('/candidate/upload-resume.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.status === 'success') {
                console.log("CandidateProfile: Resume uploaded successfully", res.data);
                setMessage('Resume uploaded successfully!');
                setProfile(prev => ({ ...prev, resume_url: res.data.data.url }));
                setResumeFile(null);
            }
        } catch (error) {
            console.error("CandidateProfile: Resume upload failed", error);
            setMessage('Failed to upload resume.');
        } finally {
            setUploadingResume(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhotoFile(e.target.files[0]);
        }
    };

    const handlePhotoUpload = async () => {
        if (!photoFile) return;
        setUploadingPhoto(true);
        setMessage('');
        console.log("CandidateProfile: Uploading photo...", photoFile.name);

        const formData = new FormData();
        formData.append('photo', photoFile);

        try {
            const res = await api.post('/candidate/photo_upload.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data.status === 'success') {
                console.log("CandidateProfile: Photo uploaded successfully", res.data);
                setMessage('Photo uploaded successfully!');
                setProfile(prev => ({ ...prev, photo_url: res.data.data.url }));
                setPhotoFile(null);
            }
        } catch (error) {
            console.error("CandidateProfile: Photo upload failed", error);
            setMessage('Failed to upload photo.');
        } finally {
            setUploadingPhoto(false);
        }
    };

    const calculateStrength = () => {
        let score = 0;
        if (profile.full_name) score += 10;
        if (profile.current_role) score += 10;
        if (profile.email) score += 5;
        if (profile.phone) score += 5;
        if (profile.city) score += 5;
        if (profile.bio) score += 10;
        if (profile.skills) score += 10;
        if (profile.experience_years > 0) score += 5;
        if (profile.education) score += 10;
        if (profile.resume_url) score += 10;
        if (profile.linkedin_url || profile.portfolio_url) score += 10;
        if (profile.expected_salary) score += 10;
        return score;
    };

    const getStrengthSuggestion = () => {
        if (!profile.full_name) return "Add your full name";
        if (!profile.current_role) return "Add your current role";
        if (!profile.bio) return "Add a short bio";
        if (!profile.phone) return "Add your phone number";
        if (!profile.city) return "Add your city";
        if (!profile.resume_url) return "Upload a resume (Crucial!)";
        if (!profile.skills) return "List your top skills";
        if (!profile.education) return "Add education details";
        if (!profile.linkedin_url) return "Link your professional profile";
        if (!profile.expected_salary) return "Set expected salary";
        return "Complete your profile!";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        console.log("CandidateProfile: Saving profile updates...", profile);
        try {
            await api.post('/candidate/profile.php', profile);
            console.log("CandidateProfile: Update success");
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("CandidateProfile: Update failed", error);
            setMessage('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
    );

    const strength = calculateStrength();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Navigation Bar */}
            <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/candidate/dashboard" className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all">
                                <LayoutDashboard className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                JobPortal
                            </span>
                        </Link>

                        <div className="flex items-center gap-6">
                            <NotificationBell />
                            <span className="text-sm font-semibold text-gray-500 hidden md:inline-flex items-center gap-2 bg-gray-100/50 px-3 py-1 rounded-full border border-gray-200/50">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {user?.name || 'Candidate'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="group inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                {/* Hero Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 shadow-2xl shadow-blue-900/20 mb-12 p-10 md:p-14 text-white"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium text-blue-100 mb-4">
                                <Sparkles className="w-4 h-4 text-yellow-300" />
                                <span>Boost your visibility by 50%</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent mb-4">
                                My Profile
                            </h1>
                            <p className="text-blue-200 text-lg max-w-2xl leading-relaxed">
                                Complete your profile to unlock premium job opportunities. Recruiters are 3x more likely to contact complete profiles.
                            </p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-full md:w-auto min-w-[300px]">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-blue-100 font-medium">Profile Strength</span>
                                <span className={"text-3xl font-bold " + (strength === 100 ? 'text-green-400' : 'text-blue-300')}>
                                    {strength}%
                                </span>
                            </div>
                            <div className="w-full bg-black/20 rounded-full h-3 mb-3 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: strength + "%" }}
                                    transition={{ duration: 1.5, type: "spring" }}
                                    className={"h-full rounded-full " + (strength === 100 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-indigo-500')}
                                />
                            </div>
                            <p className="text-xs text-blue-200 flex items-center gap-2">
                                {strength < 100 ? (
                                    <>
                                        <Zap className="w-3.5 h-3.5 text-yellow-300" />
                                        <span>Next Step: <strong>{getStrengthSuggestion()}</strong></span>
                                    </>
                                ) : (
                                    <>
                                        <Target className="w-3.5 h-3.5 text-green-400" />
                                        <span>You're an All-Star! 🌟</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Sidebar (Sticky) */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Profile Photo Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-[100px] -mr-8 -mt-8 z-0"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                        <Camera className="w-6 h-6" />
                                    </div>
                                    Profile Photo
                                </h3>

                                <div className="space-y-6">
                                    <div className="flex justify-center mb-6">
                                        {profile.photo_url ? (
                                            <div className="relative group">
                                                <img 
                                                    src={profile.photo_url} 
                                                    alt="Profile" 
                                                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-100 shadow-lg"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <Camera className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-purple-50 border-4 border-purple-100 shadow-lg flex items-center justify-center">
                                                <User className="w-16 h-16 text-purple-300" />
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block w-full cursor-pointer group">
                                            <div className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-purple-200 rounded-2xl bg-purple-50/30 hover:bg-purple-50/80 transition-all duration-300 group-hover:border-purple-400">
                                                {uploadingPhoto ? (
                                                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Camera className="w-8 h-8 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                                        <p className="text-sm font-semibold text-purple-600">
                                                            {photoFile ? photoFile.name : "Upload Photo"}
                                                        </p>
                                                        <p className="text-xs text-purple-400 mt-1">JPG, PNG max 2MB</p>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={handlePhotoChange}
                                                />
                                            </div>
                                        </label>

                                        {photoFile && (
                                            <motion.button
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                onClick={handlePhotoUpload}
                                                disabled={uploadingPhoto}
                                                className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {uploadingPhoto ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" /> Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload className="w-5 h-5" /> Upload Photo
                                                    </>
                                                )}
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Resume Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -mr-8 -mt-8 z-0"></div>
                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    Resume
                                </h3>

                                <div className="space-y-6">
                                    {profile.resume_url ? (
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-indigo-200 transition-colors">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm font-bold border border-gray-100">
                                                    PDF
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-900 truncate">My Resume</p>
                                                    <p className="text-xs text-gray-400">Uploaded</p>
                                                </div>
                                            </div>
                                            <a
                                                href={profile.resume_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full py-3 text-center bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-sm"
                                            >
                                                View Document
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 text-sm mb-4">No resume uploaded yet</p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block w-full cursor-pointer group">
                                            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/30 hover:bg-indigo-50/80 transition-all duration-300 group-hover:border-indigo-400">
                                                {uploadingResume ? (
                                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                                                        <p className="text-sm font-semibold text-indigo-600">
                                                            {resumeFile ? resumeFile.name : "Upload New Resume"}
                                                        </p>
                                                        <p className="text-xs text-indigo-400 mt-1">{resumeFile ? "Tap to change" : "PDF, DOCX max 5MB"}</p>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleResumeChange}
                                                />
                                            </div>
                                        </label>

                                        {resumeFile && !uploadingResume && (
                                            <motion.button
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                onClick={handleResumeUpload}
                                                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
                                            >
                                                Confirm Upload
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Tips */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-yellow-50 rounded-3xl p-8 border border-yellow-100"
                        >
                            <h4 className="font-bold text-yellow-800 flex items-center gap-2 mb-4">
                                <Sparkles className="w-5 h-5" /> Pro Tips
                            </h4>
                            <ul className="space-y-3">
                                {[
                                    "Use a professional photo",
                                    "Quantify your achievements",
                                    "Keep skills relevant to job"
                                ].map((tip, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-yellow-700">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Right Content (Forms) */}
                    <div className="lg:col-span-8 space-y-8">

                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className={
                                        message.includes('success') 
                                            ? 'rounded-2xl p-4 flex items-center gap-4 border bg-green-50 text-green-700 border-green-200' 
                                            : 'rounded-2xl p-4 flex items-center gap-4 border bg-red-50 text-red-700 border-red-200'
                                    }
                                >
                                    <div className={message.includes('success') ? 'p-2 rounded-full bg-green-100' : 'p-2 rounded-full bg-red-100'}>
                                        {message.includes('success') ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    </div>
                                    <p className="font-semibold">{message}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Personal Info Group */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3 border-b border-gray-100 pb-4">
                                    <User className="w-6 h-6 text-blue-500" />
                                    Personal Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 block pl-1">Full Name</label>
                                        <div className="relative group">
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={profile.full_name}
                                                onChange={handleChange}
                                                className="w-full pl-5 pr-4 py-3.5 bg-gray-50 border-2 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 rounded-2xl transition-all outline-none font-medium"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 block pl-1">Email (Locked)</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full px-5 py-3.5 bg-white border-2 border-gray-100 text-gray-400 rounded-2xl font-medium cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 block pl-1">Phone</label>
                                        <div className="relative group">
                                            <Phone className="absolute right-4 top-3.5 text-gray-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                name="phone"
                                                value={profile.phone}
                                                onChange={handleChange}
                                                className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 rounded-2xl transition-all outline-none font-medium text-gray-800"
                                                placeholder="+1 234 567 890"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 block pl-1">Location</label>
                                        <div className="relative group">
                                            <MapPin className="absolute right-4 top-3.5 text-gray-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                name="city"
                                                value={profile.city}
                                                onChange={handleChange}
                                                className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 rounded-2xl transition-all outline-none font-medium text-gray-800"
                                                placeholder="New York, USA"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 block pl-1">Professional Headline / Current Role</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute right-4 top-3.5 text-gray-300 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                name="current_role"
                                                value={profile.current_role}
                                                onChange={handleChange}
                                                className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-transparent hover:bg-gray-100 focus:bg-white focus:border-blue-500 rounded-2xl transition-all outline-none font-medium text-gray-800"
                                                placeholder="e.g. Senior Frontend Developer"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 block pl-1">About Me (Bio)</label>
                                        <textarea
                                            name="bio"
                                            value={profile.bio}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full p-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-blue-500 rounded-2xl transition-all outline-none font-medium text-gray-800 resize-none leading-relaxed"
                                            placeholder="Briefly describe your professional background and goals..."
                                        />
                                    </div>
                                </div>
                            </motion.section>

                            {/* Experience & Skills */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                            >
                                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3 border-b border-gray-100 pb-4">
                                    <Briefcase className="w-6 h-6 text-purple-500" />
                                    Professional Profile
                                </h3>

                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="md:col-span-1 space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 block pl-1">Experience (Years)</label>
                                            <div className="relative">
                                                <Award className="absolute left-4 top-3.5 text-purple-400 w-5 h-5" />
                                                <input
                                                    type="number"
                                                    name="experience_years"
                                                    value={profile.experience_years}
                                                    onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-purple-500 rounded-2xl transition-all outline-none font-bold text-gray-800"
                                                    placeholder="e.g. 3"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 block pl-1">Top Skills (Comma separated)</label>
                                            <div className="relative">
                                                <Code className="absolute left-4 top-3.5 text-purple-400 w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="skills"
                                                    value={profile.skills}
                                                    onChange={handleChange}
                                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-purple-500 rounded-2xl transition-all outline-none font-medium text-gray-800"
                                                    placeholder="React, Node.js, TypeScript..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-600 block pl-1">Education & Certifications</label>
                                        <textarea
                                            name="education"
                                            value={profile.education}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full p-5 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-purple-500 rounded-2xl transition-all outline-none font-medium text-gray-800 resize-none leading-relaxed"
                                            placeholder="• BSc Computer Science, University of Examples&#10;• Certified Cloud Practitioner"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 block pl-1">LinkedIn Profile URL</label>
                                            <div className="relative group">
                                                <LinkIcon className="absolute right-4 top-3.5 text-gray-300 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                                                <input
                                                    type="url"
                                                    name="linkedin_url"
                                                    value={profile.linkedin_url}
                                                    onChange={handleChange}
                                                    className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-transparent hover:bg-gray-100 focus:bg-white focus:border-purple-500 rounded-2xl transition-all outline-none font-medium text-gray-800"
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 block pl-1">Portfolio / Website URL</label>
                                            <div className="relative group">
                                                <LinkIcon className="absolute right-4 top-3.5 text-gray-300 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                                                <input
                                                    type="url"
                                                    name="portfolio_url"
                                                    value={profile.portfolio_url}
                                                    onChange={handleChange}
                                                    className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-transparent hover:bg-gray-100 focus:bg-white focus:border-purple-500 rounded-2xl transition-all outline-none font-medium text-gray-800"
                                                    placeholder="https://myportfolio.com"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-sm font-semibold text-gray-600 block pl-1">Expected Salary (Annual)</label>
                                            <div className="relative group">
                                                <DollarSign className="absolute right-4 top-3.5 text-gray-300 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    name="expected_salary"
                                                    value={profile.expected_salary}
                                                    onChange={handleChange}
                                                    className="w-full pl-5 pr-12 py-3.5 bg-gray-50 border-2 border-transparent hover:bg-gray-100 focus:bg-white focus:border-purple-500 rounded-2xl transition-all outline-none font-medium text-gray-800"
                                                    placeholder="e.g. $80,000 - $100,000"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.section>

                            {/* Skills Manager */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                            >
                                <SkillsManager onUpdate={fetchProfile} />
                            </motion.section>

                            {/* Work Experience Manager */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                            >
                                <WorkExperienceManager onUpdate={fetchProfile} />
                            </motion.section>

                            {/* Education Manager */}
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
                            >
                                <EducationManager onUpdate={fetchProfile} />
                            </motion.section>

                            <div className="flex justify-end gap-4 pt-4 pb-10">
                                <Link
                                    to="/candidate/resume"
                                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-200 transition-all flex items-center gap-2"
                                >
                                    <FileText className="w-5 h-5" />
                                    View Resume
                                </Link>
                            </div>
                            <div className="flex justify-end pt-4 pb-10">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-6 h-6" /> Save Profile
                                        </>
                                    )}
                                </motion.button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateProfile;
