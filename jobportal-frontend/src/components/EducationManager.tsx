import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Save, GraduationCap, Loader2 } from 'lucide-react';
import api from '../api/axios';

interface Education {
    id: number;
    institution_name: string;
    degree: string;
    field_of_study: string;
    start_year: number | null;
    end_year: number | null;
    grade: string;
    activities: string;
    description: string;
}

const EducationManager = ({ onUpdate }: { onUpdate?: () => void }) => {
    const [education, setEducation] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Education>>({
        institution_name: '', degree: '', field_of_study: '', start_year: null, end_year: null, grade: '', activities: '', description: ''
    });

    useEffect(() => {
        console.log("EducationManager: Component mounted");
        fetchEducation();
    }, []);

    const fetchEducation = async () => {
        try {
            console.log("EducationManager: Fetching education");
            const response = await api.get('/candidate/education.php');
            if (response.data.success) {
                setEducation(response.data.data);
                console.log(`EducationManager: Loaded ${response.data.data.length} records`);
            }
        } catch (error) {
            console.error('EducationManager: Failed to fetch', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.institution_name || !formData.degree) return;
        console.log("EducationManager: Submitting", editingId ? 'update' : 'new');
        try {
            if (editingId) {
                await api.put('/candidate/education.php', { ...formData, id: editingId });
            } else {
                await api.post('/candidate/education.php', formData);
            }
            console.log("EducationManager: Saved successfully");
            await fetchEducation(); // Refresh the list
            resetForm();
            if (onUpdate) {
                onUpdate(); // Notify parent to refresh
            }
        } catch (error) {
            console.error('EducationManager: Save failed', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this education record?')) return;
        console.log(`EducationManager: Deleting ${id}`);
        try {
            await api.delete('/candidate/education.php', { data: { id } });
            setEducation(prev => prev.filter(e => e.id !== id));
            onUpdate?.();
        } catch (error) {
            console.error('EducationManager: Delete failed', error);
        }
    };

    const startEdit = (edu: Education) => {
        setEditingId(edu.id);
        setFormData(edu);
        setIsAdding(true);
    };

    const resetForm = () => {
        setFormData({ institution_name: '', degree: '', field_of_study: '', start_year: null, end_year: null, grade: '', activities: '', description: '' });
        setIsAdding(false);
        setEditingId(null);
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Education</h3>
                <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Education
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-blue-50 rounded-xl p-6 border border-blue-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Institution Name *" value={formData.institution_name} onChange={e => setFormData({...formData, institution_name: e.target.value})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="text" placeholder="Degree *" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="text" placeholder="Field of Study" value={formData.field_of_study} onChange={e => setFormData({...formData, field_of_study: e.target.value})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="text" placeholder="Grade/GPA" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="number" placeholder="Start Year" value={formData.start_year || ''} onChange={e => setFormData({...formData, start_year: e.target.value ? parseInt(e.target.value) : null})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                            <input type="number" placeholder="End Year" value={formData.end_year || ''} onChange={e => setFormData({...formData, end_year: e.target.value ? parseInt(e.target.value) : null})} className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <textarea placeholder="Activities & Societies" value={formData.activities} onChange={e => setFormData({...formData, activities: e.target.value})} rows={2} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                        <div className="flex gap-2">
                            <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"><Save className="w-4 h-4" /> {editingId ? 'Update' : 'Save'}</button>
                            <button onClick={resetForm} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">Cancel</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {education.map((edu, idx) => (
                    <motion.div key={edu.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex gap-4 flex-1">
                                <div className="p-3 bg-blue-50 rounded-xl"><GraduationCap className="w-8 h-8 text-blue-600" /></div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg text-gray-900">{edu.degree}</h4>
                                    <p className="text-gray-700 font-medium">{edu.institution_name}</p>
                                    {edu.field_of_study && <p className="text-gray-600 text-sm mt-1">{edu.field_of_study}</p>}
                                    <p className="text-gray-500 text-sm mt-1">{edu.start_year} - {edu.end_year || 'Present'}</p>
                                    {edu.grade && <p className="text-blue-600 text-sm font-medium mt-1">Grade: {edu.grade}</p>}
                                    {edu.activities && <p className="text-gray-600 text-sm mt-2"><strong>Activities:</strong> {edu.activities}</p>}
                                    {edu.description && <p className="text-gray-600 text-sm mt-2">{edu.description}</p>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(edu)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(edu.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {education.length === 0 && !isAdding && (
                <div className="text-center py-12 text-gray-500">
                    <GraduationCap className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">No education records added</p>
                    <p className="text-sm mt-1">Click "Add Education" to showcase your academic background</p>
                </div>
            )}
        </div>
    );
};

export default EducationManager;
