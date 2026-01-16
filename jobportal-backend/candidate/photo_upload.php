<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'candidate') {
    sendError('Access denied. Candidates only.', 403);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    sendError('No photo uploaded or upload error');
}

$file = $_FILES['photo'];
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
$maxSize = 2 * 1024 * 1024; // 2MB

// Validate file type
if (!in_array($file['type'], $allowedTypes)) {
    sendError('Invalid file type. Only JPG, PNG, and WEBP allowed.');
}

// Validate file size
if ($file['size'] > $maxSize) {
    sendError('File too large. Max 2MB.');
}

// Generate unique filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'photo_' . $user['id'] . '_' . time() . '.' . $ext;
$uploadPath = __DIR__ . '/../uploads/photos/' . $filename;

// Ensure directory exists
if (!is_dir(__DIR__ . '/../uploads/photos/')) {
    mkdir(__DIR__ . '/../uploads/photos/', 0777, true);
}

// Delete old photo if exists
try {
    $pdo = getPDO();
    $stmt = $pdo->prepare("SELECT photo_url FROM candidates WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $oldPhoto = $stmt->fetch();
    
    if ($oldPhoto && $oldPhoto['photo_url']) {
        $oldPath = __DIR__ . '/../' . $oldPhoto['photo_url'];
        if (file_exists($oldPath)) {
            unlink($oldPath);
        }
    }
} catch (Exception $e) {
    // Continue even if deletion fails
}

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
    // Update database
    $webUrl = '/uploads/photos/' . $filename;
    
    $stmt = $pdo->prepare("UPDATE candidates SET photo_url = ? WHERE user_id = ?");
    $stmt->execute([$webUrl, $user['id']]);
    
    sendSuccess('Photo uploaded successfully', ['url' => $webUrl]);
} else {
    sendError('Failed to move uploaded file', 500);
}
?>
