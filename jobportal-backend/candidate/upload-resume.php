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

if (!isset($_FILES['resume']) || $_FILES['resume']['error'] !== UPLOAD_ERR_OK) {
    sendError('No file uploaded or upload error');
}

$file = $_FILES['resume'];
$allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
$maxSize = 5 * 1024 * 1024; // 5MB

if (!in_array($file['type'], $allowedTypes)) {
    sendError('Invalid file type. Only PDF and DOC/DOCX allowed.');
}

if ($file['size'] > $maxSize) {
    sendError('File too large. Max 5MB.');
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'resume_' . $user['id'] . '_' . time() . '.' . $ext;
$uploadPath = __DIR__ . '/../uploads/resumes/' . $filename;

// Ensure directory exists (redundant if task created it, but safe)
if (!is_dir(__DIR__ . '/../uploads/resumes/')) {
    mkdir(__DIR__ . '/../uploads/resumes/', 0777, true);
}

if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
    // Update DB
    $pdo = getPDO();
    $webUrl = '/uploads/resumes/' . $filename; // Relative URL
    
    $stmt = $pdo->prepare("UPDATE candidates SET resume_url = ? WHERE user_id = ?");
    $stmt->execute([$webUrl, $user['id']]);
    
    sendSuccess('Resume uploaded successfully', ['url' => $webUrl]);
} else {
    sendError('Failed to move uploaded file', 500);
}
?>
