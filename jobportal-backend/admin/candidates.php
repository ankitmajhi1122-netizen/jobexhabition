<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'admin') {
    sendError('Access denied. Admins only.', 403);
}

$pdo = getPDO();
$search = $_GET['search'] ?? '';

try {
    $sql = "SELECT u.id, u.email, u.status, u.created_at, 
            c.full_name, c.phone, c.skills, c.experience_years, c.city, c.resume_url 
            FROM users u 
            JOIN candidates c ON u.id = c.user_id 
            WHERE u.role = 'candidate'";

    $params = [];
    if ($search) {
        $sql .= " AND (c.full_name LIKE ? OR u.email LIKE ?)";
        $params[] = "%$search%";
        $params[] = "%$search%";
    }
    
    $sql .= " ORDER BY u.created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $candidates = $stmt->fetchAll();
    
    sendSuccess('Candidates fetched', $candidates);

} catch (Exception $e) {
    sendError('Error fetching candidates: ' . $e->getMessage(), 500);
}
?>
