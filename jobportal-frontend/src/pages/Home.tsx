import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect, useState } from 'react';
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
    LogIn,
    Star,
    Quote,
    Target,
    Award,
    Clock,
    Shield
} from 'lucide-react';

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '', duration = 2 }: { target: number; suffix?: string; duration?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 50,
        stiffness: 100,
        duration: duration * 1000
    });
    const [displayValue, setDisplayValue] = React.useState('0');

    useEffect(() => {
        if (isInView) {
            motionValue.set(target);
        }
    }, [isInView, motionValue, target]);

    useEffect(() => {
        const unsubscribe = springValue.on('change', (latest) => {
            const value = Math.floor(latest);
            // Format with commas
            const formatted = value.toLocaleString();
            setDisplayValue(formatted + suffix);
        });
        return unsubscribe;
    }, [springValue, suffix]);

    return <span ref={ref}>{displayValue}</span>;
};

// Typewriter Effect Component
const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (currentIndex < text.length) {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }
        }, delay + currentIndex * 50);

        return () => clearTimeout(timeout);
    }, [currentIndex, text, delay]);

    return <span>{displayText}<span className="animate-pulse">|</span></span>;
};

// Floating Particles Component
const FloatingParticles = () => {
    // Reduce particles on mobile for better performance
    const particleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 10 : 20;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        size: Math.random() * 60 + 20,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-white/5 backdrop-blur-sm"
                    style={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.initialX}%`,
                        top: `${particle.initialY}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 100 - 50, 0],
                        opacity: [0.1, 0.5, 0.1],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: particle.duration,
                        delay: particle.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
    const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

    // Testimonial Auto-Slider State
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [direction, setDirection] = useState(1);

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Software Engineer',
            company: 'Tech Corp',
            image: '👩‍💻',
            rating: 5,
            text: 'I found my dream job within 2 weeks! The platform made it incredibly easy to connect with top companies. The process was seamless from start to finish.'
        },
        {
            name: 'Michael Chen',
            role: 'HR Manager',
            company: 'Global Industries',
            image: '👨‍💼',
            rating: 5,
            text: 'As a recruiter, this platform has been a game-changer. We hired 5 amazing candidates in just one month. The quality of applicants is outstanding.'
        },
        {
            name: 'Emily Rodriguez',
            role: 'Marketing Director',
            company: 'Creative Studios',
            image: '👩‍🎨',
            rating: 5,
            text: 'The user experience is fantastic! Everything from profile creation to application tracking is intuitive. Highly recommend to anyone job hunting.'
        }
    ];

    // Auto-slide testimonials every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setDirection(1);
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [testimonials.length]);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        if (newDirection > 0) {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        } else {
            setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        }
    };

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
        { label: 'Active Jobs', value: '10,000+', icon: Briefcase, target: 10000, suffix: '+' },
        { label: 'Companies', value: '5,000+', icon: Building2, target: 5000, suffix: '+' },
        { label: 'Job Seekers', value: '50,000+', icon: Users, target: 50000, suffix: '+' },
        { label: 'Success Rate', value: '95%', icon: TrendingUp, target: 95, suffix: '%' },
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

    const whyChooseUs = [
        {
            icon: Target,
            title: 'Precision Matching',
            description: 'Our AI-powered algorithm connects you with the perfect opportunities'
        },
        {
            icon: Shield,
            title: 'Verified Companies',
            description: 'All companies are thoroughly vetted for legitimacy and credibility'
        },
        {
            icon: Clock,
            title: 'Quick Process',
            description: 'Average time to hire is just 2 weeks - faster than industry standard'
        },
        {
            icon: Award,
            title: 'Success Stories',
            description: 'Over 50,000 successful placements and counting'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Floating Particles */}
                    <FloatingParticles />
                    
                    {/* Gradient Orbs */}
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
                    
                    {/* Additional floating orbs */}
                    <motion.div
                        animate={{
                            y: [0, -50, 0],
                            x: [0, 50, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent-300/10 rounded-full blur-2xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 50, 0],
                            x: [0, -50, 0],
                            scale: [1.2, 1, 1.2],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-primary-300/10 rounded-full blur-2xl"
                    />
                </div>

                <motion.div 
                    style={{ opacity, scale, y }}
                    className="relative z-10 container mx-auto px-4 py-20"
                >
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
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 md:mb-6 leading-tight px-4 md:px-0"
                        >
                            <span className="block">Find Your Dream Job</span>
                            <motion.span 
                                className="block bg-gradient-to-r from-accent-300 via-accent-400 to-accent-300 bg-clip-text text-transparent bg-[length:200%_100%]"
                                animate={{
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            >
                                <TypewriterText text="Today" delay={1500} />
                            </motion.span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-12 max-w-3xl mx-auto px-4 md:px-0"
                        >
                            Connect with thousands of employers and discover opportunities that match your skills and ambitions
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4 md:px-0 w-full sm:w-auto"
                        >
                            <motion.button
                                onClick={() => navigate('/register')}
                                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-600 rounded-full font-semibold text-base sm:text-lg flex items-center justify-center gap-2 shadow-xl overflow-hidden"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-accent-400 to-accent-600"
                                    initial={{ x: '-100%' }}
                                    whileHover={{ x: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <span className="relative z-10 group-hover:text-white transition-colors">Get Started Free</span>
                                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 group-hover:text-white transition-all" />
                            </motion.button>
                            
                            <motion.button
                                onClick={() => navigate('/jobs')}
                                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white border-2 border-white rounded-full font-semibold text-base sm:text-lg relative overflow-hidden"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white"
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileHover={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <span className="relative z-10 group-hover:text-primary-600 transition-colors">Browse Jobs</span>
                            </motion.button>
                            
                            <motion.button
                                onClick={() => navigate('/login')}
                                className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white border-2 border-white rounded-full font-semibold text-base sm:text-lg flex items-center justify-center gap-2 relative overflow-hidden"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <motion.div
                                    className="absolute inset-0 bg-primary-500"
                                    initial={{ y: '100%' }}
                                    whileHover={{ y: 0 }}
                                    transition={{ duration: 0.3 }}
                                />
                                <LogIn className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
                                <span className="relative z-10">Login</span>
                            </motion.button>
                        </motion.div>

                        {/* Search Bar Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="mt-12 md:mt-16 max-w-4xl mx-auto px-4 md:px-0"
                        >
                            <motion.div 
                                className="relative bg-white rounded-2xl shadow-2xl p-2 sm:p-3 flex flex-col md:flex-row gap-2 sm:gap-3"
                                whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)" }}
                            >
                                {/* Glowing border effect */}
                                <motion.div
                                    className="absolute -inset-[1px] bg-gradient-to-r from-accent-400 via-primary-500 to-accent-400 rounded-2xl opacity-0 blur-sm"
                                    whileHover={{ opacity: 0.5 }}
                                    transition={{ duration: 0.3 }}
                                />
                                
                                <div className="relative flex-1">
                                    <motion.div 
                                        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-xl"
                                        whileFocus={{ scale: 1.02 }}
                                    >
                                        <Search className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="Job title or keyword"
                                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
                                        />
                                    </motion.div>
                                </div>
                                
                                <div className="relative flex-1">
                                    <motion.div 
                                        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 rounded-xl"
                                        whileFocus={{ scale: 1.02 }}
                                    >
                                        <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 flex-shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="Location"
                                            className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm sm:text-base"
                                        />
                                    </motion.div>
                                </div>
                                
                                <motion.button 
                                    className="relative px-6 sm:px-8 py-2 sm:py-3 bg-gradient-primary text-white rounded-xl font-semibold overflow-hidden text-sm sm:text-base"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                                        animate={{ x: ['-200%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span className="relative z-10">Search</span>
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>

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
            <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <motion.div 
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}
                        animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                className="text-center group"
                            >
                                <motion.div
                                    className="relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-primary rounded-2xl text-white mb-3 md:mb-4 shadow-lg cursor-pointer"
                                    whileHover={{ 
                                        scale: 1.15, 
                                        rotate: [0, -5, 5, -5, 0],
                                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
                                    }}
                                    transition={{ 
                                        rotate: { duration: 0.5 },
                                        scale: { duration: 0.2 }
                                    }}
                                >
                                    {/* Glowing ring effect */}
                                    <motion.div
                                        className="absolute -inset-2 bg-gradient-to-r from-primary-400 to-accent-400 rounded-2xl opacity-0 blur-lg"
                                        whileHover={{ opacity: 0.6 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 relative z-10" />
                                </motion.div>
                                
                                <motion.h3 
                                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-1 md:mb-2"
                                    whileHover={{ scale: 1.1, color: '#0066cc' }}
                                >
                                    <AnimatedCounter target={stat.target} suffix={stat.suffix} duration={2.5} />
                                </motion.h3>
                                
                                <motion.p 
                                    className="text-xs sm:text-sm md:text-base text-gray-600 font-medium px-1"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                >
                                    {stat.label}
                                </motion.p>
                                
                                {/* Decorative line */}
                                <motion.div
                                    className="mt-2 md:mt-4 mx-auto h-0.5 md:h-1 bg-gradient-primary rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '60%' }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10 sm:mb-12 md:mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Built for <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Everyone</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            Whether you're looking for opportunities or hiring talent, we've got you covered
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                whileHover={{ y: -15, rotateY: 5, rotateX: 5 }}
                                className="card group cursor-pointer relative overflow-hidden"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {/* Shine effect on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-0"
                                    whileHover={{ opacity: 1, x: ['100%', '-100%'] }}
                                    transition={{ duration: 0.6 }}
                                />
                                
                                {/* Animated border glow */}
                                <motion.div
                                    className="absolute -inset-[1px] bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-2xl opacity-0 blur"
                                    whileHover={{ opacity: 0.3 }}
                                    transition={{ duration: 0.3 }}
                                />
                                
                                <div className="relative z-10">
                                    <motion.div 
                                        className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                                        whileHover={{ 
                                            scale: 1.2, 
                                            rotate: 360,
                                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)"
                                        }}
                                        transition={{ 
                                            duration: 0.6,
                                            rotate: { duration: 0.8 }
                                        }}
                                    >
                                        <feature.icon className="w-8 h-8 text-white" />
                                    </motion.div>
                                    
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    
                                    <p className="text-gray-600 mb-6">{feature.description}</p>
                                    
                                    <ul className="space-y-3">
                                        {feature.benefits.map((benefit, idx) => (
                                            <motion.li 
                                                key={idx} 
                                                className="flex items-center gap-2 text-gray-700"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: 0.1 * idx }}
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.3, rotate: 360 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                                </motion.div>
                                                <span>{benefit}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
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
                            Why Choose <span className="text-gradient">JobPortal?</span>
                        </h2>
                        <p className="section-subtitle max-w-2xl mx-auto">
                            We're not just another job board - we're your career partner
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {whyChooseUs.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                            >
                                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4">
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary-50 to-accent-50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-accent-500 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-10 sm:mb-12 md:mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className="inline-block mb-3 sm:mb-4"
                        >
                            <Quote className="w-10 sm:w-12 h-10 sm:h-12 text-primary-600" />
                        </motion.div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Success <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">Stories</span>
                        </h2>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                            Hear from professionals who transformed their careers with us
                        </p>
                    </motion.div>

                    {/* Carousel Container */}
                    <div className="relative max-w-4xl mx-auto px-2 sm:px-4">
                        <AnimatePresence mode="wait" initial={false} custom={direction}>
                            <motion.div
                                key={currentTestimonial}
                                custom={direction}
                                initial={{ 
                                    opacity: 0, 
                                    x: direction > 0 ? 300 : -300,
                                    scale: 0.8 
                                }}
                                animate={{ 
                                    opacity: 1, 
                                    x: 0,
                                    scale: 1 
                                }}
                                exit={{ 
                                    opacity: 0, 
                                    x: direction > 0 ? -300 : 300,
                                    scale: 0.8 
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    opacity: { duration: 0.3 }
                                }}
                                className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl relative"
                            >
                                {/* Quote Icon */}
                                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 opacity-10">
                                    <Quote className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 text-primary-600" />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 justify-center">
                                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                        <Star key={i} className="w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 fill-accent-400 text-accent-400" />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 italic leading-relaxed text-center max-w-2xl mx-auto">
                                    "{testimonials[currentTestimonial].text}"
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center gap-3 sm:gap-4 justify-center">
                                    <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-primary rounded-full flex items-center justify-center text-2xl sm:text-3xl md:text-4xl flex-shrink-0">
                                        {testimonials[currentTestimonial].image}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">{testimonials[currentTestimonial].name}</h4>
                                        <p className="text-xs sm:text-sm text-gray-600">{testimonials[currentTestimonial].role}</p>
                                        <p className="text-xs text-primary-600 font-medium">{testimonials[currentTestimonial].company}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <button
                            onClick={() => paginate(-1)}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 md:-translate-x-12 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300 z-10"
                            aria-label="Previous testimonial"
                        >
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 rotate-180" />
                        </button>
                        <button
                            onClick={() => paginate(1)}
                            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 md:translate-x-12 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all duration-300 z-10"
                            aria-label="Next testimonial"
                        >
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>

                        {/* Indicators */}
                        <div className="flex gap-2 justify-center mt-6 sm:mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setDirection(index > currentTestimonial ? 1 : -1);
                                        setCurrentTestimonial(index);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === currentTestimonial 
                                            ? 'w-8 bg-primary-600' 
                                            : 'w-2 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Trust Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="mt-12 text-center"
                    >
                        <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
                            <Award className="w-5 h-5 text-accent-500" />
                            <span className="font-semibold text-gray-900">Trusted by 50,000+ professionals</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-12 sm:py-16 md:py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-10 sm:mb-12 md:mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h2>
                        <p className="text-base sm:text-lg text-gray-600 px-4">Get started in just 3 simple steps</p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 relative">
                        {/* Animated Connection Line */}
                        <motion.div 
                            className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary-300 via-accent-300 to-primary-300 rounded-full overflow-hidden"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                        >
                            <motion.div
                                className="h-full w-20 bg-gradient-to-r from-transparent via-white to-transparent"
                                animate={{ x: ['-100%', '400%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>

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
                                        className="relative inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-primary rounded-full text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 shadow-xl cursor-pointer z-10"
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        {/* Ripple effect */}
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-2 sm:border-4 border-primary-400"
                                            animate={{
                                                scale: [1, 1.5, 1.5],
                                                opacity: [0.6, 0.3, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeOut",
                                                delay: index * 0.3
                                            }}
                                        />
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-2 sm:border-4 border-accent-400"
                                            animate={{
                                                scale: [1, 1.8, 1.8],
                                                opacity: [0.4, 0.2, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeOut",
                                                delay: index * 0.3 + 0.4
                                            }}
                                        />
                                        
                                        {/* Inner glow */}
                                        <motion.div
                                            className="absolute inset-1 sm:inset-2 rounded-full bg-white/20"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.5, 0.8, 0.5],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                        
                                        <span className="relative z-10">{item.step}</span>
                                    </motion.div>
                                    
                                    <motion.h3 
                                        className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 px-2"
                                        whileHover={{ scale: 1.05, color: '#0066cc' }}
                                    >
                                        {item.title}
                                    </motion.h3>
                                    
                                    <motion.p 
                                        className="text-sm sm:text-base text-gray-600 px-2"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                    >
                                        {item.description}
                                    </motion.p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-accent-500/20 rounded-full blur-3xl"
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6 px-4">
                            Ready to Take the Next Step?
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                            Join thousands of professionals who've found their perfect match on our platform
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/register')}
                            className="px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-white text-primary-600 rounded-full font-bold text-base sm:text-lg hover:bg-accent-400 hover:text-white transition-all duration-300 shadow-2xl inline-flex items-center gap-2 sm:gap-3"
                        >
                            <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                            <span className="whitespace-nowrap">Start Your Journey Now</span>
                        </motion.button>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8 sm:py-10 md:py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">JobPortal</h3>
                            <p className="text-gray-400 text-sm sm:text-base">
                                Your trusted partner in career growth and talent acquisition.
                            </p>
                        </div>
                        <div className="text-center sm:text-left">
                            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">For Job Seekers</h4>
                            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                                <li><a href="/jobs" className="hover:text-white transition">Browse Jobs</a></li>
                                <li><a href="/register" className="hover:text-white transition">Create Profile</a></li>
                                <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
                            </ul>
                        </div>
                        <div className="text-center sm:text-left">
                            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">For Employers</h4>
                            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                                <li><a href="/register" className="hover:text-white transition">Post a Job</a></li>
                                <li><a href="/register" className="hover:text-white transition">Pricing</a></li>
                                <li><a href="/login" className="hover:text-white transition">Sign In</a></li>
                            </ul>
                        </div>
                        <div className="text-center sm:text-left">
                            <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">Company</h4>
                            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
                        <p>&copy; 2026 JobPortal. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
