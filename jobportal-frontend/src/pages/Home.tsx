import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Users,
    Building2,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Search,
    MapPin,
    Zap,
    LogIn
} from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const stats = [
        { label: 'Active Jobs', value: '10,000+', icon: Briefcase },
        { label: 'Companies', value: '5,000+', icon: Building2 },
        { label: 'Job Seekers', value: '50,000+', icon: Users },
        { label: 'Success Rate', value: '95%', icon: TrendingUp },
    ];

    const features = [
        {
            title: 'For Job Seekers',
            description: 'Find your dream job with advanced search filters and personalized recommendations',
            icon: Users,
            color: 'from-blue-500 to-blue-700',
            benefits: ['Smart Job Matching', 'Resume Builder', 'Application Tracking', 'Career Insights']
        },
        {
            title: 'For Companies',
            description: 'Hire top talent efficiently with our advanced recruitment tools',
            icon: Building2,
            color: 'from-purple-500 to-purple-700',
            benefits: ['Post Unlimited Jobs', 'Candidate Screening', 'Analytics Dashboard', 'Team Collaboration']
        },
        {
            title: 'For Consultancies',
            description: 'Expand your recruitment business with our comprehensive platform',
            icon: Briefcase,
            color: 'from-green-500 to-green-700',
            benefits: ['Multi-Client Management', 'Advanced Filters', 'Performance Metrics', 'Dedicated Support']
        },
    ];

    const howItWorks = [
        { step: 1, title: 'Create Account', description: 'Sign up as a job seeker, company, or consultancy' },
        { step: 2, title: 'Complete Profile', description: 'Add your details and requirements' },
        { step: 3, title: 'Connect & Grow', description: 'Find opportunities or hire talent' },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            rotate: [90, 0, 90],
                        }}
                        transition={{
                            duration: 15,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-accent-400/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="relative z-10 container mx-auto px-4 py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-block mb-6"
                        >
                            <span className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full text-white font-medium border border-white/20">
                                🚀 Welcome to Your Career Journey
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight"
                        >
                            Find Your Dream Job <br />
                            <span className="text-accent-300">Today</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
                        >
                            Connect with thousands of employers and discover opportunities that match your skills and ambitions
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <button
                                onClick={() => navigate('/register')}
                                className="group px-8 py-4 bg-white text-primary-600 rounded-full font-semibold text-lg hover:bg-accent-400 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/jobs')}
                                className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300"
                            >
                                Browse Jobs
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="px-8 py-4 bg-transparent text-white border-2 border-white-400 rounded-full font-semibold text-lg hover:bg-primary-500 hover:border-transparent transition-all duration-300 flex items-center gap-2"
                            >
                                <LogIn className="w-5 h-5" />
                                Login
                            </button>
                        </motion.div>

                        {/* Search Bar Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="mt-16 max-w-4xl mx-auto"
                        >
                            <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3">
                                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                                    <Search className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Job title or keyword"
                                        className="flex-1 bg-transparent outline-none text-gray-700"
                                    />
                                </div>
                                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Location"
                                        className="flex-1 bg-transparent outline-none text-gray-700"
                                    />
                                </div>
                                <button className="px-8 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                                    Search
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="text-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl text-white mb-4 shadow-lg"
                                >
                                    <stat.icon className="w-8 h-8" />
                                </motion.div>
                                <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                                <p className="text-gray-600 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="section-title">
                            Built for <span className="text-gradient">Everyone</span>
                        </h2>
                        <p className="section-subtitle max-w-2xl mx-auto">
                            Whether you're looking for opportunities or hiring talent, we've got you covered
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                whileHover={{ y: -10 }}
                                className="card group cursor-pointer"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 mb-6">{feature.description}</p>
                                <ul className="space-y-3">
                                    {feature.benefits.map((benefit, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-gray-700">
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="section-title">How It Works</h2>
                        <p className="section-subtitle">Get started in just 3 simple steps</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection Line */}
                        <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary-300 via-accent-300 to-primary-300" />

                        {howItWorks.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.5 }}
                                className="relative"
                            >
                                <div className="text-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-full text-white text-2xl font-bold mb-6 shadow-xl relative z-10"
                                    >
                                        {item.step}
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 right-0 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                            Ready to Take the Next Step?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Join thousands of professionals who've found their perfect match on our platform
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/register')}
                            className="px-12 py-5 bg-white text-primary-600 rounded-full font-bold text-lg hover:bg-accent-400 hover:text-white transition-all duration-300 shadow-2xl inline-flex items-center gap-3"
                        >
                            <Zap className="w-6 h-6" />
                            Start Your Journey Now
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">JobPortal</h3>
                            <p className="text-gray-400">
                                Your trusted partner in career growth and talent acquisition.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">For Job Seekers</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="/jobs" className="hover:text-white transition">Browse Jobs</a></li>
                                <li><a href="/register" className="hover:text-white transition">Create Profile</a></li>
                                <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">For Employers</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="/register" className="hover:text-white transition">Post a Job</a></li>
                                <li><a href="/register" className="hover:text-white transition">Pricing</a></li>
                                <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2026 JobPortal. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
