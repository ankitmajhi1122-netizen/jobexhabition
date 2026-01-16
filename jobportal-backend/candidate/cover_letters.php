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
        $sql = "SELECT * FROM cover_letters 
                WHERE candidate_id = ? 
                ORDER BY is_default DESC, updated_at DESC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id']]);
        $coverLetters = $stmt->fetchAll();
        
        sendSuccess('Cover letters retrieved', $coverLetters);
        
    } elseif ($method === 'POST') {
        $input = json_decode(file_get_contents("php://input"), true);
        
        $templateName = sanitize($input['template_name'] ?? '');
        $content = sanitize($input['content'] ?? '');
        $isDefault = isset($input['is_default']) ? (bool)$input['is_default'] : false;
        
        if (!$templateName || !$content) {
            sendError('Template name and content are required');
        }
        
        // If setting as default, unset other defaults
        if ($isDefault) {
            $pdo->prepare("UPDATE cover_letters SET is_default = 0 WHERE candidate_id = ?")
                ->execute([$user['id']]);
        }
        
        $sql = "INSERT INTO cover_letters (candidate_id, template_name, content, is_default)
                VALUES (?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id'], $templateName, $content, $isDefault]);
        
        sendSuccess('Cover letter created', ['id' => $pdo->lastInsertId()]);
        
    } elseif ($method === 'PUT') {
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Cover letter ID is required');
        }
        
        $stmt = $pdo->prepare("SELECT id FROM cover_letters WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        if (!$stmt->fetch()) {
            sendError('Cover letter not found', 404);
        }
        
        $templateName = sanitize($input['template_name'] ?? '');
        $content = sanitize($input['content'] ?? '');
        $isDefault = isset($input['is_default']) ? (bool)$input['is_default'] : false;
        
        if ($isDefault) {
            $pdo->prepare("UPDATE cover_letters SET is_default = 0 WHERE candidate_id = ?")
                ->execute([$user['id']]);
        }
        
        $sql = "UPDATE cover_letters SET template_name = ?, content = ?, is_default = ?
                WHERE id = ? AND candidate_id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$templateName, $content, $isDefault, $id, $user['id']]);
        
        sendSuccess('Cover letter updated');
        
    } elseif ($method === 'DELETE') {
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Cover letter ID is required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM cover_letters WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess('Cover letter deleted');
        } else {
            sendError('Cover letter not found', 404);
        }
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
