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
        // Fetch all work experiences for the candidate
        $sql = "SELECT * FROM work_experience 
                WHERE candidate_id = ? 
                ORDER BY is_current DESC, start_date DESC, display_order ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id']]);
        $experiences = $stmt->fetchAll();
        
        sendSuccess('Work experience retrieved', $experiences);
        
    } elseif ($method === 'POST') {
        // Add new work experience
        $input = json_decode(file_get_contents("php://input"), true);
        
        $companyName = sanitize($input['company_name'] ?? '');
        $jobTitle = sanitize($input['job_title'] ?? '');
        $location = sanitize($input['location'] ?? '');
        $employmentType = sanitize($input['employment_type'] ?? 'full_time');
        $startDate = sanitize($input['start_date'] ?? '');
        $endDate = sanitize($input['end_date'] ?? null);
        $isCurrent = isset($input['is_current']) ? (bool)$input['is_current'] : false;
        $description = sanitize($input['description'] ?? '');
        $achievements = sanitize($input['achievements'] ?? '');
        $skillsUsed = sanitize($input['skills_used'] ?? '');
        
        if (!$companyName || !$jobTitle || !$startDate) {
            sendError('Company name, job title, and start date are required');
        }
        
        // If current job, set end_date to NULL
        if ($isCurrent) {
            $endDate = null;
        }
        
        $sql = "INSERT INTO work_experience 
                (candidate_id, company_name, job_title, location, employment_type, 
                start_date, end_date, is_current, description, achievements, skills_used)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $user['id'], $companyName, $jobTitle, $location, $employmentType,
            $startDate, $endDate, $isCurrent, $description, $achievements, $skillsUsed
        ]);
        
        sendSuccess('Work experience added', ['id' => $pdo->lastInsertId()]);
        
    } elseif ($method === 'PUT') {
        // Update work experience
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Experience ID is required');
        }
        
        // Verify ownership
        $stmt = $pdo->prepare("SELECT id FROM work_experience WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        if (!$stmt->fetch()) {
            sendError('Experience not found', 404);
        }
        
        $companyName = sanitize($input['company_name'] ?? '');
        $jobTitle = sanitize($input['job_title'] ?? '');
        $location = sanitize($input['location'] ?? '');
        $employmentType = sanitize($input['employment_type'] ?? 'full_time');
        $startDate = sanitize($input['start_date'] ?? '');
        $endDate = sanitize($input['end_date'] ?? null);
        $isCurrent = isset($input['is_current']) ? (bool)$input['is_current'] : false;
        $description = sanitize($input['description'] ?? '');
        $achievements = sanitize($input['achievements'] ?? '');
        $skillsUsed = sanitize($input['skills_used'] ?? '');
        
        if ($isCurrent) {
            $endDate = null;
        }
        
        $sql = "UPDATE work_experience SET 
                company_name = ?, job_title = ?, location = ?, employment_type = ?,
                start_date = ?, end_date = ?, is_current = ?, description = ?,
                achievements = ?, skills_used = ?
                WHERE id = ? AND candidate_id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $companyName, $jobTitle, $location, $employmentType,
            $startDate, $endDate, $isCurrent, $description, $achievements, $skillsUsed,
            $id, $user['id']
        ]);
        
        sendSuccess('Work experience updated');
        
    } elseif ($method === 'DELETE') {
        // Delete work experience
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Experience ID is required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM work_experience WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess('Work experience deleted');
        } else {
            sendError('Experience not found', 404);
        }
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
