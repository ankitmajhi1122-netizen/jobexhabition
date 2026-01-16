<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';
require_once __DIR__ . '/../config/mailer.php';

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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = json_decode(file_get_contents("php://input"), true);
$applicationId = $input['application_id'] ?? 0;
$newStatus = $input['status'] ?? '';

if (!$applicationId || !$newStatus) {
    sendError('Application ID and Status are required');
}

$validStatuses = ['shortlisted', 'rejected', 'viewed', 'hired'];
if (!in_array(strtolower($newStatus), $validStatuses)) {
    sendError('Invalid status value');
}

try {
    $pdo = getPDO();

    // 1. Verify this application belongs to a job posted by this company
    // AND fetch candidate/job details for the email
    $sql = "SELECT a.id, a.candidate_id, u.email as candidate_email, j.title as job_title, c.company_name
            FROM applications a
            JOIN jobs j ON a.job_id = j.id
            JOIN users u ON a.candidate_id = u.id
            JOIN companies c ON j.employer_id = c.user_id
            WHERE a.id = ? AND j.employer_id = ?";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$applicationId, $user['id']]);
    $details = $stmt->fetch();

    if (!$details) {
        sendError('Application not found or access denied', 404);
    }

    // 2. Update Status
    $stmtUpdate = $pdo->prepare("UPDATE applications SET status = ? WHERE id = ?");
    $stmtUpdate->execute([$newStatus, $applicationId]);

    // 3. Send Email to Candidate
    try {
        $mail = makeMailer();
        $mail->addAddress($details['candidate_email']);
        $mail->Subject = "Application Update: " . $details['job_title'];
        
        $statusMessage = "";
        if (strtolower($newStatus) === 'shortlisted') {
            $statusMessage = "<p style='color: green;'>Congratulations! You have been <b>Shortlisted</b> for the position.</p>
                              <p>The employer will contact you shortly for the next steps.</p>";
        } elseif (strtolower($newStatus) === 'rejected') {
            $statusMessage = "<p style='color: red;'>We regret to inform you that your application was <b>Rejected</b>.</p>
                              <p>We appreciate your interest and wish you luck in your future endeavors.</p>";
        } elseif (strtolower($newStatus) === 'hired') {
            $statusMessage = "<p style='color: purple;'>Congratulations! You have been <b>Hired</b>!</p>";
        } else {
             $statusMessage = "<p>Your application status has been updated to: <b>" . ucfirst($newStatus) . "</b></p>";
        }

        $mail->Body = "
            <h2>Application Status Update</h2>
            <p>Dear Candidate,</p>
            <p>Your application for <b>{$details['job_title']}</b> at <b>{$details['company_name']}</b> has been updated.</p>
            $statusMessage
            <br>
            <p><i>- Job Exhibition Team</i></p>
        ";
        $mail->send();

    } catch (Exception $emailError) {
        error_log("Email sending failed: " . $emailError->getMessage());
    }

    sendSuccess('Status updated successfully');

} catch (Exception $e) {
    sendError('Failed to update status: ' . $e->getMessage(), 500);
}
?>
