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
$password = $input['password'] ?? '';

if (!$email || !$password) {
    sendError('Email and Password are required');
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare("SELECT id, password_hash, role, is_verified, status FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendError('Invalid credentials', 401);
    }

    if ($user['is_verified'] == 0) {
        sendError('Email not verified. Please verify OTP.', 403);
    }

    if ($user['status'] === 'suspended' || $user['status'] === 'rejected') {
        sendError('Account is ' . $user['status'], 403);
    }
    
    // Check if company/consultancy is pending? 
    // If Admin needs to approve, we might block login or allow login but limited access.
    // Let's assume login is allowed but actions are restricted, OR block login.
    // "Approve / reject companies & consultancies" -> usually implies they can't do much until approved.
    if (($user['role'] === 'company' || $user['role'] === 'consultancy') && $user['status'] === 'pending') {
         sendError('Account pending approval by Admin', 403);
    }

    // Generate Token
    $token = bin2hex(random_bytes(32));
    $stmt = $pdo->prepare("UPDATE users SET api_token = ? WHERE id = ?");
    $stmt->execute([$token, $user['id']]);

    sendSuccess('Login successful', [
        'token' => $token,
        'role' => $user['role'],
        'user_id' => $user['id']
    ]);

} catch (Exception $e) {
    sendError('Login failed: ' . $e->getMessage(), 500);
}
?>
