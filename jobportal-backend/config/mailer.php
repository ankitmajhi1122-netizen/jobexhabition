<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Note: Ensure PHPMailer is installed via Composer or included manually.
require __DIR__ . '/../vendor/autoload.php'; // Uncommented for usage with Composer

function makeMailer(): PHPMailer {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Username = 'jyotijrs9404j@gmail.com';
    $mail->Password = 'prsx sihj jdne qikf';
    $mail->CharSet = 'UTF-8';
    $mail->isHTML(true);
    $mail->setFrom('jyotijrs9404j@gmail.com', 'Job Exhibition');
    return $mail;
}
?>
