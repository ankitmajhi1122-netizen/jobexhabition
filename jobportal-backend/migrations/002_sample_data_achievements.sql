-- =====================================================
-- Sample Data: Achievements & Gamification
-- Migration Script 002
-- =====================================================

-- Insert predefined achievements
INSERT INTO achievements (name, description, icon, category, points, criteria) VALUES
-- Profile Achievements
('Profile Starter', 'Create your first profile', '🎯', 'profile', 10, '{"action": "profile_created"}'),
('Profile Pro', 'Complete your profile to 50%', '⭐', 'profile', 25, '{"profile_completeness": 50}'),
('Profile Master', 'Complete your profile to 100%', '💎', 'profile', 50, '{"profile_completeness": 100}'),
('Photo Perfect', 'Upload a profile photo', '📸', 'profile', 15, '{"action": "photo_uploaded"}'),
('Resume Ready', 'Upload your resume', '📄', 'profile', 20, '{"action": "resume_uploaded"}'),
('Skill Builder', 'Add 5 or more skills', '🛠️', 'profile', 15, '{"skills_count": 5}'),
('Experience Expert', 'Add 3 work experiences', '💼', 'profile', 25, '{"work_experience_count": 3}'),
('Certified Pro', 'Add your first certification', '🏆', 'profile', 20, '{"certifications_count": 1}'),
('Portfolio Creator', 'Add your first project', '🎨', 'profile', 20, '{"projects_count": 1}'),
('Education Elite', 'Add education details', '🎓', 'profile', 15, '{"education_added": true}'),

-- Application Achievements
('First Step', 'Submit your first application', '🚀', 'applications', 10, '{"applications_count": 1}'),
('Job Seeker', 'Apply to 5 jobs', '📋', 'applications', 25, '{"applications_count": 5}'),
('Go-Getter', 'Apply to 25 jobs', '💪', 'applications', 50, '{"applications_count": 25}'),
('Persistent Hunter', 'Apply to 50 jobs', '🎯', 'applications', 100, '{"applications_count": 50}'),
('Job Marathon', 'Apply to 100 jobs', '🏃', 'applications', 200, '{"applications_count": 100}'),
('Early Bird', 'Apply within 24h of job posting', '🐦', 'applications', 30, '{"apply_within_hours": 24}'),
('Quick Responder', 'Apply to a job in under 5 minutes', '⚡', 'applications', 20, '{"apply_time_minutes": 5}'),
('Interview Ready', 'Get shortlisted for your first job', '✅', 'applications', 40, '{"shortlisted_count": 1}'),
('Interview Pro', 'Get shortlisted 5 times', '🌟', 'applications', 75, '{"shortlisted_count": 5}'),
('Hired Hero', 'Get your first job offer', '🎉', 'applications', 150, '{"hired_count": 1}'),

-- Social Achievements
('Networker', 'Get 10 profile views', '👀', 'social', 20, '{"profile_views": 10}'),
('Popular Profile', 'Get 50 profile views', '🔥', 'social', 50, '{"profile_views": 50}'),
('Star Candidate', 'Get 100 profile views', '⭐', 'social', 100, '{"profile_views": 100}'),
('Trending Talent', 'Get viewed by 10 different companies', '📈', 'social', 60, '{"unique_company_views": 10}'),
('Saved Favorite', 'Get saved by 5 companies', '❤️', 'social', 50, '{"saved_by_companies": 5}'),
('Conversation Starter', 'Start your first conversation with a company', '💬', 'social', 25, '{"conversations_count": 1}'),
('Referral Master', 'Refer 3 friends who register', '🤝', 'social', 75, '{"referrals_completed": 3}'),

-- Learning Achievements
('Curious Mind', 'View 10 job postings', '🔍', 'learning', 10, '{"jobs_viewed": 10}'),
('Research Expert', 'View 50 job postings', '📚', 'learning', 25, '{"jobs_viewed": 50}'),
('Company Explorer', 'View 10 different company profiles', '🏢', 'learning', 20, '{"companies_viewed": 10}'),
('Salary Savvy', 'Use salary calculator', '💰', 'learning', 15, '{"action": "salary_calculator_used"}'),
('Career Planner', 'Set your first career goal', '🎯', 'learning', 20, '{"career_goals_count": 1}'),
('Goal Achiever', 'Complete a career goal', '🏆', 'learning', 50, '{"career_goals_achieved": 1}'),

-- Milestone Achievements
('First Week', 'Active for 7 days', '📅', 'milestone', 20, '{"days_active": 7}'),
('Monthly Member', 'Active for 30 days', '📆', 'milestone', 50, '{"days_active": 30}'),
('Loyal User', 'Active for 90 days', '🎖️', 'milestone', 100, '{"days_active": 90}'),
('One Year Strong', 'Active for 365 days', '🏅', 'milestone', 250, '{"days_active": 365}'),
('Job Alert Master', 'Create 3 job alerts', '🔔', 'milestone', 25, '{"job_alerts_count": 3}'),
('Organized Pro', 'Save 10 jobs', '📌', 'milestone', 20, '{"saved_jobs_count": 10}'),
('Document Manager', 'Upload 5 documents', '📁', 'milestone', 30, '{"documents_count": 5}'),
('Complete Candidate', 'Unlock all basic features', '💫', 'milestone', 200, '{"all_features_unlocked": true}')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- =====================================================
-- END OF SAMPLE DATA
-- =====================================================
