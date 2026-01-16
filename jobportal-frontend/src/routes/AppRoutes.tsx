import { Routes, Route } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import OTPVerify from '../pages/OTPVerify';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import JobList from '../pages/jobs/JobList';
import JobDetails from '../pages/jobs/JobDetails';
import PostJob from '../pages/jobs/PostJob';
import MyJobs from '../pages/jobs/MyJobs';

import CandidateProfile from '../pages/candidate/CandidateProfile';
import MyApplications from '../pages/candidate/MyApplications';
import UploadResume from '../pages/candidate/UploadResume';
import SavedJobs from '../pages/candidate/SavedJobs';
import Achievements from '../pages/candidate/Achievements';
import Analytics from '../pages/candidate/Analytics';
import ResumeBuilder from '../pages/candidate/ResumeBuilder';

import CompanyProfile from '../pages/company/CompanyProfile';
import JobApplicants from '../pages/company/JobApplicants';

import ManageUsers from '../pages/admin/ManageUsers';
import Grievances from '../pages/admin/Grievances';

// Dashboards
import AdminDashboard from '../pages/admin/AdminDashboard';
import CompanyDashboard from '../pages/company/CompanyDashboard';
import ConsultancyDashboard from '../pages/consultancy/ConsultancyDashboard';
import CandidateDashboard from '../pages/candidate/CandidateDashboard';

// HOC
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../types';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OTPVerify />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Jobs */}
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Admin */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <ManageUsers />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/grievances"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <Grievances />
                    </ProtectedRoute>
                }
            />

            {/* Company */}
            <Route
                path="/company/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.COMPANY]}>
                        <CompanyDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/company/post-job"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.COMPANY, ROLES.CONSULTANCY]}>
                        <PostJob />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/company/my-jobs"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.COMPANY, ROLES.CONSULTANCY]}>
                        <MyJobs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/company/profile"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.COMPANY, ROLES.CONSULTANCY]}>
                        <CompanyProfile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/company/applicants"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.COMPANY, ROLES.CONSULTANCY]}>
                        <JobApplicants />
                    </ProtectedRoute>
                }
            />

            {/* Consultancy */}
            <Route
                path="/consultancy/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CONSULTANCY]}>
                        <ConsultancyDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/consultancy/post-job"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CONSULTANCY]}>
                        <PostJob />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/consultancy/my-jobs"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CONSULTANCY]}>
                        <MyJobs />
                    </ProtectedRoute>
                }
            />

            {/* Candidate */}
            <Route
                path="/candidate/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
                        <CandidateDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/candidate/profile"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
                        <CandidateProfile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/candidate/applications"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
                        <MyApplications />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/candidate/upload-resume"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
                        <UploadResume />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/candidate/saved-jobs"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
                        <SavedJobs />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/candidate/achievements"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
                        <Achievements />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/candidate/analytics"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
                        <Analytics />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/candidate/resume"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.CANDIDATE]}>
                        <ResumeBuilder />
                    </ProtectedRoute>
                }
            />

            {/* Catch all */}
            <Route path="*" element={<div className="text-center mt-10">404 Not Found</div>} />
        </Routes>
    );
};

export default AppRoutes;
