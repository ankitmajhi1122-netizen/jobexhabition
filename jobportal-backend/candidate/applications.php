<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'candidate') {
    sendError('Access denied. Candidates only.', 403);
}

try {
    $pdo = getPDO();
    
    $sql = "SELECT a.id as application_id, a.job_id, a.status, a.applied_at, 
            j.title, j.location, j.salary_min, j.salary_max, 

            COALESCE(c.company_name, 'Company') as company_name 
            FROM applications a 
            JOIN jobs j ON a.job_id = j.id 
            LEFT JOIN companies c ON j.employer_id = c.user_id 
            WHERE a.candidate_id = ? 
            ORDER BY a.applied_at DESC";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user['id']]);
    $applications = $stmt->fetchAll();
    
    sendSuccess('My Applications', $applications);

} catch (Exception $e) {
    sendError('Error fetching applications: ' . $e->getMessage(), 500);
}
?>
