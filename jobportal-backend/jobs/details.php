<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$id = $_GET['id'] ?? 0;

if (!$id) {
    sendError('Job ID required', 400);
}

try {
    $pdo = getPDO();
    $sql = "SELECT j.*, c.company_name, c.website, c.address, c.logo_url, c.phone as company_phone 
            FROM jobs j 
            JOIN companies c ON j.employer_id = c.user_id 
            WHERE j.id = ?";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);
    $job = $stmt->fetch();

    if (!$job) {
        sendError('Job not found', 404);
    }
    
    sendSuccess('Job Details', $job);

} catch (Exception $e) {
    sendError('Error fetching job details', 500);
}
?>
