import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/axios';
import { 
    Download, Printer, Eye, FileText, Mail, Phone, MapPin, 
    Linkedin, Globe, Briefcase, GraduationCap, Award, Code,
    Calendar, ChevronLeft, Loader2
} from 'lucide-react';

interface ResumeData {
    profile: {
        full_name: string;
        email: string;
        phone: string;
        city: string;
        bio: string;
        portfolio_url: string;
        linkedin_url: string;
        current_role: string;
    };
    skills: Array<{
        skill_name: string;
        proficiency: string;
        years_of_experience: number;
        is_primary: boolean;
    }>;
    work_experience: Array<{
        company_name: string;
        job_title: string;
        location: string;
        start_date: string;
        end_date: string | null;
        is_current: boolean;
        description: string;
        achievements: string;
        skills_used: string;
    }>;
    education: Array<{
        institution_name: string;
        degree: string;
        field_of_study: string;
        start_year: number;
        end_year: number;
        grade: string;
    }>;
    certifications: Array<{
        certification_name: string;
        issuing_organization: string;
        issue_date: string;
        credential_id: string;
    }>;
    projects?: Array<{
        project_name: string;
        description: string;
        role: string;
        technologies_used: string;
        project_url: string;
        github_url: string;
        start_date: string;
        end_date: string | null;
        is_ongoing: boolean;
    }>;
}

const ResumeBuilder = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const printRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [resumeData, setResumeData] = useState<ResumeData | null>(null);

    useEffect(() => {
        console.log("ResumeBuilder: Loading resume data");
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [profile, skills, experience, education] = await Promise.all([
                api.get('/candidate/profile.php'),
                api.get('/candidate/skills.php'),
                api.get('/candidate/work_experience.php'),
                api.get('/candidate/education.php')
            ]);

            // Try to fetch certifications and projects, but don't fail if they error
            let certificationsData = [];
            let projectsData = [];
            
            try {
                const certifications = await api.get('/candidate/certifications.php');
                certificationsData = certifications.data.data || [];
            } catch (certError) {
                console.log("ResumeBuilder: Certifications not available yet");
            }

            try {
                const projects = await api.get('/candidate/projects.php');
                projectsData = projects.data.data || [];
            } catch (projectError) {
                console.log("ResumeBuilder: Projects not available yet");
            }

            setResumeData({
                profile: profile.data.data,
                skills: skills.data.data || [],
                work_experience: experience.data.data || [],
                education: education.data.data || [],
                certifications: certificationsData,
                projects: projectsData
            });

            console.log("ResumeBuilder: Data loaded successfully");
        } catch (error) {
            console.error('ResumeBuilder: Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        console.log("ResumeBuilder: Printing resume");
        window.print();
    };

    const handleDownloadPDF = () => {
        console.log("ResumeBuilder: Downloading as PDF");
        window.print();
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Present';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!resumeData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No resume data available</p>
                    <button onClick={() => navigate('/candidate/profile')} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
                        Complete Your Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Action Bar - Hide on print */}
            <div className="bg-white border-b border-gray-200 p-4 print:hidden sticky top-0 z-50">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/candidate/profile')} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ChevronLeft className="w-5 h-5" />
                        Back to Profile
                    </button>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/candidate/profile')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Edit Profile
                        </button>
                        <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button onClick={handleDownloadPDF} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Resume Preview */}
            <div className="max-w-4xl mx-auto p-8 print:p-0">
                <div ref={printRef} className="bg-white shadow-lg print:shadow-none" style={{ minHeight: '297mm' }}>
                    {/* Resume Content */}
                    <div className="p-12">
                        {/* Header */}
                        <div className="border-b-4 border-blue-600 pb-6 mb-6">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{resumeData.profile.full_name || 'Your Name'}</h1>
                            <p className="text-xl text-blue-600 font-medium mb-4">{resumeData.profile.current_role || 'Professional Title'}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                {resumeData.profile.email && (
                                    <div className="flex items-center gap-1.5">
                                        <Mail className="w-4 h-4" />
                                        {resumeData.profile.email}
                                    </div>
                                )}
                                {resumeData.profile.phone && (
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="w-4 h-4" />
                                        {resumeData.profile.phone}
                                    </div>
                                )}
                                {resumeData.profile.city && (
                                    <div className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        {resumeData.profile.city}
                                    </div>
                                )}
                                {resumeData.profile.linkedin_url && (
                                    <div className="flex items-center gap-1.5">
                                        <Linkedin className="w-4 h-4" />
                                        <span className="text-blue-600">{resumeData.profile.linkedin_url.replace('https://', '')}</span>
                                    </div>
                                )}
                                {resumeData.profile.portfolio_url && (
                                    <div className="flex items-center gap-1.5">
                                        <Globe className="w-4 h-4" />
                                        <span className="text-blue-600">{resumeData.profile.portfolio_url.replace('https://', '')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Professional Summary */}
                        {resumeData.profile.bio && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Professional Summary
                                </h2>
                                <p className="text-gray-700 leading-relaxed">{resumeData.profile.bio}</p>
                            </div>
                        )}

                        {/* Skills */}
                        {resumeData.skills.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
                                    <Code className="w-5 h-5 text-blue-600" />
                                    Technical Skills
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {resumeData.skills.map((skill, idx) => (
                                        <div key={idx} className="flex items-center justify-between">
                                            <span className="text-gray-800 font-medium">{skill.skill_name}</span>
                                            <span className="text-sm text-gray-600 capitalize">
                                                {skill.proficiency} {skill.years_of_experience > 0 && `(${skill.years_of_experience}y)`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Work Experience */}
                        {resumeData.work_experience.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
                                    <Briefcase className="w-5 h-5 text-blue-600" />
                                    Work Experience
                                </h2>
                                {resumeData.work_experience.map((exp, idx) => (
                                    <div key={idx} className="mb-4 last:mb-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{exp.job_title}</h3>
                                                <p className="text-gray-700 font-medium">{exp.company_name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                                                </p>
                                                {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                                            </div>
                                        </div>
                                        {exp.description && <p className="text-gray-600 text-sm mb-2">{exp.description}</p>}
                                        {exp.achievements && (
                                            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                                                {exp.achievements.split('\n').filter(a => a.trim()).map((achievement, i) => (
                                                    <li key={i}>{achievement.replace(/^[•\-]\s*/, '')}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {exp.skills_used && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                <strong>Technologies:</strong> {exp.skills_used}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Education */}
                        {resumeData.education.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
                                    <GraduationCap className="w-5 h-5 text-blue-600" />
                                    Education
                                </h2>
                                {resumeData.education.map((edu, idx) => (
                                    <div key={idx} className="mb-3 last:mb-0 flex justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                                            <p className="text-gray-700">{edu.institution_name}</p>
                                            {edu.field_of_study && <p className="text-gray-600 text-sm">{edu.field_of_study}</p>}
                                            {edu.grade && <p className="text-sm text-gray-600">Grade: {edu.grade}</p>}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">{edu.start_year} - {edu.end_year || 'Present'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Certifications */}
                        {resumeData.certifications.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2 border-b-2 border-gray-200 pb-2">
                                    <Award className="w-5 h-5 text-blue-600" />
                                    Certifications
                                </h2>
                                {resumeData.certifications.map((cert, idx) => (
                                    <div key={idx} className="mb-2 last:mb-0 flex justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{cert.certification_name}</h3>
                                            <p className="text-gray-600 text-sm">{cert.issuing_organization}</p>
                                            {cert.credential_id && <p className="text-xs text-gray-500">ID: {cert.credential_id}</p>}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">{formatDate(cert.issue_date)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
