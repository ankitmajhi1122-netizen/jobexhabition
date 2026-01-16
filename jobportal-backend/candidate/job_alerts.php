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
        // Fetch all job alerts
        $sql = "SELECT * FROM job_alerts 
                WHERE candidate_id = ? 
                ORDER BY is_active DESC, created_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id']]);
        $alerts = $stmt->fetchAll();
        
        sendSuccess('Job alerts retrieved', $alerts);
        
    } elseif ($method === 'POST') {
        // Create new job alert
        $input = json_decode(file_get_contents("php://input"), true);
        
        $alertName = sanitize($input['alert_name'] ?? 'My Alert');
        $keywords = sanitize($input['keywords'] ?? '');
        $location = sanitize($input['location'] ?? '');
        $minSalary = isset($input['min_salary']) ? (float)$input['min_salary'] : null;
        $maxSalary = isset($input['max_salary']) ? (float)$input['max_salary'] : null;
        $jobType = sanitize($input['job_type'] ?? '');
        $experienceLevel = sanitize($input['experience_level'] ?? '');
        $frequency = sanitize($input['frequency'] ?? 'daily');
        $isActive = isset($input['is_active']) ? (bool)$input['is_active'] : true;
        
        if (!$keywords && !$location && !$jobType) {
            sendError('At least one search criterion is required');
        }
        
        $sql = "INSERT INTO job_alerts 
                (candidate_id, alert_name, keywords, location, min_salary, max_salary, 
                job_type, experience_level, frequency, is_active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $user['id'], $alertName, $keywords, $location, $minSalary, $maxSalary,
            $jobType, $experienceLevel, $frequency, $isActive
        ]);
        
        sendSuccess('Job alert created', ['id' => $pdo->lastInsertId()]);
        
    } elseif ($method === 'PUT') {
        // Update job alert
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Alert ID is required');
        }
        
        // Verify ownership
        $stmt = $pdo->prepare("SELECT id FROM job_alerts WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        if (!$stmt->fetch()) {
            sendError('Alert not found', 404);
        }
        
        $alertName = sanitize($input['alert_name'] ?? 'My Alert');
        $keywords = sanitize($input['keywords'] ?? '');
        $location = sanitize($input['location'] ?? '');
        $minSalary = isset($input['min_salary']) ? (float)$input['min_salary'] : null;
        $maxSalary = isset($input['max_salary']) ? (float)$input['max_salary'] : null;
        $jobType = sanitize($input['job_type'] ?? '');
        $experienceLevel = sanitize($input['experience_level'] ?? '');
        $frequency = sanitize($input['frequency'] ?? 'daily');
        $isActive = isset($input['is_active']) ? (bool)$input['is_active'] : true;
        
        $sql = "UPDATE job_alerts SET 
                alert_name = ?, keywords = ?, location = ?, min_salary = ?, max_salary = ?,
                job_type = ?, experience_level = ?, frequency = ?, is_active = ?
                WHERE id = ? AND candidate_id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $alertName, $keywords, $location, $minSalary, $maxSalary,
            $jobType, $experienceLevel, $frequency, $isActive,
            $id, $user['id']
        ]);
        
        sendSuccess('Job alert updated');
        
    } elseif ($method === 'DELETE') {
        // Delete job alert
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Alert ID is required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM job_alerts WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess('Job alert deleted');
        } else {
            sendError('Alert not found', 404);
        }
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
