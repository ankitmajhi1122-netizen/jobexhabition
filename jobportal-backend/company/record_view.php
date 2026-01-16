<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

// Handle CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    http_response_code(200);
    exit();
}

$user = authenticate();

if ($user['role'] !== 'company' && $user['role'] !== 'consultancy') {
    sendError('Access denied. Employers only.', 403);
}

// Get candidate_id from JSON input
$input = json_decode(file_get_contents("php://input"), true);
$candidateId = $input['candidate_id'] ?? 0;

if (!$candidateId) {
    sendError('Candidate ID required', 400);
}

try {
    $pdo = getPDO();

    // Prevent duplicate views spamming (e.g., only 1 view per 24 hours per candidate-company pair)
    $stmt = $pdo->prepare("
        SELECT id FROM profile_views 
        WHERE company_id = ? AND candidate_id = ? 
        AND viewed_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ");
    $stmt->execute([$user['id'], $candidateId]);
    
    if (!$stmt->fetch()) {
        // Log the view
        $insert = $pdo->prepare("INSERT INTO profile_views (company_id, candidate_id) VALUES (?, ?)");
        $insert->execute([$user['id'], $candidateId]);
        sendSuccess('View recorded');
    } else {
        sendSuccess('View already recorded recently');
    }

} catch (Exception $e) {
    // Silent fail to not disrupt UI
    error_log("Failed to record view: " . $e->getMessage());
    sendSuccess('View recording skipped'); 
}
?>
