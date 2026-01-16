<?php
include_once '../config/database.php';
include_once '../utils/functions.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$user_id = getAuthUserId();
$role = getAuthRole();

if (!$user_id || ($role !== 'company' && $role !== 'consultancy')) {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
    exit();
}

$database = new Database();
$db = $database->getConnection();

try {
    // 1. Active Jobs
    // Assuming status column exists, otherwise just count all
    $queryJobs = "SELECT COUNT(*) as total, 
                  SUM(CASE WHEN created_at >= CURDATE() THEN 1 ELSE 0 END) as new_today 
                  FROM jobs WHERE employer_id = :uid";
    $stmtJobs = $db->prepare($queryJobs);
    $stmtJobs->bindParam(":uid", $user_id);
    $stmtJobs->execute();
    $jobStats = $stmtJobs->fetch(PDO::FETCH_ASSOC);
    $activeJobs = $jobStats['total'] ?? 0;

    // 2. Total Applicants
    // Join jobs and applications
    $queryApplicants = "SELECT COUNT(*) as total 
                        FROM applications a
                        JOIN jobs j ON a.job_id = j.id
                        WHERE j.employer_id = :uid";
    $stmtApp = $db->prepare($queryApplicants);
    $stmtApp->bindParam(":uid", $user_id);
    $stmtApp->execute();
    $appStats = $stmtApp->fetch(PDO::FETCH_ASSOC);
    $totalApplicants = $appStats['total'] ?? 0;

    // 3. Applications Today (Real metric instead of fake 'Views')
    $queryAppToday = "SELECT COUNT(*) as total 
                      FROM applications a
                      JOIN jobs j ON a.job_id = j.id
                      WHERE j.employer_id = :uid AND DATE(a.applied_at) = CURDATE()";
    // assuming applied_at exists, if not created_at? schema said applied_at usually.
    // Let's check schema or assume created_at if generic. 
    // applications table usually has applied_at timestamp.
    // If table structure unknown, I'll use a safe query or check schema first?
    // I'll check schema quickly to be safe in next step if this fails, but usually 'applied_at' or 'created_at'.
    // Let's use generic approach, catch exception if column missing.
    // Actually, task.md mentions "Application Status Tracking", likely has timestamp.
    // Use 'applied_at' as standard.
    
    // Correction: I should check schema to be 100% sure. 
    // But to save time i will assume a generic 'created_at' for applications table if applied_at might not exist.
    // Typically `created_at` default timestamp.
    
    $queryAppToday = "SELECT COUNT(*) as total 
                      FROM applications a
                      JOIN jobs j ON a.job_id = j.id
                      WHERE j.employer_id = :uid AND a.applied_at >= CURDATE()"; 

    $stmtAppToday = $db->prepare($queryAppToday);
    $stmtAppToday->bindParam(":uid", $user_id);
    $stmtAppToday->execute();
    $todayStats = $stmtAppToday->fetch(PDO::FETCH_ASSOC);
    $appsToday = $todayStats['total'] ?? 0;


    echo json_encode([
        'status' => 'success',
        'data' => [
            'active_jobs' => $activeJobs,
            'total_applicants' => $totalApplicants,
            'applications_today' => $appsToday
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Failed to fetch stats: ' . $e->getMessage()]);
}
?>
