<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'company' && $user['role'] !== 'consultancy') {
    sendError('Access denied. Employers only.', 403);
}

$jobId = $_GET['job_id'] ?? 0;

if (!$jobId) {
    sendError('Job ID required', 400);
}

try {
    $pdo = getPDO();
    
    // Check if job belongs to employer
    $stmt = $pdo->prepare("SELECT id FROM jobs WHERE id = ? AND employer_id = ?");
    $stmt->execute([$jobId, $user['id']]);
    if (!$stmt->fetch()) {
        sendError('Job not found or access denied', 404);
    }

    $sql = "SELECT a.id as application_id, a.candidate_id, a.status, a.applied_at, 
            c.full_name, c.phone, c.skills, c.experience_years, c.resume_url, c.city, c.education,
            c.`current_role`, c.bio, c.portfolio_url, c.linkedin_url, c.expected_salary, 
            u.email 
            FROM applications a 
            JOIN users u ON a.candidate_id = u.id 
            JOIN candidates c ON u.id = c.user_id 
            WHERE a.job_id = ?";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$jobId]);
    $applicants = $stmt->fetchAll();
    
    sendSuccess('Applicants fetched', $applicants);

} catch (Exception $e) {
    sendError('Error fetching applicants: ' . $e->getMessage(), 500);
}
?>
