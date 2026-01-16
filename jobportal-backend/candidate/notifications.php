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

try {
    if ($method === 'GET') {
        // Fetch notifications
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
        $onlyUnread = isset($_GET['unread']) && $_GET['unread'] === 'true';
        
        $sql = "SELECT * FROM notifications 
                WHERE user_id = ?";
        
        if ($onlyUnread) {
            $sql .= " AND is_read = 0";
        }
        
        $sql .= " ORDER BY created_at DESC LIMIT ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id'], $limit]);
        $notifications = $stmt->fetchAll();
        
        // Get unread count
        $stmtCount = $pdo->prepare("SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = 0");
        $stmtCount->execute([$user['id']]);
        $unreadCount = $stmtCount->fetch()['unread_count'];
        
        sendSuccess('Notifications retrieved', [
            'notifications' => $notifications,
            'unread_count' => $unreadCount
        ]);
        
    } elseif ($method === 'PUT') {
        // Mark as read
        $input = json_decode(file_get_contents("php://input"), true);
        $action = $input['action'] ?? '';
        
        if ($action === 'mark_read') {
            $id = isset($input['id']) ? (int)$input['id'] : 0;
            
            if ($id) {
                // Mark single notification as read
                $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1, read_at = NOW() WHERE id = ? AND user_id = ?");
                $stmt->execute([$id, $user['id']]);
            } else {
                // Mark all as read
                $stmt = $pdo->prepare("UPDATE notifications SET is_read = 1, read_at = NOW() WHERE user_id = ? AND is_read = 0");
                $stmt->execute([$user['id']]);
            }
            
            sendSuccess('Notification(s) marked as read');
            
        } else {
            sendError('Invalid action');
        }
        
    } elseif ($method === 'DELETE') {
        // Delete notification
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Notification ID is required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM notifications WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess('Notification deleted');
        } else {
            sendError('Notification not found', 404);
        }
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
