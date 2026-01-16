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

if ($user['role'] !== 'candidate') {
    sendError('Access denied. Candidates only.', 403);
}

try {
    $pdo = getPDO();

    // Fetch views for this candidate
    // Join with Companies/Users to get Company Name
    $sql = "
        SELECT pv.viewed_at, c.company_name, c.logo_url
        FROM profile_views pv
        JOIN companies c ON pv.company_id = c.user_id
        WHERE pv.candidate_id = ?
        ORDER BY pv.viewed_at DESC
        LIMIT 20
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user['id']]);
    $views = $stmt->fetchAll();

    // Get Total Count (Unique Companies)
    $stmtCount = $pdo->prepare("SELECT COUNT(DISTINCT company_id) as total FROM profile_views WHERE candidate_id = ?");
    $stmtCount->execute([$user['id']]);
    $count = $stmtCount->fetch()['total'];

    sendSuccess('Profile views fetched', [
        'views' => $views,
        'total_unique_views' => $count
    ]);

} catch (Exception $e) {
    sendError('Failed to fetch profile views: ' . $e->getMessage(), 500);
}
?>
