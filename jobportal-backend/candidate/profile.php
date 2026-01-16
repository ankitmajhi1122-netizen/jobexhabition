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
    
    sendSuccess('Candidate Profile', $profile);

} elseif ($method === 'POST') {
    // Update Profile
    $input = json_decode(file_get_contents("php://input"), true);
    
    $fullName = sanitize($input['full_name'] ?? '');
    $phone = sanitize($input['phone'] ?? '');
    $skills = sanitize($input['skills'] ?? '');
    $experience = isset($input['experience_years']) ? (int)$input['experience_years'] : 0;
    $city = sanitize($input['city'] ?? '');
    $education = sanitize($input['education'] ?? '');
    
    // New Fields
    $currentRole = sanitize($input['current_role'] ?? '');
    $bio = sanitize($input['bio'] ?? '');
    $portfolioUrl = sanitize($input['portfolio_url'] ?? '');
    $linkedinUrl = sanitize($input['linkedin_url'] ?? '');
    $expectedSalary = sanitize($input['expected_salary'] ?? '');

    // Check if profile exists
    $stmt = $pdo->prepare("SELECT id FROM candidates WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $exists = $stmt->fetch();

    if ($exists) {
        $sql = "UPDATE candidates SET full_name = ?, phone = ?, skills = ?, experience_years = ?, city = ?, education = ?, `current_role` = ?, bio = ?, portfolio_url = ?, linkedin_url = ?, expected_salary = ? WHERE user_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$fullName, $phone, $skills, $experience, $city, $education, $currentRole, $bio, $portfolioUrl, $linkedinUrl, $expectedSalary, $user['id']]);
        sendSuccess('Profile updated successfully');
    } else {
        $sql = "INSERT INTO candidates (user_id, full_name, phone, skills, experience_years, city, education, `current_role`, bio, portfolio_url, linkedin_url, expected_salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id'], $fullName, $phone, $skills, $experience, $city, $education, $currentRole, $bio, $portfolioUrl, $linkedinUrl, $expectedSalary]);
        sendSuccess('Profile created successfully');
    }

} else {
    sendError('Method not allowed', 405);
}
?>
