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
        // Fetch all projects
        $sql = "SELECT * FROM projects 
                WHERE candidate_id = ? 
                ORDER BY is_featured DESC, is_ongoing DESC, start_date DESC NULLS LAST, display_order ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id']]);
        $projects = $stmt->fetchAll();
        
        sendSuccess('Projects retrieved', $projects);
        
    } elseif ($method === 'POST') {
        // Add new project
        $input = json_decode(file_get_contents("php://input"), true);
        
        $projectName = sanitize($input['project_name'] ?? '');
        $description = sanitize($input['description'] ?? '');
        $role = sanitize($input['role'] ?? '');
        $technologiesUsed = sanitize($input['technologies_used'] ?? '');
        $projectUrl = sanitize($input['project_url'] ?? '');
        $githubUrl = sanitize($input['github_url'] ?? '');
        $thumbnailUrl = sanitize($input['thumbnail_url'] ?? '');
        $startDate = sanitize($input['start_date'] ?? null);
        $endDate = sanitize($input['end_date'] ?? null);
        $isOngoing = isset($input['is_ongoing']) ? (bool)$input['is_ongoing'] : false;
        $isFeatured = isset($input['is_featured']) ? (bool)$input['is_featured'] : false;
        
        if (!$projectName) {
            sendError('Project name is required');
        }
        
        if ($isOngoing) {
            $endDate = null;
        }
        
        $sql = "INSERT INTO projects 
                (candidate_id, project_name, description, role, technologies_used, 
                project_url, github_url, thumbnail_url, start_date, end_date, is_ongoing, is_featured)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $user['id'], $projectName, $description, $role, $technologiesUsed,
            $projectUrl, $githubUrl, $thumbnailUrl, $startDate, $endDate, $isOngoing, $isFeatured
        ]);
        
        sendSuccess('Project added', ['id' => $pdo->lastInsertId()]);
        
    } elseif ($method === 'PUT') {
        // Update project
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Project ID is required');
        }
        
        // Verify ownership
        $stmt = $pdo->prepare("SELECT id FROM projects WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        if (!$stmt->fetch()) {
            sendError('Project not found', 404);
        }
        
        $projectName = sanitize($input['project_name'] ?? '');
        $description = sanitize($input['description'] ?? '');
        $role = sanitize($input['role'] ?? '');
        $technologiesUsed = sanitize($input['technologies_used'] ?? '');
        $projectUrl = sanitize($input['project_url'] ?? '');
        $githubUrl = sanitize($input['github_url'] ?? '');
        $thumbnailUrl = sanitize($input['thumbnail_url'] ?? '');
        $startDate = sanitize($input['start_date'] ?? null);
        $endDate = sanitize($input['end_date'] ?? null);
        $isOngoing = isset($input['is_ongoing']) ? (bool)$input['is_ongoing'] : false;
        $isFeatured = isset($input['is_featured']) ? (bool)$input['is_featured'] : false;
        
        if ($isOngoing) {
            $endDate = null;
        }
        
        $sql = "UPDATE projects SET 
                project_name = ?, description = ?, role = ?, technologies_used = ?,
                project_url = ?, github_url = ?, thumbnail_url = ?,
                start_date = ?, end_date = ?, is_ongoing = ?, is_featured = ?
                WHERE id = ? AND candidate_id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $projectName, $description, $role, $technologiesUsed,
            $projectUrl, $githubUrl, $thumbnailUrl,
            $startDate, $endDate, $isOngoing, $isFeatured,
            $id, $user['id']
        ]);
        
        sendSuccess('Project updated');
        
    } elseif ($method === 'DELETE') {
        // Delete project
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Project ID is required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess('Project deleted');
        } else {
            sendError('Project not found', 404);
        }
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
