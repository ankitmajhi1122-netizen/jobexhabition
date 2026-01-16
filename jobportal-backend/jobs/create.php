<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'company' && $user['role'] !== 'consultancy') {
    sendError('Access denied. Employers only.', 403);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = json_decode(file_get_contents("php://input"), true);

// Validation
$title = sanitize($input['title'] ?? '');
$description = sanitize($input['description'] ?? ''); // Description often has HTML, ideally we sanitize malicious tags but keep formatting. `sanitize` strips all tags.
// For now, sticking to `sanitize` which strips tags, which is safer but limits rich text. 
// If rich text needed, we need a better purifier (e.g., HTMLPurifier).
// Prompt says "Input validation & sanitization".
// "Do NOT skip validation or security".
// I will keep strip_tags for safety unless user asked for rich text edit.

$category = sanitize($input['category'] ?? '');
$jobType = sanitize($input['job_type'] ?? 'permanent');
$location = sanitize($input['location'] ?? '');
$salaryMin = (float)($input['salary_min'] ?? 0);
$salaryMax = (float)($input['salary_max'] ?? 0);
$expReq = sanitize($input['experience_required'] ?? '');

$isConsultancyJob = ($user['role'] === 'consultancy');
$serviceCharge = $isConsultancyJob ? sanitize($input['service_charge'] ?? '') : null;
$termsConditions = $isConsultancyJob ? sanitize($input['terms_conditions'] ?? '') : null;

if (!$title || !$description || !$location) {
    sendError('Title, description, and location are required');
}

if ($isConsultancyJob && (!$serviceCharge || !$termsConditions)) {
    sendError('Consultancies must provide Service Charge and Terms & Conditions', 400);
}

$pdo = getPDO();

// Check Job Limit for Companies
if ($user['role'] === 'company') {
    $stmt = $pdo->prepare("SELECT jobs_posted_count, subscription_plan FROM companies WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $companyData = $stmt->fetch();

    if ($companyData['subscription_plan'] === 'free' && $companyData['jobs_posted_count'] >= 3) {
        sendError('Free limit reached (3 jobs). Please upgrade to post more.', 403);
    }
}

try {
    $pdo->beginTransaction();

    $sql = "INSERT INTO jobs (employer_id, title, description, category, job_type, location, salary_min, salary_max, experience_required, is_consultancy_job, service_charge, terms_conditions, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $user['id'], $title, $description, $category, $jobType, $location, $salaryMin, $salaryMax, $expReq, 
        $isConsultancyJob ? 1 : 0, $serviceCharge, $termsConditions
    ]);
    
    $jobId = $pdo->lastInsertId();

    // Increment job count
    $stmt = $pdo->prepare("UPDATE companies SET jobs_posted_count = jobs_posted_count + 1 WHERE user_id = ?");
    $stmt->execute([$user['id']]);

    $pdo->commit();
    sendSuccess('Job posted successfully', ['job_id' => $jobId]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    sendError('Job posting failed: ' . $e->getMessage(), 500);
}
?>
