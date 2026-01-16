<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = json_decode(file_get_contents("php://input"), true);
$token = $input['token'] ?? '';
$newPassword = $input['password'] ?? '';

if (!$token || !$newPassword) {
    sendError('Token and new password are required');
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare("SELECT id, reset_expiry FROM users WHERE reset_token = ?");
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        sendError('Invalid token', 400);
    }

    if (strtotime($user['reset_expiry']) < time()) {
        sendError('Token expired', 400);
    }

    $hash = password_hash($newPassword, PASSWORD_BCRYPT);
    
    $stmt = $pdo->prepare("UPDATE users SET password_hash = ?, reset_token = NULL, reset_expiry = NULL WHERE id = ?");
    $stmt->execute([$hash, $user['id']]);

    sendSuccess('Password reset successfully');

} catch (Exception $e) {
    sendError('Reset failed: ' . $e->getMessage(), 500);
}
?>
