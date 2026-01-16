<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'candidate') {
    sendError('Access denied. Candidates only.', 403);
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

// Function to calculate profile completeness percentage
function updateProfileCompleteness($pdo, $userId) {
    $stmt = $pdo->prepare("SELECT * FROM candidates WHERE user_id = ?");
    $stmt->execute([$userId]);
    $profile = $stmt->fetch();
    
    if (!$profile) return;
    
    $completeness = 0;
    $fields = [
        'full_name' => 10,
        'phone' => 5,
        'city' => 5,
        'current_role' => 10,
        'bio' => 10,
        'skills' => 10,
        'experience_years' => 5,
        'education' => 10,
        'portfolio_url' => 5,
        'linkedin_url' => 5,
        'resume_url' => 15,
        'photo_url' => 10
    ];
    
    foreach ($fields as $field => $weight) {
        if (!empty($profile[$field]) && $profile[$field] !== '0') {
            $completeness += $weight;
        }
    }
    
    // Bonus points for having work experience, education records, skills
    $stmtWork = $pdo->prepare("SELECT COUNT(*) as count FROM work_experience WHERE candidate_id = ?");
    $stmtWork->execute([$userId]);
    if ($stmtWork->fetch()['count'] > 0) {
        $completeness = min(100, $completeness + 5);
    }
    
    $stmtEdu = $pdo->prepare("SELECT COUNT(*) as count FROM education WHERE candidate_id = ?");
    $stmtEdu->execute([$userId]);
    if ($stmtEdu->fetch()['count'] > 0) {
        $completeness = min(100, $completeness + 5);
    }
    
    $stmtSkills = $pdo->prepare("SELECT COUNT(*) as count FROM candidate_skills WHERE candidate_id = ?");
    $stmtSkills->execute([$userId]);
    if ($stmtSkills->fetch()['count'] > 0) {
        $completeness = min(100, $completeness + 5);
    }
    
    // Update completeness
    $stmt = $pdo->prepare("UPDATE candidates SET profile_completeness = ? WHERE user_id = ?");
    $stmt->execute([$completeness, $userId]);
}
?>
