-- =====================================================
-- Utility Functions & Stored Procedures
-- Migration Script 003
-- =====================================================

DELIMITER //

-- =====================================================
-- Function: Calculate Profile Completeness
-- =====================================================

DROP FUNCTION IF EXISTS calculate_profile_completeness//

CREATE FUNCTION calculate_profile_completeness(p_candidate_id INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE completeness INT DEFAULT 0;
    DECLARE has_photo, has_resume, has_bio, has_skills, has_experience, 
            has_education, has_location, has_phone, has_portfolio, 
            has_linkedin, has_salary INT DEFAULT 0;
    
    -- Check each field (10 points each for total 100)
    SELECT 
        CASE WHEN photo_url IS NOT NULL AND photo_url != '' THEN 10 ELSE 0 END,
        CASE WHEN resume_url IS NOT NULL AND resume_url != '' THEN 10 ELSE 0 END,
        CASE WHEN bio IS NOT NULL AND bio != '' THEN 10 ELSE 0 END,
        CASE WHEN skills IS NOT NULL AND skills != '' THEN 10 ELSE 0 END,
        CASE WHEN experience_years > 0 THEN 10 ELSE 0 END,
        CASE WHEN education IS NOT NULL AND education != '' THEN 10 ELSE 0 END,
        CASE WHEN city IS NOT NULL AND city != '' THEN 10 ELSE 0 END,
        CASE WHEN phone IS NOT NULL AND phone != '' THEN 10 ELSE 0 END,
        CASE WHEN portfolio_url IS NOT NULL AND portfolio_url != '' THEN 10 ELSE 0 END,
        CASE WHEN linkedin_url IS NOT NULL AND linkedin_url != '' THEN 10 ELSE 0 END
    INTO has_photo, has_resume, has_bio, has_skills, has_experience, 
         has_education, has_location, has_phone, has_portfolio, has_linkedin
    FROM candidates 
    WHERE user_id = p_candidate_id;
    
    SET completeness = has_photo + has_resume + has_bio + has_skills + 
                       has_experience + has_education + has_location + 
                       has_phone + has_portfolio + has_linkedin;
    
    RETURN completeness;
END//

-- =====================================================
-- Procedure: Update Profile Completeness for All
-- =====================================================

DROP PROCEDURE IF EXISTS update_all_profile_completeness//

CREATE PROCEDURE update_all_profile_completeness()
BEGIN
    UPDATE candidates 
    SET profile_completeness = calculate_profile_completeness(user_id);
END//

-- =====================================================
-- Procedure: Check and Award Achievements
-- =====================================================

DROP PROCEDURE IF EXISTS check_candidate_achievements//

CREATE PROCEDURE check_candidate_achievements(IN p_candidate_id INT)
BEGIN
    DECLARE v_profile_completeness INT;
    DECLARE v_applications_count INT;
    DECLARE v_profile_views INT;
    DECLARE v_skills_count INT;
    
    -- Get candidate stats
    SELECT profile_completeness INTO v_profile_completeness
    FROM candidates WHERE user_id = p_candidate_id;
    
    SELECT COUNT(*) INTO v_applications_count
    FROM applications WHERE candidate_id = p_candidate_id;
    
    SELECT COUNT(DISTINCT company_id) INTO v_profile_views
    FROM profile_views WHERE candidate_id = p_candidate_id;
    
    -- Profile Completeness Achievements
    IF v_profile_completeness >= 50 THEN
        INSERT IGNORE INTO candidate_achievements (candidate_id, achievement_id)
        SELECT p_candidate_id, id FROM achievements WHERE name = 'Profile Pro';
    END IF;
    
    IF v_profile_completeness >= 100 THEN
        INSERT IGNORE INTO candidate_achievements (candidate_id, achievement_id)
        SELECT p_candidate_id, id FROM achievements WHERE name = 'Profile Master';
    END IF;
    
    -- Application Count Achievements
    IF v_applications_count >= 1 THEN
        INSERT IGNORE INTO candidate_achievements (candidate_id, achievement_id)
        SELECT p_candidate_id, id FROM achievements WHERE name = 'First Step';
    END IF;
    
    IF v_applications_count >= 5 THEN
        INSERT IGNORE INTO candidate_achievements (candidate_id, achievement_id)
        SELECT p_candidate_id, id FROM achievements WHERE name = 'Job Seeker';
    END IF;
    
    IF v_applications_count >= 25 THEN
        INSERT IGNORE INTO candidate_achievements (candidate_id, achievement_id)
        SELECT p_candidate_id, id FROM achievements WHERE name = 'Go-Getter';
    END IF;
    
    IF v_applications_count >= 50 THEN
        INSERT IGNORE INTO candidate_achievements (candidate_id, achievement_id)
        SELECT p_candidate_id, id FROM achievements WHERE name = 'Persistent Hunter';
    END IF;
    
    -- Profile View Achievements
    IF v_profile_views >= 10 THEN
        INSERT IGNORE INTO candidate_achievements (candidate_id, achievement_id)
        SELECT p_candidate_id, id FROM achievements WHERE name = 'Networker';
    END IF;
    
    IF v_profile_views >= 50 THEN
        INSERT IGNORE INTO candidate_achievements (candidate_id, achievement_id)
        SELECT p_candidate_id, id FROM achievements WHERE name = 'Popular Profile';
    END IF;
    
END//

-- =====================================================
-- Trigger: Auto-update profile completeness on change
-- =====================================================

DROP TRIGGER IF EXISTS candidates_after_update//

CREATE TRIGGER candidates_after_update
AFTER UPDATE ON candidates
FOR EACH ROW
BEGIN
    -- Update profile completeness
    SET NEW.profile_completeness = calculate_profile_completeness(NEW.user_id);
    SET NEW.last_profile_update = NOW();
    
    -- Check for achievements
    CALL check_candidate_achievements(NEW.user_id);
END//

-- =====================================================
-- Trigger: Create application timeline entry
-- =====================================================

DROP TRIGGER IF EXISTS applications_after_insert//

CREATE TRIGGER applications_after_insert
AFTER INSERT ON applications
FOR EACH ROW
BEGIN
    INSERT INTO application_timeline (application_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Application submitted');
    
    -- Create notification for candidate
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
        NEW.candidate_id, 
        'application_status', 
        'Application Submitted', 
        'Your application has been successfully submitted',
        CONCAT('/candidate/applications/', NEW.id)
    );
END//

-- =====================================================
-- Trigger: Track application status changes
-- =====================================================

DROP TRIGGER IF EXISTS applications_after_update//

CREATE TRIGGER applications_after_update
AFTER UPDATE ON applications
FOR EACH ROW
BEGIN
    -- If status changed
    IF OLD.status != NEW.status THEN
        -- Add to timeline
        INSERT INTO application_timeline (application_id, status, notes)
        VALUES (NEW.id, NEW.status, CONCAT('Status changed from ', OLD.status, ' to ', NEW.status));
        
        -- Update status timestamp
        UPDATE applications 
        SET status_updated_at = NOW() 
        WHERE id = NEW.id;
        
        -- Create notification for candidate
        INSERT INTO notifications (user_id, type, title, message, link)
        VALUES (
            NEW.candidate_id,
            'application_status',
            CONCAT('Application ', NEW.status),
            CONCAT('Your application status has been updated to: ', NEW.status),
            CONCAT('/candidate/applications/', NEW.id)
        );
    END IF;
END//

-- =====================================================
-- Trigger: Notify candidate of profile view
-- =====================================================

DROP TRIGGER IF EXISTS profile_views_after_insert//

CREATE TRIGGER profile_views_after_insert
AFTER INSERT ON profile_views
FOR EACH ROW
BEGIN
    DECLARE company_name_var VARCHAR(255);
    
    -- Get company name
    SELECT c.company_name INTO company_name_var
    FROM companies c
    WHERE c.user_id = NEW.company_id;
    
    -- Create notification
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
        NEW.candidate_id,
        'profile_view',
        'Profile Viewed',
        CONCAT(COALESCE(company_name_var, 'A company'), ' viewed your profile'),
        '/candidate/profile'
    );
END//

DELIMITER ;

-- =====================================================
-- Create indexes for better performance
-- =====================================================

-- Create index on profile_completeness for filtering
CREATE INDEX idx_profile_completeness ON candidates(profile_completeness);

-- Create index on open_to_work for job matching
CREATE INDEX idx_open_to_work ON candidates(open_to_work, job_seeking_status);

-- =====================================================
-- Run initial profile completeness calculation
-- =====================================================

-- Update all existing profiles
CALL update_all_profile_completeness();

-- =====================================================
-- END OF UTILITY FUNCTIONS
-- =====================================================
