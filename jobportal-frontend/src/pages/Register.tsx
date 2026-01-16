import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Building2,
    Briefcase,
    Mail,
    Lock,
    Phone,
    ArrowRight,
    Loader2,
    CheckCircle2
} from 'lucide-react';
import api from '../api/axios';

const Register = () => {
    const [role, setRole] = useState<'candidate' | 'company' | 'consultancy'>('candidate');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Role specific fields
    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data: any = {};
        if (role === 'candidate') {
            data.full_name = fullName;
            data.phone = phone;
        } else {
            data.company_name = companyName;
            data.phone = phone;
        }

        try {
            await api.post('/auth/register.php', {
                email,
                password,
                role,
                data
            });
            // Redirect to OTP Verify
            navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const roles = [
        { id: 'candidate', label: 'Job Seeker', icon: User, desc: 'Find your dream job' },
        { id: 'company', label: 'Company', icon: Building2, desc: 'Hire top talent' },
        { id: 'consultancy', label: 'Consultancy', icon: Briefcase, desc: 'Manage multiple clients' }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10"
            >
                {/* Left Side - Role Selection */}
                <div className="md:w-1/3 bg-gray-50 p-8 border-r border-gray-100 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Select Account Type</h2>
                    <div className="space-y-4">
                        {roles.map((r) => (
                            <motion.button
                                key={r.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setRole(r.id as any)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center gap-3 ${role === r.id
                                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md'
                                    : 'border-gray-200 hover:border-primary-200 hover:bg-white text-gray-600'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${role === r.id ? 'bg-primary-100' : 'bg-gray-100'}`}>
                                    <r.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{r.label}</p>
                                    <p className="text-xs opacity-75">{r.desc}</p>
                                </div>
                                {role === r.id && <CheckCircle2 className="w-4 h-4 ml-auto text-primary-500" />}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="md:w-2/3 p-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-500">Join thousands of professionals today</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={role}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* Name / Company Name */}
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {role === 'candidate' ? 'Full Name' : 'Company Name'}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    {role === 'candidate' ? <User className="h-5 w-5 text-gray-400" /> : <Building2 className="h-5 w-5 text-gray-400" />}
                                                </div>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                    placeholder={role === 'candidate' ? "John Doe" : "Acme Corp"}
                                                    value={role === 'candidate' ? fullName : companyName}
                                                    onChange={(e) => role === 'candidate' ? setFullName(e.target.value) : setCompanyName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="col-span-1">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Phone className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    required
                                                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                    placeholder="+1 (555) 000-0000"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Get Started <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 hover:underline transition">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
