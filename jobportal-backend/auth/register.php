<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/mailer.php';
require_once __DIR__ . '/../utils/functions.php';

handleCors();


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Get JSON Input
$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    sendError('Invalid JSON input');
}

$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
$password = $input['password'] ?? '';
$role = $input['role'] ?? '';
$extra_data = $input['data'] ?? []; // Extra profile data based on role

if (!$email || !$password || !$role) {
    sendError('Email, password, and role are required');
}

if (!in_array($role, ['company', 'consultancy', 'candidate'])) {
    sendError('Invalid role');
}

try {
    $pdo = getPDO();

    // Check if email exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendError('Email already registered', 409);
    }

    $pdo->beginTransaction();

    // Create User
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $otp = sprintf("%06d", mt_rand(1, 999999));
    $otpExpiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));
    $status = ($role === 'candidate') ? 'active' : 'pending'; // Candidates active immediately, others need approval? 
    // Actually prompt says "Company registration & verification", usually means email verification first, then admin approval maybe.
    // Let's set everyone to 'active' for login purposes BUT require email verification (is_verified = 0).
    // The 'status' column in my schema was for Admin approval.
    // Let's set status='pending' for companies/consultancies if they need admin approval, or 'active' if auto.
    // Prompt says: "Approve / reject companies & consultancies" in Admin Panel.
    // So Company/Consultancy = pending. Candidate = active.
    
    $accountStatus = ($role === 'candidate') ? 'active' : 'pending';

    $stmt = $pdo->prepare("INSERT INTO users (email, password_hash, role, is_verified, otp_code, otp_expiry, status) VALUES (?, ?, ?, 0, ?, ?, ?)");
    $stmt->execute([$email, $passwordHash, $role, $otp, $otpExpiry, $accountStatus]);
    $userId = $pdo->lastInsertId();

    // Create Profile Entry
    if ($role === 'candidate') {
        $fullName = sanitize($extra_data['full_name'] ?? '');
        $phone = sanitize($extra_data['phone'] ?? '');
        
        $stmt = $pdo->prepare("INSERT INTO candidates (user_id, full_name, phone) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $fullName, $phone]);
        
        // Calculate initial profile completeness
        // Calculate initial profile completeness
        require_once __DIR__ . '/../candidate/candidate_functions.php';
        updateProfileCompleteness($pdo, $userId);

    } elseif ($role === 'company' || $role === 'consultancy') {
        $companyName = sanitize($extra_data['company_name'] ?? '');
        $phone = sanitize($extra_data['phone'] ?? '');
        $isConsultancy = ($role === 'consultancy') ? 1 : 0;
        
        $stmt = $pdo->prepare("INSERT INTO companies (user_id, company_name, phone, is_consultancy) VALUES (?, ?, ?, ?)");
        $stmt->execute([$userId, $companyName, $phone, $isConsultancy]);
    }

    // Send OTP Email
    try {
        $mail = makeMailer();
        $mail->addAddress($email);
        $mail->Subject = 'Verify your email - Job Exhibition';
        $mail->Body = "Your OTP for registration is: <b>$otp</b>. It expires in 15 minutes.";
        $mail->send();
    } catch (Exception $mailError) {
        // Log email error but don't fail registration
        error_log("Email sending failed: " . $mailError->getMessage());
        // Still allow registration to proceed - user can request OTP resend later
    }

    $pdo->commit();
    sendSuccess('Registration successful. Please verify your email.', ['user_id' => $userId, 'email' => $email, 'otp' => $otp]);

} catch (Exception $e) {
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    sendError('Registration failed: ' . $e->getMessage(), 500);
}
?>
