import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import {
    Trophy, Star, Award, Target, Zap, Loader2,
    Briefcase, Lock, TrendingUp, CheckCircle2
} from 'lucide-react';
import ModernNav from '../../components/ModernNav';

interface Achievement {
    id: number;
    name: string;
    description: string;
    icon: string;
    category: string;
    points: number;
    is_earned: number;
    earned_at?: string;
}

interface AchievementStats {
    total_points: number;
    earned_count: number;
    total_count: number;
    completion_percentage: number;
}

const Achievements = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);
    const [stats, setStats] = useState<AchievementStats>({
        total_points: 0,
        earned_count: 0,
        total_count: 0,
        completion_percentage: 0
    });
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        console.log("=== Achievements: Component Mounted ===");
        console.log("Achievements: Timestamp:", new Date().toISOString());
        console.log("Achievements: Initiating fetch...");
        fetchAchievements();
    }, []);

    const fetchAchievements = async () => {
        console.log("=== Achievements: Fetching Data ===");
        console.log("Achievements: API endpoint: /candidate/achievements.php");
        console.log("Achievements: Request started at:", new Date().toISOString());
        
        try {
            const response = await api.get('/candidate/achievements.php');
            
            console.log("=== Achievements: Response Received ===");
            console.log("Achievements: HTTP Status:", response.status);
            console.log("Achievements: Response headers:", response.headers);
            console.log("Achievements: Full response data:", JSON.stringify(response.data, null, 2));
            console.log("Achievements: Success flag (boolean):", response.data.success);
            console.log("Achievements: Message:", response.data.message);

            if (response.data.success) {
                const achievementsData = response.data.data.achievements;
                const recentData = response.data.data.recent_achievements;
                const statsData = response.data.data.stats;
                
                console.log("=== Achievements: Processing Data ===");
                console.log("Achievements: Total achievements:", achievementsData.length);
                console.log("Achievements: Recent achievements:", recentData.length);
                console.log("Achievements: Stats:", statsData);
                
                // Log achievements by category
                const categories = ['profile', 'applications', 'social', 'learning', 'milestone'];
                categories.forEach(cat => {
                    const catAchievements = achievementsData.filter((a: Achievement) => a.category === cat);
                    const earnedInCat = catAchievements.filter((a: Achievement) => a.is_earned);
                    console.log(`Achievements: Category '${cat}':`, {
                        total: catAchievements.length,
                        earned: earnedInCat.length,
                        locked: catAchievements.length - earnedInCat.length
                    });
                });
                
                // Log each achievement in detail
                achievementsData.forEach((achievement: Achievement, index: number) => {
                    console.log(`Achievements: Achievement ${index + 1}:`, {
                        id: achievement.id,
                        name: achievement.name,
                        category: achievement.category,
                        points: achievement.points,
                        is_earned: achievement.is_earned,
                        earned_at: achievement.earned_at,
                        icon: achievement.icon,
                        description: achievement.description
                    });
                });
                
                console.log("Achievements: Setting state...");
                setAchievements(achievementsData);
                setRecentAchievements(recentData);
                setStats(statsData);
                
                console.log("=== Achievements: State Updated ===");
                console.log(`Achievements: Loaded ${achievementsData.length} total achievements`);
                console.log(`Achievements: Earned ${statsData.earned_count} badges`);
                console.log(`Achievements: Total points: ${statsData.total_points}`);
                console.log(`Achievements: Completion: ${statsData.completion_percentage}%`);
                console.log("Achievements: Recent achievements:", recentData.map((a: Achievement) => a.name));
            } else {
                console.warn("Achievements: Response status not success");
                console.warn("Achievements: Error message:", response.data.message);
            }
        } catch (error: any) {
            console.error("=== Achievements: ERROR ===");
            console.error('Achievements: Failed to fetch');
            console.error("Achievements: Error message:", error.message);
            console.error("Achievements: Error response:", error.response?.data);
            console.error("Achievements: Error status:", error.response?.status);
            console.error("Achievements: Error headers:", error.response?.headers);
            console.error("Achievements: Full error object:", error);
            console.error("Achievements: Stack trace:", error.stack);
        } finally {
            console.log("Achievements: Setting loading to false");
            setLoading(false);
            console.log("Achievements: Fetch process completed");
        }
    };


    const categories = [
        { id: 'all', name: 'All', icon: <Star className="w-4 h-4" /> },
        { id: 'profile', name: 'Profile', icon: <Target className="w-4 h-4" /> },
        { id: 'applications', name: 'Applications', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'social', name: 'Social', icon: <TrendingUp className="w-4 h-4" /> },
        { id: 'learning', name: 'Learning', icon: <Award className="w-4 h-4" /> },
        { id: 'milestone', name: 'Milestones', icon: <Trophy className="w-4 h-4" /> }
    ];

    const filteredAchievements = selectedCategory === 'all' 
        ? achievements 
        : achievements.filter(a => a.category === selectedCategory);

    const earnedAchievements = filteredAchievements.filter(a => a.is_earned);
    const lockedAchievements = filteredAchievements.filter(a => !a.is_earned);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <ModernNav activeTab="dashboard" />

            {/* Main Content */}
            <main className="pt-24 px-4 pb-12 max-w-7xl mx-auto">
                {/* Header with Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-purple-900/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                                    <Trophy className="w-10 h-10" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold">Achievements</h1>
                                    <p className="text-purple-100 mt-1">Your journey to success</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <div className="flex items-center gap-3">
                                        <Star className="w-8 h-8 text-yellow-300" />
                                        <div>
                                            <p className="text-sm text-purple-100">Total Points</p>
                                            <p className="text-3xl font-bold">{stats.total_points}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-8 h-8 text-green-300" />
                                        <div>
                                            <p className="text-sm text-purple-100">Earned</p>
                                            <p className="text-3xl font-bold">{stats.earned_count}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <div className="flex items-center gap-3">
                                        <Trophy className="w-8 h-8 text-orange-300" />
                                        <div>
                                            <p className="text-sm text-purple-100">Total</p>
                                            <p className="text-3xl font-bold">{stats.total_count}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-8 h-8 text-blue-300" />
                                        <div>
                                            <p className="text-sm text-purple-100">Completion</p>
                                            <p className="text-3xl font-bold">{stats.completion_percentage}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Achievements */}
                {recentAchievements.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-500" />
                            Recently Earned
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {recentAchievements.slice(0, 3).map((achievement) => (
                                <div key={achievement.id} className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">{achievement.icon}</span>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{achievement.name}</h3>
                                            <p className="text-sm text-gray-600">+{achievement.points} points</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Category Filter */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                console.log(`Achievements: Filter button clicked - ${cat.name}`);
                                console.log(`Achievements: Previous category: ${selectedCategory}`);
                                console.log(`Achievements: New category: ${cat.id}`);
                                setSelectedCategory(cat.id);
                                console.log(`Achievements: Category filter updated`);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                                selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Earned Achievements */}
                {earnedAchievements.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            Earned ({earnedAchievements.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {earnedAchievements.map((achievement, index) => (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-blue-50 rounded-bl-full opacity-50"></div>
                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-4">
                                            <span className="text-5xl">{achievement.icon}</span>
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                +{achievement.points} pts
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-xl text-gray-900 mb-2">{achievement.name}</h3>
                                        <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400 capitalize">{achievement.category}</span>
                                            <span className="text-xs text-green-600 font-semibold">
                                                Earned {new Date(achievement.earned_at!).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Locked Achievements */}
                {lockedAchievements.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Lock className="w-6 h-6 text-gray-400" />
                            Locked ({lockedAchievements.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lockedAchievements.map((achievement, index) => (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative overflow-hidden opacity-75 hover:opacity-100 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-5xl grayscale">{achievement.icon}</span>
                                        <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded-full">
                                            +{achievement.points} pts
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-xl text-gray-700 mb-2 flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        {achievement.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>
                                    <span className="text-xs text-gray-400 capitalize">{achievement.category}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No achievements message */}
                {filteredAchievements.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No achievements in this category</h3>
                        <p className="text-gray-500">Try selecting a different category</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Achievements;
