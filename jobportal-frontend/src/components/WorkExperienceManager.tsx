import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, X, Briefcase, Calendar, MapPin, Loader2 } from 'lucide-react';
import api from '../api/axios';

interface WorkExperience {
    id: number;
    company_name: string;
    job_title: string;
    location: string;
    employment_type: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string;
    achievements: string;
    skills_used: string;
}

const WorkExperienceManager = ({ onUpdate }: { onUpdate?: () => void }) => {
    const [experiences, setExperiences] = useState<WorkExperience[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<WorkExperience>>({
        company_name: '',
        job_title: '',
        location: '',
        employment_type: 'full_time',
        start_date: '',
        end_date: null,
        is_current: false,
        description: '',
        achievements: '',
        skills_used: ''
    });

    useEffect(() => {
        console.log("WorkExperienceManager: Component mounted");
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            console.log("WorkExperienceManager: Fetching experiences");
            const response = await api.get('/candidate/work_experience.php');
            if (response.data.status === 'success') {
                setExperiences(response.data.data);
                console.log(`WorkExperienceManager: Loaded ${response.data.data.length} experiences`);
            }
        } catch (error) {
            console.error('WorkExperienceManager: Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.company_name || !formData.job_title || !formData.start_date) return;

        console.log("WorkExperienceManager: Submitting", editingId ? 'update' : 'new');
        try {
            if (editingId) {
                await api.put('/candidate/work_experience.php', { ...formData, id: editingId });
            } else {
                await api.post('/candidate/work_experience.php', formData);
            }
            console.log("WorkExperienceManager: Saved successfully");
            await fetchExperiences(); // Refresh the list
            resetForm();
            if (onUpdate) {
                onUpdate(); // Notify parent to refresh
            }
        } catch (error) {
            console.error('WorkExperienceManager: Save failed', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this experience?')) return;
        console.log(`WorkExperienceManager: Deleting ${id}`);
        try {
            await api.delete('/candidate/work_experience.php', { data: { id } });
            setExperiences(prev => prev.filter(e => e.id !== id));
            onUpdate?.();
        } catch (error) {
            console.error('WorkExperienceManager: Delete failed', error);
        }
    };

    const startEdit = (exp: WorkExperience) => {
        setEditingId(exp.id);
        setFormData(exp);
        setIsAdding(true);
    };

    const resetForm = () => {
        setFormData({
            company_name: '', job_title: '', location: '', employment_type: 'full_time',
            start_date: '', end_date: null, is_current: false, description: '', achievements: '', skills_used: ''
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Work Experience</h3>
                <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Experience
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="bg-blue-50 rounded-xl p-6 border border-blue-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Company Name *" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="text" placeholder="Job Title *" value={formData.job_title} onChange={e => setFormData({...formData, job_title: e.target.value})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                            <select value={formData.employment_type} onChange={e => setFormData({...formData, employment_type: e.target.value})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="full_time">Full Time</option>
                                <option value="part_time">Part Time</option>
                                <option value="contract">Contract</option>
                                <option value="internship">Internship</option>
                                <option value="freelance">Freelance</option>
                            </select>
                            <input type="date" placeholder="Start Date *" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="date" placeholder="End Date" value={formData.end_date || ''} onChange={e => setFormData({...formData, end_date: e.target.value || null})} disabled={formData.is_current} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100" />
                        </div>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={formData.is_current} onChange={e => setFormData({...formData, is_current: e.target.checked, end_date: e.target.checked ? null : formData.end_date})} className="w-4 h-4" /><span className="text-sm font-medium">I currently work here</span></label>
                        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                        <textarea placeholder="Achievements (one per line)" value={formData.achievements} onChange={e => setFormData({...formData, achievements: e.target.value})} rows={3} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                        <input type="text" placeholder="Skills Used (comma separated)" value={formData.skills_used} onChange={e => setFormData({...formData, skills_used: e.target.value})} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                        <div className="flex gap-2">
                            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"><Save className="w-4 h-4" /> {editingId ? 'Update' : 'Save'}</button>
                            <button onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">Cancel</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {experiences.map((exp, idx) => (
                    <motion.div key={exp.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-xl text-gray-900">{exp.job_title}</h4>
                                <p className="text-gray-700 font-medium flex items-center gap-2 mt-1"><Briefcase className="w-4 h-4" />{exp.company_name}</p>
                                {exp.location && <p className="text-gray-500 text-sm flex items-center gap-2 mt-1"><MapPin className="w-4 h-4" />{exp.location}</p>}
                                <p className="text-gray-500 text-sm flex items-center gap-2 mt-1"><Calendar className="w-4 h-4" />{formatDate(exp.start_date)} - {exp.is_current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : 'N/A'}</p>
                                {exp.is_current && <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Current Position</span>}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(exp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        {exp.description && <p className="text-gray-600 text-sm mb-3">{exp.description}</p>}
                        {exp.achievements && (
                            <div className="mb-3">
                                <p className="text-sm font-semibold text-gray-700 mb-1">Key Achievements:</p>
                                {exp.achievements.split('\n').filter(a => a.trim()).map((ach, i) => (
                                    <p key={i} className="text-sm text-gray-600 ml-4">• {ach}</p>
                                ))}
                            </div>
                        )}
                        {exp.skills_used && (
                            <div className="flex flex-wrap gap-2">
                                {exp.skills_used.split(',').map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{skill.trim()}</span>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {experiences.length === 0 && !isAdding && (
                <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No work experience added yet</p>
                    <p className="text-sm mt-1">Click "Add Experience" to start building your career timeline</p>
                </div>
            )}
        </div>
    );
};

export default WorkExperienceManager;
