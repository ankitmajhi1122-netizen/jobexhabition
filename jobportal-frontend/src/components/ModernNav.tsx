import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Briefcase, LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';

interface ModernNavProps {
    activeTab?: string;
}

const ModernNav = ({ activeTab = 'dashboard' }: ModernNavProps) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', path: '/candidate/dashboard' },
        { id: 'jobs', label: 'Find Jobs', path: '/jobs' },
        { id: 'applications', label: 'Applications', path: '/candidate/applications' },
        { id: 'saved', label: 'Saved', path: '/candidate/saved-jobs' },
        { id: 'alerts', label: 'Job Alerts', path: '/candidate/job-alerts' },
        { id: 'cover-letters', label: 'Cover Letters', path: '/candidate/cover-letters' },
        { id: 'profile', label: 'Profile', path: '/candidate/profile' }
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/candidate/dashboard" className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20">
                            <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            JobPortal
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.id}
                                to={item.path}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                    activeTab === item.id
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <div 
                            className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => navigate('/candidate/profile')}
                        >
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default ModernNav;
