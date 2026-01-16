<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'candidate') {
    sendError('Access denied. Only candidates can submit grievances.', 403);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = json_decode(file_get_contents("php://input"), true);
$subject = sanitize($input['subject'] ?? '');
$message = sanitize($input['message'] ?? '');
$targetId = isset($input['target_id']) ? (int)$input['target_id'] : null;

if (!$subject || !$message) {
    sendError('Subject and message are required');
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare("INSERT INTO grievances (user_id, target_id, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->execute([$user['id'], $targetId, $subject, $message]);
    
    sendSuccess('Grievance submitted successfully');

} catch (Exception $e) {
    sendError('Submission failed: ' . $e->getMessage(), 500);
}
?>
