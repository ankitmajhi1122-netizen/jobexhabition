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
        // Fetch all education records
        $sql = "SELECT * FROM education 
                WHERE candidate_id = ? 
                ORDER BY end_year IS NULL DESC, end_year DESC, start_year DESC, display_order ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id']]);
        $education = $stmt->fetchAll();
        
        sendSuccess('Education records retrieved', $education);
        
    } elseif ($method === 'POST') {
        // Add new education record
        $input = json_decode(file_get_contents("php://input"), true);
        
        $institutionName = sanitize($input['institution_name'] ?? '');
        $degree = sanitize($input['degree'] ?? '');
        $fieldOfStudy = sanitize($input['field_of_study'] ?? '');
        $startYear = isset($input['start_year']) ? (int)$input['start_year'] : null;
        $endYear = isset($input['end_year']) ? (int)$input['end_year'] : null;
        $grade = sanitize($input['grade'] ?? '');
        $activities = sanitize($input['activities'] ?? '');
        $description = sanitize($input['description'] ?? '');
        
        if (!$institutionName || !$degree) {
            sendError('Institution name and degree are required');
        }
        
        $sql = "INSERT INTO education 
                (candidate_id, institution_name, degree, field_of_study, 
                start_year, end_year, grade, activities, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $user['id'], $institutionName, $degree, $fieldOfStudy,
            $startYear, $endYear, $grade, $activities, $description
        ]);
        
        sendSuccess('Education record added', ['id' => $pdo->lastInsertId()]);
        
    } elseif ($method === 'PUT') {
        // Update education record
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Education ID is required');
        }
        
        // Verify ownership
        $stmt = $pdo->prepare("SELECT id FROM education WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        if (!$stmt->fetch()) {
            sendError('Education record not found', 404);
        }
        
        $institutionName = sanitize($input['institution_name'] ?? '');
        $degree = sanitize($input['degree'] ?? '');
        $fieldOfStudy = sanitize($input['field_of_study'] ?? '');
        $startYear = isset($input['start_year']) ? (int)$input['start_year'] : null;
        $endYear = isset($input['end_year']) ? (int)$input['end_year'] : null;
        $grade = sanitize($input['grade'] ?? '');
        $activities = sanitize($input['activities'] ?? '');
        $description = sanitize($input['description'] ?? '');
        
        $sql = "UPDATE education SET 
                institution_name = ?, degree = ?, field_of_study = ?,
                start_year = ?, end_year = ?, grade = ?, activities = ?, description = ?
                WHERE id = ? AND candidate_id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $institutionName, $degree, $fieldOfStudy,
            $startYear, $endYear, $grade, $activities, $description,
            $id, $user['id']
        ]);
        
        sendSuccess('Education record updated');
        
    } elseif ($method === 'DELETE') {
        // Delete education record
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Education ID is required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM education WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess('Education record deleted');
        } else {
            sendError('Education record not found', 404);
        }
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
