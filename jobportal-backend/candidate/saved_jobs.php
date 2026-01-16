<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'candidate') {
    sendError('Access denied. Candidates only.', 403);
}

$pdo = getPDO();
$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Fetch all saved jobs for the candidate
        $sql = "SELECT sj.id as saved_job_id, sj.job_id, sj.notes, sj.saved_at,
                j.title, j.location, j.job_type, j.salary_min, j.salary_max, j.created_at,
                c.company_name, c.logo_url
                FROM saved_jobs sj
                JOIN jobs j ON sj.job_id = j.id
                JOIN companies c ON j.employer_id = c.user_id
                WHERE sj.candidate_id = ?
                ORDER BY sj.saved_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id']]);
        $savedJobs = $stmt->fetchAll();
        
        sendSuccess('Saved jobs retrieved', $savedJobs);
        
    } elseif ($method === 'POST') {
        // Save a job
        $input = json_decode(file_get_contents("php://input"), true);
        $jobId = isset($input['job_id']) ? (int)$input['job_id'] : 0;
        $notes = sanitize($input['notes'] ?? '');
        
        if (!$jobId) {
            sendError('Job ID is required');
        }
        
        // Check if job exists
        $stmt = $pdo->prepare("SELECT id FROM jobs WHERE id = ?");
        $stmt->execute([$jobId]);
        if (!$stmt->fetch()) {
            sendError('Job not found', 404);
        }
        
        // Check if already saved
        $stmt = $pdo->prepare("SELECT id FROM saved_jobs WHERE candidate_id = ? AND job_id = ?");
        $stmt->execute([$user['id'], $jobId]);
        if ($stmt->fetch()) {
            sendError('Job already saved', 409);
        }
        
        // Save the job
        $stmt = $pdo->prepare("INSERT INTO saved_jobs (candidate_id, job_id, notes) VALUES (?, ?, ?)");
        $stmt->execute([$user['id'], $jobId, $notes]);
        
        sendSuccess('Job saved successfully', ['saved_job_id' => $pdo->lastInsertId()]);
        
    } elseif ($method === 'DELETE') {
        // Unsave a job
        $input = json_decode(file_get_contents("php://input"), true);
        $jobId = isset($input['job_id']) ? (int)$input['job_id'] : 0;
        
        if (!$jobId) {
            sendError('Job ID is required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM saved_jobs WHERE candidate_id = ? AND job_id = ?");
        $stmt->execute([$user['id'], $jobId]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess('Job removed from saved');
        } else {
            sendError('Job was not saved', 404);
        }
        
    } elseif ($method === 'PUT') {
        // Update notes for a saved job
        $input = json_decode(file_get_contents("php://input"), true);
        $jobId = isset($input['job_id']) ? (int)$input['job_id'] : 0;
        $notes = sanitize($input['notes'] ?? '');
        
        if (!$jobId) {
            sendError('Job ID is required');
        }
        
        $stmt = $pdo->prepare("UPDATE saved_jobs SET notes = ? WHERE candidate_id = ? AND job_id = ?");
        $stmt->execute([$notes, $user['id'], $jobId]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess('Notes updated');
        } else {
            sendError('Saved job not found', 404);
        }
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
