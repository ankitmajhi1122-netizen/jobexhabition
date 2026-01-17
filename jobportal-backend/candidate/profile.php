<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

// Only authenticate if NOT part of the registration flow
if (!defined('IS_REGISTRATION')) {
    $user = authenticate();

    if ($user['role'] !== 'candidate') {
        sendError('Access denied. Candidates only.', 403);
    }
}

$pdo = getPDO();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch Profile
    $stmt = $pdo->prepare("SELECT * FROM candidates WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $profile = $stmt->fetch();
    
    // Add email from user table
    $profile['email'] = $user['email'];

    if (!$profile) {
        sendError('Profile not found', 404);
    }
    
    // If profile completeness is null or 0, calculate it now
    if (empty($profile['profile_completeness'])) {
        updateProfileCompleteness($pdo, $user['id']);
        // Fetch again to get updated completeness
        $stmt = $pdo->prepare("SELECT * FROM candidates WHERE user_id = ?");
        $stmt->execute([$user['id']]);
        $profile = $stmt->fetch();
        $profile['email'] = $user['email'];
    }
    
    sendSuccess('Candidate Profile', $profile);

} elseif ($method === 'POST') {
    // Update Profile
    $input = json_decode(file_get_contents("php://input"), true);
    
    // Basic Fields
    $fullName = sanitize($input['full_name'] ?? '');
    $phone = sanitize($input['phone'] ?? '');
    $skills = sanitize($input['skills'] ?? '');
    $experience = isset($input['experience_years']) ? (int)$input['experience_years'] : 0;
    $city = sanitize($input['city'] ?? '');
    $education = sanitize($input['education'] ?? '');
    
    // Extended Fields
    $currentRole = sanitize($input['current_role'] ?? '');
    $bio = sanitize($input['bio'] ?? '');
    $portfolioUrl = sanitize($input['portfolio_url'] ?? '');
    $linkedinUrl = sanitize($input['linkedin_url'] ?? '');
    $expectedSalary = sanitize($input['expected_salary'] ?? '');
    
    // New Database Fields
    $profileHeadline = sanitize($input['profile_headline'] ?? '');
    $profileVisibility = sanitize($input['profile_visibility'] ?? 'public');
    $showResumeToAll = isset($input['show_resume_to_all']) ? (int)$input['show_resume_to_all'] : 1;
    $allowRecruiterContact = isset($input['allow_recruiter_contact']) ? (int)$input['allow_recruiter_contact'] : 1;
    $anonymousMode = isset($input['anonymous_mode']) ? (int)$input['anonymous_mode'] : 0;
    $openToWork = isset($input['open_to_work']) ? (int)$input['open_to_work'] : 1;
    $openToWorkVisibility = sanitize($input['open_to_work_visibility'] ?? 'all');
    $jobSeekingStatus = sanitize($input['job_seeking_status'] ?? 'open_to_offers');
    $preferredSalaryMin = isset($input['preferred_salary_min']) ? (float)$input['preferred_salary_min'] : null;
    $preferredSalaryMax = isset($input['preferred_salary_max']) ? (float)$input['preferred_salary_max'] : null;
    $noticePeriod = sanitize($input['notice_period'] ?? '');
    $languages = sanitize($input['languages'] ?? '');
    $availability = sanitize($input['availability'] ?? 'immediate');
    $willingToRelocate = isset($input['willing_to_relocate']) ? (int)$input['willing_to_relocate'] : 0;
    $preferredJobTypes = sanitize($input['preferred_job_types'] ?? '');
    $preferredLocations = sanitize($input['preferred_locations'] ?? '');

    // Check if profile exists
    $stmt = $pdo->prepare("SELECT id FROM candidates WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $exists = $stmt->fetch();

    if ($exists) {
        $sql = "UPDATE candidates SET 
                full_name = ?, phone = ?, skills = ?, experience_years = ?, city = ?, education = ?, 
                current_role = ?, bio = ?, portfolio_url = ?, linkedin_url = ?, expected_salary = ?,
                profile_headline = ?, profile_visibility = ?, show_resume_to_all = ?, 
                allow_recruiter_contact = ?, anonymous_mode = ?, open_to_work = ?, 
                open_to_work_visibility = ?, job_seeking_status = ?, preferred_salary_min = ?, 
                preferred_salary_max = ?, notice_period = ?, languages = ?, availability = ?, 
                willing_to_relocate = ?, preferred_job_types = ?, preferred_locations = ?,
                last_profile_update = NOW()
                WHERE user_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $fullName, $phone, $skills, $experience, $city, $education, 
            $currentRole, $bio, $portfolioUrl, $linkedinUrl, $expectedSalary,
            $profileHeadline, $profileVisibility, $showResumeToAll, 
            $allowRecruiterContact, $anonymousMode, $openToWork, 
            $openToWorkVisibility, $jobSeekingStatus, $preferredSalaryMin, 
            $preferredSalaryMax, $noticePeriod, $languages, $availability, 
            $willingToRelocate, $preferredJobTypes, $preferredLocations,
            $user['id']
        ]);
        
        // Calculate and update profile completeness
        updateProfileCompleteness($pdo, $user['id']);
        
        sendSuccess('Profile updated successfully');
    } else {
        $sql = "INSERT INTO candidates (
                user_id, full_name, phone, skills, experience_years, city, education, 
                current_role, bio, portfolio_url, linkedin_url, expected_salary,
                profile_headline, profile_visibility, show_resume_to_all, 
                allow_recruiter_contact, anonymous_mode, open_to_work, 
                open_to_work_visibility, job_seeking_status, preferred_salary_min, 
                preferred_salary_max, notice_period, languages, availability, 
                willing_to_relocate, preferred_job_types, preferred_locations,
                last_profile_update
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $user['id'], $fullName, $phone, $skills, $experience, $city, $education, 
            $currentRole, $bio, $portfolioUrl, $linkedinUrl, $expectedSalary,
            $profileHeadline, $profileVisibility, $showResumeToAll, 
            $allowRecruiterContact, $anonymousMode, $openToWork, 
            $openToWorkVisibility, $jobSeekingStatus, $preferredSalaryMin, 
            $preferredSalaryMax, $noticePeriod, $languages, $availability, 
            $willingToRelocate, $preferredJobTypes, $preferredLocations
        ]);
        
        // Calculate and update profile completeness
        updateProfileCompleteness($pdo, $user['id']);
        
        sendSuccess('Profile created successfully');
    }

} else {
    sendError('Method not allowed', 405);
}

// Include profile functions
require_once __DIR__ . '/candidate_functions.php';
?>
