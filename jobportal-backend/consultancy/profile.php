<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'consultancy') {
    sendError('Access denied. Consultancies only.', 403);
}

$pdo = getPDO();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch Profile
    $stmt = $pdo->prepare("SELECT * FROM companies WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $profile = $stmt->fetch();
    $profile['email'] = $user['email'];

    if (!$profile) {
        sendError('Profile not found', 404);
    }
    
    sendSuccess('Consultancy Profile', $profile);

} elseif ($method === 'POST') {
    // Update Profile
    $input = json_decode(file_get_contents("php://input"), true);
    
    $companyName = sanitize($input['company_name'] ?? '');
    $regNo = sanitize($input['registration_no'] ?? '');
    $contactPerson = sanitize($input['contact_person'] ?? '');
    $phone = sanitize($input['phone'] ?? '');
    $address = sanitize($input['address'] ?? '');
    $website = sanitize($input['website'] ?? '');

    $stmt = $pdo->prepare("SELECT id FROM companies WHERE user_id = ?");
    $stmt->execute([$user['id']]);
    $exists = $stmt->fetch();

    if ($exists) {
        $sql = "UPDATE companies SET company_name = ?, registration_no = ?, contact_person = ?, phone = ?, address = ?, website = ? WHERE user_id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$companyName, $regNo, $contactPerson, $phone, $address, $website, $user['id']]);
        sendSuccess('Profile updated successfully');
    } else {
        $sql = "INSERT INTO companies (user_id, company_name, registration_no, contact_person, phone, address, website, is_consultancy) VALUES (?, ?, ?, ?, ?, ?, ?, 1)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$user['id'], $companyName, $regNo, $contactPerson, $phone, $address, $website]);
        sendSuccess('Profile created successfully');
    }

} else {
    sendError('Method not allowed', 405);
}
?>
