import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2, Save, Trash2, Loader2, Star, Award } from 'lucide-react';
import api from '../api/axios';

interface Skill {
    id: number;
    skill_name: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    years_of_experience: number;
    is_primary: boolean;
}

interface SkillsManagerProps {
    onUpdate?: () => void;
}

const SkillsManager = ({ onUpdate }: SkillsManagerProps) => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [formData, setFormData] = useState({
        skill_name: '',
        proficiency: 'intermediate' as const,
        years_of_experience: 0,
        is_primary: false
    });

    useEffect(() => {
        console.log("SkillsManager: Component mounted");
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            console.log("SkillsManager: Fetching skills");
            const response = await api.get('/candidate/skills.php');
            if (response.data.success) {
                setSkills(response.data.data);
                console.log(`SkillsManager: Loaded ${response.data.data.length} skills`);
            }
        } catch (error) {
            console.error('SkillsManager: Failed to fetch skills', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!formData.skill_name.trim()) return;

        setErrorMessage(''); // Clear previous errors
        console.log("SkillsManager: Adding skill", formData);
        try {
            const response = await api.post('/candidate/skills.php', formData);
            if (response.data.success) {
                console.log("SkillsManager: Skill added successfully");
                await fetchSkills(); // Refresh the list
                setFormData({ skill_name: '', proficiency: 'intermediate', years_of_experience: 0, is_primary: false });
                setIsAdding(false);
                if (onUpdate) {
                    onUpdate(); // Notify parent to refresh
                }
            }
        } catch (error: any) {
            console.error('SkillsManager: Failed to add skill', error);
            
            // Handle specific error cases
            if (error.response?.status === 409) {
                setErrorMessage(`The skill "${formData.skill_name}" already exists in your profile.`);
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage('Failed to add skill. Please try again.');
            }
        }
    };

    const handleUpdate = async (id: number) => {
        const skill = skills.find(s => s.id === id);
        if (!skill) return;

        console.log(`SkillsManager: Updating skill ${id}`);
        try {
            await api.put('/candidate/skills.php', {
                id,
                proficiency: skill.proficiency,
                years_of_experience: skill.years_of_experience,
                is_primary: skill.is_primary
            });
            setEditingId(null);
            onUpdate?.();
            console.log("SkillsManager: Skill updated successfully");
        } catch (error) {
            console.error('SkillsManager: Failed to update skill', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this skill?')) return;

        console.log(`SkillsManager: Deleting skill ${id}`);
        try {
            await api.delete('/candidate/skills.php', { data: { id } });
            setSkills(prev => prev.filter(s => s.id !== id));
            onUpdate?.();
            console.log("SkillsManager: Skill deleted successfully");
        } catch (error) {
            console.error('SkillsManager: Failed to delete skill', error);
        }
    };

    const getProficiencyColor = (proficiency: string) => {
        const colors = {
            beginner: 'bg-gray-100 text-gray-700',
            intermediate: 'bg-blue-100 text-blue-700',
            advanced: 'bg-purple-100 text-purple-700',
            expert: 'bg-green-100 text-green-700'
        };
        return colors[proficiency as keyof typeof colors] || colors.intermediate;
    };

    const getProficiencyStars = (proficiency: string) => {
        const stars = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
        return stars[proficiency as keyof typeof stars] || 2;
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Skills</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Skill
                </button>
            </div>

            {/* Add Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 rounded-xl p-4 border border-blue-200"
                    >
                        {errorMessage && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-start gap-2">
                                <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm text-red-800 font-medium">{errorMessage}</p>
                                </div>
                                <button
                                    onClick={() => setErrorMessage('')}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Skill name"
                                value={formData.skill_name}
                                onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                                className="px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <select
                                value={formData.proficiency}
                                onChange={(e) => setFormData({ ...formData, proficiency: e.target.value as any })}
                                className="px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Years"
                                min="0"
                                value={formData.years_of_experience}
                                onChange={(e) => setFormData({ ...formData, years_of_experience: parseInt(e.target.value) || 0 })}
                                className="px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <label className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-blue-300">
                                <input
                                    type="checkbox"
                                    checked={formData.is_primary}
                                    onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm font-medium">Primary Skill</span>
                            </label>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={handleAdd}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsAdding(false);
                                    setErrorMessage('');
                                    setFormData({ skill_name: '', proficiency: 'intermediate', years_of_experience: 0, is_primary: false });
                                }}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Skills List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.map((skill) => (
                    <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 transition-all"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-gray-900">{skill.skill_name}</h4>
                                    {skill.is_primary && (
                                        <Award className="w-4 h-4 text-yellow-500" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {[...Array(getProficiencyStars(skill.proficiency))].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    ))}
                                    {[...Array(4 - getProficiencyStars(skill.proficiency))].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 text-gray-300" />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => setEditingId(editingId === skill.id ? null : skill.id)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(skill.id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {editingId === skill.id ? (
                            <div className="space-y-2">
                                <select
                                    value={skill.proficiency}
                                    onChange={(e) => setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, proficiency: e.target.value as any } : s))}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
                                >
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                    <option value="expert">Expert</option>
                                </select>
                                <input
                                    type="number"
                                    value={skill.years_of_experience}
                                    onChange={(e) => setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, years_of_experience: parseInt(e.target.value) || 0 } : s))}
                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-sm"
                                    placeholder="Years"
                                />
                                <label className="flex items-center gap-2 text-sm">
                                    <input
                                        type="checkbox"
                                        checked={skill.is_primary}
                                        onChange={(e) => setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, is_primary: e.target.checked } : s))}
                                        className="w-4 h-4"
                                    />
                                    Primary Skill
                                </label>
                                <button
                                    onClick={() => handleUpdate(skill.id)}
                                    className="w-full px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getProficiencyColor(skill.proficiency)}`}>
                                    {skill.proficiency}
                                </span>
                                <span className="text-sm text-gray-500">{skill.years_of_experience} years</span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {skills.length === 0 && !isAdding && (
                <div className="text-center py-8 text-gray-500">
                    <Award className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No skills added yet. Click "Add Skill" to start!</p>
                </div>
            )}
        </div>
    );
};

export default SkillsManager;
