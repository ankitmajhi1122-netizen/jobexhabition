<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

// Handle Preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = json_decode(file_get_contents("php://input"), true);
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
$otp = $input['otp'] ?? '';

if (!$email || !$otp) {
    sendError('Email and OTP are required');
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare("SELECT id, otp_code, otp_expiry FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        sendError('User not found', 404);
    }

    if ($user['otp_code'] !== $otp) {
        sendError('Invalid OTP', 400);
    }

    if (strtotime($user['otp_expiry']) < time()) {
        sendError('OTP expired', 400);
    }

    // OTP Valid
    $stmt = $pdo->prepare("UPDATE users SET is_verified = 1, otp_code = NULL, otp_expiry = NULL WHERE id = ?");
    $stmt->execute([$user['id']]);

    sendSuccess('Email verified successfully');

} catch (Exception $e) {
    sendError('Verification failed: ' . $e->getMessage(), 500);
}
?>
