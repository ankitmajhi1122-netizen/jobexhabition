<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

// Handle Preflight OPTIONS request GLOBALLY for any file including this middleware
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    http_response_code(200);
    exit();
}

function authenticate() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        sendError('Unauthorized: No token provided', 401);
    }

    $token = $matches[1];

    try {
        $pdo = getPDO();
        $stmt = $pdo->prepare("SELECT id, role, email, status FROM users WHERE api_token = ?");
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if (!$user) {
            sendError('Unauthorized: Invalid token', 401);
        }

        return $user; // Return user info to the controller

    } catch (Exception $e) {
        sendError('Authentication error', 500);
    }
}
?>
