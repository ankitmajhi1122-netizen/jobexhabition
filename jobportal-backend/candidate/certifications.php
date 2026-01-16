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
        // Fetch all certifications
        $sql = "SELECT * FROM certifications 
                WHERE candidate_id = ? 
                ORDER BY issue_date DESC NULLS LAST";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id']]);
        $certifications = $stmt->fetchAll();
        
        sendSuccess('Certifications retrieved', $certifications);
        
    } elseif ($method === 'POST') {
        // Add new certification
        $input = json_decode(file_get_contents("php://input"), true);
        
        $certificationName = sanitize($input['certification_name'] ?? '');
        $issuingOrganization = sanitize($input['issuing_organization'] ?? '');
        $issueDate = sanitize($input['issue_date'] ?? null);
        $expiryDate = sanitize($input['expiry_date'] ?? null);
        $credentialId = sanitize($input['credential_id'] ?? '');
        $credentialUrl = sanitize($input['credential_url'] ?? '');
        $doesNotExpire = isset($input['does_not_expire']) ? (bool)$input['does_not_expire'] : false;
        
        if (!$certificationName || !$issuingOrganization) {
            sendError('Certification name and issuing organization are required');
        }
        
        if ($doesNotExpire) {
            $expiryDate = null;
        }
        
        $sql = "INSERT INTO certifications 
                (candidate_id, certification_name, issuing_organization, issue_date, 
                expiry_date, credential_id, credential_url, does_not_expire)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $user['id'], $certificationName, $issuingOrganization, $issueDate,
            $expiryDate, $credentialId, $credentialUrl, $doesNotExpire
        ]);
        
        sendSuccess('Certification added', ['id' => $pdo->lastInsertId()]);
        
    } elseif ($method === 'PUT') {
        // Update certification
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Certification ID is required');
        }
        
        // Verify ownership
        $stmt = $pdo->prepare("SELECT id FROM certifications WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        if (!$stmt->fetch()) {
            sendError('Certification not found', 404);
        }
        
        $certificationName = sanitize($input['certification_name'] ?? '');
        $issuingOrganization = sanitize($input['issuing_organization'] ?? '');
        $issueDate = sanitize($input['issue_date'] ?? null);
        $expiryDate = sanitize($input['expiry_date'] ?? null);
        $credentialId = sanitize($input['credential_id'] ?? '');
        $credentialUrl = sanitize($input['credential_url'] ?? '');
        $doesNotExpire = isset($input['does_not_expire']) ? (bool)$input['does_not_expire'] : false;
        
        if ($doesNotExpire) {
            $expiryDate = null;
        }
        
        $sql = "UPDATE certifications SET 
                certification_name = ?, issuing_organization = ?, issue_date = ?,
                expiry_date = ?, credential_id = ?, credential_url = ?, does_not_expire = ?
                WHERE id = ? AND candidate_id = ?";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $certificationName, $issuingOrganization, $issueDate,
            $expiryDate, $credentialId, $credentialUrl, $doesNotExpire,
            $id, $user['id']
        ]);
        
        sendSuccess('Certification updated');
        
    } elseif ($method === 'DELETE') {
        // Delete certification
        $input = json_decode(file_get_contents("php://input"), true);
        $id = isset($input['id']) ? (int)$input['id'] : 0;
        
        if (!$id) {
            sendError('Certification ID is required');
        }
        
        $stmt = $pdo->prepare("DELETE FROM certifications WHERE id = ? AND candidate_id = ?");
        $stmt->execute([$id, $user['id']]);
        
        if ($stmt->rowCount() > 0) {
            sendSuccess('Certification deleted');
        } else {
            sendError('Certification not found', 404);
        }
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
