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
        // Fetch all skills
        $sql = "SELECT * FROM candidate_skills 
                WHERE candidate_id = ? 
                ORDER BY is_primary DESC, proficiency DESC, skill_name ASC";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id']]);
        $skills = $stmt->fetchAll();
        
        sendSuccess('Skills retrieved', $skills);
        
    } elseif ($method === 'POST') {
        // Add new skill
        $input = json_decode(file_get_contents("php://input"), true);
        
        $skillName = sanitize($input['skill_name'] ?? '');
        $proficiency = sanitize($input['proficiency'] ?? 'intermediate');
        $yearsOfExperience = isset($input['years_of_experience']) ? (int)$input['years_of_experience'] : 0;
        $isPrimary = isset($input['is_primary']) ? (bool)$input['is_primary'] : false;
        
        if (!$skillName) {
            sendError('Skill name is required');
        }
        
        // Check if skill already exists
        $stmt = $pdo->prepare("SELECT id FROM candidate_skills WHERE candidate_id = ? AND skill_name = ?");
        $stmt->execute([$user['id'], $skillName]);
        if ($stmt->fetch()) {
            sendError('Skill already exists', 409);
        }
        
        $sql = "INSERT INTO candidate_skills 
                (candidate_id, skill_name, proficiency, years_of_experience, is_primary)
                VALUES (?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id'], $skillName, $proficiency, $yearsOfExperience, $isPrimary]);
        
        sendSuccess('Skill added', ['id' => $pdo->lastInsertId()]);
        
    } elseif ($method === 'PUT') {
        // Update skill
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Skill ID is required');
        }
        
        // Verify ownership
        $stmt = $pdo->prepare("SELECT id FROM candidate_skills WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        if (!$stmt->fetch()) {
            sendError('Skill not found', 404);
        }
        
        $proficiency = sanitize($input['proficiency'] ?? 'intermediate');
        $yearsOfExperience = isset($input['years_of_experience']) ? (int)$input['years_of_experience'] : 0;
        $isPrimary = isset($input['is_primary']) ? (bool)$input['is_primary'] : false;
        
        $sql = "UPDATE candidate_skills SET 
                proficiency = ?, years_of_experience = ?, is_primary = ?
                WHERE id = ? AND candidate_id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$proficiency, $yearsOfExperience, $isPrimary, $id, $user['id']]);
        
        sendSuccess('Skill updated');
        
    } elseif ($method === 'DELETE') {
        // Delete skill
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Skill ID is required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM candidate_skills WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess('Skill deleted');
        } else {
            sendError('Skill not found', 404);
        }
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
