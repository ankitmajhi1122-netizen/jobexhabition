<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/mailer.php';
require_once __DIR__ . '/../utils/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = json_decode(file_get_contents("php://input"), true);
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);

if (!$email) {
    sendError('Email is required');
}

try {
    $pdo = getPDO();
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        // Security: Don't reveal if user exists. Just say email sent.
        sendSuccess('If your email is registered, you will receive a reset link.');
        exit;
    }

    $token = bin2hex(random_bytes(32));
    $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

    $stmt = $pdo->prepare("UPDATE users SET reset_token = ?, reset_expiry = ? WHERE id = ?");
    $stmt->execute([$token, $expiry, $user['id']]);

    // Send Email
    $mail = makeMailer();
    $mail->addAddress($email);
    $mail->Subject = 'Reset Your Password - Job Exhibition';
    $link = "https://jobexhibition.com/reset-password?token=$token";
    $mail->Body = "Click here to reset your password: <a href='$link'>$link</a>. This link expires in 1 hour.";
    $mail->send();

    sendSuccess('If your email is registered, you will receive a reset link.');

} catch (Exception $e) {
    sendError('Error sending email: ' . $e->getMessage(), 500);
}
?>
