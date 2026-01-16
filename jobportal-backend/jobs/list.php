<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$pdo = getPDO();

$search = $_GET['search'] ?? '';
$location = $_GET['location'] ?? '';
$category = $_GET['category'] ?? '';
$type = $_GET['type'] ?? '';

$sql = "SELECT j.id, j.title, j.location, j.job_type, j.salary_min, j.salary_max, j.created_at, c.company_name, c.logo_url, j.is_consultancy_job 
        FROM jobs j 
        JOIN companies c ON j.employer_id = c.user_id 
        JOIN users u ON c.user_id = u.id 
        WHERE j.status = 'active' AND u.status = 'active'";

$params = [];

if ($search) {
    $sql .= " AND (j.title LIKE ? OR c.company_name LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

if ($location) {
    $sql .= " AND j.location LIKE ?";
    $params[] = "%$location%";
}

if ($category) {
    $sql .= " AND j.category = ?";
    $params[] = $category;
}

if ($type) {
    $sql .= " AND j.job_type = ?";
    $params[] = $type;
}

$sql .= " ORDER BY j.created_at DESC LIMIT 50";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $jobs = $stmt->fetchAll();
    
    sendSuccess('Jobs fetched successfully', $jobs);
} catch (Exception $e) {
    sendError('Error fetching jobs: ' . $e->getMessage(), 500);
}
?>
