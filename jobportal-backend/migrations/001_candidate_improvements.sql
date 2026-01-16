-- =====================================================
-- Candidate Portal Database Improvements
-- Migration Script 001
-- Date: 2026-01-17
-- =====================================================

-- =====================================================
-- CRITICAL FIX: Missing profile_views table
-- =====================================================

CREATE TABLE IF NOT EXISTS profile_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    company_id INT NOT NULL,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id),
    INDEX idx_company (company_id),
    INDEX idx_viewed_at (viewed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHASE 1: Enhanced Candidate Profile
-- =====================================================

-- Add new fields to candidates table
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS photo_url VARCHAR(255) DEFAULT NULL AFTER resume_url,
ADD COLUMN IF NOT EXISTS profile_completeness INT DEFAULT 0 AFTER photo_url,
ADD COLUMN IF NOT EXISTS profile_headline VARCHAR(200) DEFAULT NULL AFTER full_name,
ADD COLUMN IF NOT EXISTS languages TEXT DEFAULT NULL AFTER education,
ADD COLUMN IF NOT EXISTS certifications TEXT DEFAULT NULL AFTER languages,
ADD COLUMN IF NOT EXISTS achievements TEXT DEFAULT NULL AFTER certifications,
ADD COLUMN IF NOT EXISTS availability ENUM('immediate', '2weeks', '1month', 'not_looking') DEFAULT 'immediate' AFTER achievements,
ADD COLUMN IF NOT EXISTS willing_to_relocate BOOLEAN DEFAULT FALSE AFTER availability,
ADD COLUMN IF NOT EXISTS preferred_job_types TEXT DEFAULT NULL AFTER willing_to_relocate,
ADD COLUMN IF NOT EXISTS preferred_locations TEXT DEFAULT NULL AFTER preferred_job_types,
ADD COLUMN IF NOT EXISTS preferred_salary_min DECIMAL(10,2) DEFAULT NULL AFTER expected_salary,
ADD COLUMN IF NOT EXISTS preferred_salary_max DECIMAL(10,2) DEFAULT NULL AFTER preferred_salary_min,
ADD COLUMN IF NOT EXISTS notice_period VARCHAR(50) DEFAULT NULL AFTER preferred_salary_max,
ADD COLUMN IF NOT EXISTS last_profile_update DATETIME DEFAULT NULL AFTER notice_period,
ADD COLUMN IF NOT EXISTS profile_visibility ENUM('public', 'private', 'connections_only') DEFAULT 'public' AFTER profile_completeness,
ADD COLUMN IF NOT EXISTS show_resume_to_all BOOLEAN DEFAULT TRUE AFTER profile_visibility,
ADD COLUMN IF NOT EXISTS allow_recruiter_contact BOOLEAN DEFAULT TRUE AFTER show_resume_to_all,
ADD COLUMN IF NOT EXISTS anonymous_mode BOOLEAN DEFAULT FALSE AFTER allow_recruiter_contact,
ADD COLUMN IF NOT EXISTS open_to_work BOOLEAN DEFAULT TRUE AFTER anonymous_mode,
ADD COLUMN IF NOT EXISTS open_to_work_visibility ENUM('all', 'recruiters_only', 'hidden') DEFAULT 'all' AFTER open_to_work,
ADD COLUMN IF NOT EXISTS job_seeking_status ENUM('actively_looking', 'open_to_offers', 'not_looking') DEFAULT 'open_to_offers' AFTER open_to_work_visibility;

-- =====================================================
-- Work Experience Table
-- =====================================================

CREATE TABLE IF NOT EXISTS work_experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    location VARCHAR(100) DEFAULT NULL,
    employment_type ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance') DEFAULT 'full_time',
    start_date DATE NOT NULL,
    end_date DATE DEFAULT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT DEFAULT NULL,
    achievements TEXT DEFAULT NULL,
    skills_used TEXT DEFAULT NULL,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id),
    INDEX idx_current (is_current)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Education Table
-- =====================================================

CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    institution_name VARCHAR(255) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    field_of_study VARCHAR(100) DEFAULT NULL,
    start_year INT DEFAULT NULL,
    end_year INT DEFAULT NULL,
    grade VARCHAR(50) DEFAULT NULL,
    activities TEXT DEFAULT NULL,
    description TEXT DEFAULT NULL,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Certifications Table
-- =====================================================

CREATE TABLE IF NOT EXISTS certifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    certification_name VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255) NOT NULL,
    issue_date DATE DEFAULT NULL,
    expiry_date DATE DEFAULT NULL,
    credential_id VARCHAR(100) DEFAULT NULL,
    credential_url VARCHAR(255) DEFAULT NULL,
    does_not_expire BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Skills Table (Enhanced)
-- =====================================================

CREATE TABLE IF NOT EXISTS candidate_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    proficiency ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'intermediate',
    years_of_experience INT DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    endorsement_count INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_candidate_skill (candidate_id, skill_name),
    INDEX idx_candidate (candidate_id),
    INDEX idx_primary (is_primary)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- Projects/Portfolio Table
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    role VARCHAR(100) DEFAULT NULL,
    technologies_used TEXT DEFAULT NULL,
    project_url VARCHAR(255) DEFAULT NULL,
    github_url VARCHAR(255) DEFAULT NULL,
    thumbnail_url VARCHAR(255) DEFAULT NULL,
    start_date DATE DEFAULT NULL,
    end_date DATE DEFAULT NULL,
    is_ongoing BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id),
    INDEX idx_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHASE 2: Job Search & Discovery
-- =====================================================

-- Saved Jobs / Bookmarks
CREATE TABLE IF NOT EXISTS saved_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    job_id INT NOT NULL,
    notes TEXT DEFAULT NULL,
    saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_saved_job (candidate_id, job_id),
    INDEX idx_candidate (candidate_id),
    INDEX idx_saved_at (saved_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Alerts
CREATE TABLE IF NOT EXISTS job_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    alert_name VARCHAR(100) DEFAULT 'My Alert',
    keywords TEXT DEFAULT NULL,
    location VARCHAR(100) DEFAULT NULL,
    min_salary DECIMAL(10,2) DEFAULT NULL,
    max_salary DECIMAL(10,2) DEFAULT NULL,
    job_type VARCHAR(50) DEFAULT NULL,
    experience_level VARCHAR(50) DEFAULT NULL,
    frequency ENUM('instant', 'daily', 'weekly') DEFAULT 'daily',
    is_active BOOLEAN DEFAULT TRUE,
    last_sent_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('application_status', 'profile_view', 'new_job', 'message', 'interview', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT DEFAULT NULL,
    link VARCHAR(255) DEFAULT NULL,
    metadata TEXT DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    read_at DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHASE 3: Application Management
-- =====================================================

-- Enhance applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT NULL AFTER status,
ADD COLUMN IF NOT EXISTS withdrawn BOOLEAN DEFAULT FALSE AFTER notes,
ADD COLUMN IF NOT EXISTS withdrawn_at DATETIME DEFAULT NULL AFTER withdrawn,
ADD COLUMN IF NOT EXISTS interview_date DATETIME DEFAULT NULL AFTER withdrawn_at,
ADD COLUMN IF NOT EXISTS interview_type ENUM('phone', 'video', 'in_person') DEFAULT NULL AFTER interview_date,
ADD COLUMN IF NOT EXISTS interview_location VARCHAR(255) DEFAULT NULL AFTER interview_type,
ADD COLUMN IF NOT EXISTS interview_notes TEXT DEFAULT NULL AFTER interview_location,
ADD COLUMN IF NOT EXISTS status_updated_at DATETIME DEFAULT NULL AFTER interview_notes,
ADD COLUMN IF NOT EXISTS cover_letter_id INT DEFAULT NULL AFTER status_updated_at,
ADD COLUMN IF NOT EXISTS salary_expectation DECIMAL(10,2) DEFAULT NULL AFTER cover_letter_id;

-- Application Timeline/History
CREATE TABLE IF NOT EXISTS application_timeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT DEFAULT NULL,
    changed_by_user_id INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_application (application_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Application Documents
CREATE TABLE IF NOT EXISTS application_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    document_type ENUM('cover_letter', 'portfolio', 'certificate', 'transcript', 'other') NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    file_size INT DEFAULT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_application (application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Cover Letters
CREATE TABLE IF NOT EXISTS cover_letters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    template_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id),
    INDEX idx_default (is_default)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHASE 4: Communication & Messaging
-- =====================================================

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    company_id INT NOT NULL,
    job_id INT DEFAULT NULL,
    subject VARCHAR(255) DEFAULT NULL,
    last_message_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL,
    INDEX idx_candidate (candidate_id),
    INDEX idx_company (company_id),
    INDEX idx_last_message (last_message_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    sender_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at DATETIME DEFAULT NULL,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (conversation_id),
    INDEX idx_sender (sender_id),
    INDEX idx_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interviews
CREATE TABLE IF NOT EXISTS interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    interview_type ENUM('phone', 'video', 'in_person', 'assessment') NOT NULL,
    scheduled_date DATETIME NOT NULL,
    duration_minutes INT DEFAULT 60,
    timezone VARCHAR(50) DEFAULT 'UTC',
    location VARCHAR(255) DEFAULT NULL,
    meeting_link VARCHAR(255) DEFAULT NULL,
    meeting_password VARCHAR(100) DEFAULT NULL,
    interviewer_name VARCHAR(100) DEFAULT NULL,
    interviewer_email VARCHAR(100) DEFAULT NULL,
    interviewer_phone VARCHAR(20) DEFAULT NULL,
    candidate_status ENUM('pending', 'confirmed', 'declined', 'rescheduled', 'completed', 'cancelled') DEFAULT 'pending',
    company_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
    company_notes TEXT DEFAULT NULL,
    candidate_notes TEXT DEFAULT NULL,
    feedback TEXT DEFAULT NULL,
    rating INT DEFAULT NULL,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_application (application_id),
    INDEX idx_scheduled (scheduled_date),
    INDEX idx_candidate_status (candidate_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHASE 5: Career Management & Goals
-- =====================================================

-- Career Goals
CREATE TABLE IF NOT EXISTS career_goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    goal_type ENUM('job_title', 'salary', 'skills', 'company', 'location', 'custom') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    target_value TEXT DEFAULT NULL,
    current_value TEXT DEFAULT NULL,
    target_date DATE DEFAULT NULL,
    progress INT DEFAULT 0,
    achieved BOOLEAN DEFAULT FALSE,
    achieved_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id),
    INDEX idx_achieved (achieved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHASE 6: Document Management
-- =====================================================

-- Candidate Documents
CREATE TABLE IF NOT EXISTS candidate_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_type ENUM('resume', 'certificate', 'transcript', 'portfolio', 'reference', 'other') NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    file_size INT DEFAULT NULL,
    mime_type VARCHAR(100) DEFAULT NULL,
    folder VARCHAR(100) DEFAULT 'General',
    is_public BOOLEAN DEFAULT FALSE,
    description TEXT DEFAULT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id),
    INDEX idx_type (document_type),
    INDEX idx_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHASE 7: Gamification & Engagement
-- =====================================================

-- Achievements/Badges
CREATE TABLE IF NOT EXISTS achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon VARCHAR(100) DEFAULT NULL,
    category ENUM('profile', 'applications', 'social', 'learning', 'milestone') DEFAULT 'milestone',
    points INT DEFAULT 0,
    criteria TEXT DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Candidate Achievements
CREATE TABLE IF NOT EXISTS candidate_achievements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    achievement_id INT NOT NULL,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE KEY unique_candidate_achievement (candidate_id, achievement_id),
    INDEX idx_candidate (candidate_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Referrals
CREATE TABLE IF NOT EXISTS referrals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    referrer_id INT NOT NULL,
    referred_email VARCHAR(255) NOT NULL,
    referred_user_id INT DEFAULT NULL,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'registered', 'completed') DEFAULT 'pending',
    reward_points INT DEFAULT 0,
    reward_claimed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME DEFAULT NULL,
    FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_referrer (referrer_id),
    INDEX idx_code (referral_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHASE 8: Reviews & Ratings
-- =====================================================

-- Company Reviews
CREATE TABLE IF NOT EXISTS company_reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    candidate_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    work_life_balance INT DEFAULT NULL CHECK (work_life_balance BETWEEN 1 AND 5),
    salary_benefits INT DEFAULT NULL CHECK (salary_benefits BETWEEN 1 AND 5),
    culture INT DEFAULT NULL CHECK (culture BETWEEN 1 AND 5),
    management INT DEFAULT NULL CHECK (management BETWEEN 1 AND 5),
    career_growth INT DEFAULT NULL CHECK (career_growth BETWEEN 1 AND 5),
    review_title VARCHAR(200) NOT NULL,
    review_text TEXT NOT NULL,
    pros TEXT DEFAULT NULL,
    cons TEXT DEFAULT NULL,
    advice_to_management TEXT DEFAULT NULL,
    employment_status ENUM('current', 'former') NOT NULL,
    job_title VARCHAR(100) DEFAULT NULL,
    years_at_company INT DEFAULT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_company (company_id),
    INDEX idx_candidate (candidate_id),
    INDEX idx_rating (rating),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Review Helpful Votes
CREATE TABLE IF NOT EXISTS review_helpful_votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    review_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES company_reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_vote (review_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PHASE 9: Search & Filters Optimization
-- =====================================================

-- Saved Searches
CREATE TABLE IF NOT EXISTS saved_searches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    search_name VARCHAR(100) NOT NULL,
    search_query TEXT NOT NULL,
    filters TEXT DEFAULT NULL,
    is_alert_enabled BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_candidate (candidate_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Add composite indexes for common queries
ALTER TABLE applications ADD INDEX idx_candidate_status (candidate_id, status);
ALTER TABLE applications ADD INDEX idx_job_status (job_id, status);
ALTER TABLE jobs ADD INDEX idx_location_type (location, job_type);
ALTER TABLE jobs ADD INDEX idx_status_created (status, created_at);

-- Full-text search indexes
ALTER TABLE jobs ADD FULLTEXT INDEX ft_title_description (title, description);
ALTER TABLE candidates ADD FULLTEXT INDEX ft_skills (skills);

-- =====================================================
-- END OF MIGRATION SCRIPT
-- =====================================================
