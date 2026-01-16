<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'admin') {
    sendError('Access denied. Admins only.', 403);
}

$pdo = getPDO();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $status = $_GET['status'] ?? 'pending';
    
    $sql = "SELECT u.id, u.email, u.role, u.status, u.created_at, 
            c.company_name, c.registration_no, c.website 
            FROM users u 
            LEFT JOIN companies c ON u.id = c.user_id 
            WHERE (u.role = 'company' OR u.role = 'consultancy')";
            
    if ($status) {
        $sql .= " AND u.status = ?";
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$status]);
    $users = $stmt->fetchAll();
    
    sendSuccess('Users fetched', $users);

} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $userId = $input['user_id'] ?? 0;
    $action = $input['action'] ?? ''; // approve, reject, suspend

    if (!$userId || !in_array($action, ['approve', 'reject', 'suspend', 'active'])) {
        sendError('Invalid request');
    }

    $newStatus = ($action === 'approve') ? 'active' : (($action === 'reject') ? 'rejected' : (($action === 'suspend') ? 'suspended' : 'active'));

    try {
        $stmt = $pdo->prepare("UPDATE users SET status = ? WHERE id = ?");
        $stmt->execute([$newStatus, $userId]);
        
        // If rejected, maybe send email? 
        // For now just update status.
        
        sendSuccess("User status updated to $newStatus");
    } catch (Exception $e) {
        sendError('Update failed: ' . $e->getMessage(), 500);
    }

} else {
    sendError('Method not allowed', 405);
}
?>
