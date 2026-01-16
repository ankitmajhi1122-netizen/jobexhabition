-- =====================================================
-- ROLLBACK SCRIPT
-- Use this to revert changes if needed
-- WARNING: This will drop tables and lose data!
-- =====================================================

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables in reverse order (newest first)
DROP TABLE IF EXISTS review_helpful_votes;
DROP TABLE IF EXISTS company_reviews;
DROP TABLE IF EXISTS saved_searches;
DROP TABLE IF EXISTS referrals;
DROP TABLE IF EXISTS candidate_achievements;
DROP TABLE IF EXISTS achievements;
DROP TABLE IF EXISTS candidate_documents;
DROP TABLE IF EXISTS career_goals;
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS cover_letters;
DROP TABLE IF EXISTS application_documents;
DROP TABLE IF EXISTS application_timeline;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS job_alerts;
DROP TABLE IF EXISTS saved_jobs;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS candidate_skills;
DROP TABLE IF EXISTS certifications;
DROP TABLE IF EXISTS education;
DROP TABLE IF EXISTS work_experience;
DROP TABLE IF EXISTS profile_views;

-- Remove added columns from candidates table
ALTER TABLE candidates 
DROP COLUMN IF EXISTS job_seeking_status,
DROP COLUMN IF EXISTS open_to_work_visibility,
DROP COLUMN IF EXISTS open_to_work,
DROP COLUMN IF EXISTS anonymous_mode,
DROP COLUMN IF EXISTS allow_recruiter_contact,
DROP COLUMN IF EXISTS show_resume_to_all,
DROP COLUMN IF EXISTS profile_visibility,
DROP COLUMN IF EXISTS last_profile_update,
DROP COLUMN IF EXISTS notice_period,
DROP COLUMN IF EXISTS preferred_salary_max,
DROP COLUMN IF EXISTS preferred_salary_min,
DROP COLUMN IF EXISTS preferred_locations,
DROP COLUMN IF EXISTS preferred_job_types,
DROP COLUMN IF EXISTS willing_to_relocate,
DROP COLUMN IF EXISTS availability,
DROP COLUMN IF EXISTS achievements,
DROP COLUMN IF EXISTS certifications,
DROP COLUMN IF EXISTS languages,
DROP COLUMN IF EXISTS profile_headline,
DROP COLUMN IF EXISTS profile_completeness,
DROP COLUMN IF EXISTS photo_url;

-- Remove added columns from applications table
ALTER TABLE applications
DROP COLUMN IF EXISTS salary_expectation,
DROP COLUMN IF EXISTS cover_letter_id,
DROP COLUMN IF EXISTS status_updated_at,
DROP COLUMN IF EXISTS interview_notes,
DROP COLUMN IF EXISTS interview_location,
DROP COLUMN IF EXISTS interview_type,
DROP COLUMN IF EXISTS interview_date,
DROP COLUMN IF EXISTS withdrawn_at,
DROP COLUMN IF EXISTS withdrawn,
DROP COLUMN IF EXISTS notes;

-- Drop functions and procedures
DROP FUNCTION IF EXISTS calculate_profile_completeness;
DROP PROCEDURE IF EXISTS update_all_profile_completeness;
DROP PROCEDURE IF EXISTS check_candidate_achievements;

-- Drop triggers
DROP TRIGGER IF EXISTS candidates_after_update;
DROP TRIGGER IF EXISTS applications_after_insert;
DROP TRIGGER IF EXISTS applications_after_update;
DROP TRIGGER IF EXISTS profile_views_after_insert;

-- Drop added indexes
ALTER TABLE applications DROP INDEX IF EXISTS idx_candidate_status;
ALTER TABLE applications DROP INDEX IF EXISTS idx_job_status;
ALTER TABLE jobs DROP INDEX IF EXISTS idx_location_type;
ALTER TABLE jobs DROP INDEX IF EXISTS idx_status_created;
ALTER TABLE jobs DROP INDEX IF EXISTS ft_title_description;
ALTER TABLE candidates DROP INDEX IF EXISTS ft_skills;
ALTER TABLE candidates DROP INDEX IF EXISTS idx_profile_completeness;
ALTER TABLE candidates DROP INDEX IF EXISTS idx_open_to_work;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- END OF ROLLBACK SCRIPT
-- =====================================================
