<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';
require_once __DIR__ . '/../config/mailer.php';

$user = authenticate();

if ($user['role'] !== 'candidate') {
    sendError('Access denied. Candidates only.', 403);
}

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
$jobId = $input['job_id'] ?? 0;

if (!$jobId) {
    sendError('Job ID required');
}

try {
    $pdo = getPDO();
    
    // Check if job exists and get details for email
    $stmt = $pdo->prepare("
        SELECT j.id, j.title, c.company_name, u.email as employer_email
        FROM jobs j 
        JOIN companies c ON j.employer_id = c.user_id 
        JOIN users u ON j.employer_id = u.id
        WHERE j.id = ? AND j.status = 'active'
    ");
    $stmt->execute([$jobId]);
    $job = $stmt->fetch();

    if (!$job) {
        sendError('Job not found or inactive', 404);
    }

    // Check if already applied
    $stmt = $pdo->prepare("SELECT id FROM applications WHERE job_id = ? AND candidate_id = ?");
    $stmt->execute([$jobId, $user['id']]);
    if ($stmt->fetch()) {
        sendError('You have already applied for this job', 409);
    }

    // Apply
    $stmt = $pdo->prepare("INSERT INTO applications (job_id, candidate_id) VALUES (?, ?)");
    $stmt->execute([$jobId, $user['id']]);

    // Send Email to Candidate
    try {
        $mail = makeMailer();
        $mail->addAddress($user['email']); // $user is from authenticate()
        $mail->Subject = "Application Received: " . $job['title'];
        $mail->Body = "
            <h2>Application Confirmed</h2>
            <p>Dear Candidate,</p>
            <p>You have successfully applied for the position of <b>{$job['title']}</b> at <b>{$job['company_name']}</b>.</p>
            <p>The employer will review your application and updated status will be reflected in your dashboard.</p>
            <p>Good Luck!</p>
            <br>
            <p><i>- Job Exhibition Team</i></p>
        ";
        $mail->send();
    } catch (Exception $emailError) {
        // Log error but don't fail the response
        error_log("Email sending failed: " . $emailError->getMessage());
    }
    
    sendSuccess('Applied successfully');

} catch (Exception $e) {
    sendError('Application failed: ' . $e->getMessage(), 500);
}
?>
