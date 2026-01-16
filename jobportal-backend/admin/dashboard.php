<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'admin') {
    sendError('Access denied. Admins only.', 403);
}

try {
    $pdo = getPDO();
    
    $stats = [];
    
    // Total Users
    $stmt = $pdo->query("SELECT role, COUNT(*) as count FROM users GROUP BY role");
    $stats['users'] = $stmt->fetchAll();
    
    // Total Jobs
    $stmt = $pdo->query("SELECT status, COUNT(*) as count FROM jobs GROUP BY status");
    $stats['jobs'] = $stmt->fetchAll();
    
    // Pending Approvals
    $stmt = $pdo->query("SELECT count(*) as count FROM users WHERE status = 'pending' AND (role = 'company' OR role = 'consultancy')");
    $stats['pending_approvals'] = $stmt->fetchColumn();
    
    // Open Grievances
    $stmt = $pdo->query("SELECT count(*) as count FROM grievances WHERE status = 'open'");
    $stats['open_grievances'] = $stmt->fetchColumn();
    
    sendSuccess('Admin Dashboard Stats', $stats);

} catch (Exception $e) {
    sendError('Error fetching stats: ' . $e->getMessage(), 500);
}
?>
