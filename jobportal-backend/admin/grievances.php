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
    $sql = "SELECT g.*, u.email as reporter_email 
            FROM grievances g 
            JOIN users u ON g.user_id = u.id 
            ORDER BY g.created_at DESC";
    $stmt = $pdo->query($sql);
    $grievances = $stmt->fetchAll();
    
    sendSuccess('Grievances fetched', $grievances);

} elseif ($method === 'POST') {
    // Update status
    $input = json_decode(file_get_contents("php://input"), true);
    $id = $input['id'] ?? 0;
    $status = $input['status'] ?? ''; // resolved, dismissed

    if (!$id || !in_array($status, ['resolved', 'dismissed'])) {
        sendError('Invalid request');
    }

    $stmt = $pdo->prepare("UPDATE grievances SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);
    
    sendSuccess('Grievance status updated');

} else {
    sendError('Method not allowed', 405);
}
?>
