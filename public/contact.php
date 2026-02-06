<?php
header("Content-Type: application/json");
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// === CONFIG: fill these in ===
$SMTP_FROM = getenv('SMTP_FROM') ?: 'reply@narropil.co.ke.com';
$SMTP_USER = getenv('SMTP_USER') ?: 'edwardsalonik9@gmail.com';
$SMTP_PASS = getenv('SMTP_PASS') ?: 'your_app_password_here';
$SMTP_TO   = getenv('SMTP_TO')   ?: 'narropilhoneyltd@gmail.com';
$SMTP_HOST = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
$SMTP_PORT = getenv('SMTP_PORT') ?: 587;

require __DIR__ . '/phpmailer/PHPMailer.php';
require __DIR__ . '/phpmailer/SMTP.php';
require __DIR__ . '/phpmailer/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    $data = $_POST; // fallback for form-encoded
}

$name    = trim($data['fullName'] ?? '');
$email   = trim($data['email'] ?? '');
$phone   = trim($data['phone'] ?? '');
$message = trim($data['message'] ?? '');

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
    exit;
}

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = $SMTP_HOST;
    $mail->Port = $SMTP_PORT;
    $mail->SMTPAuth = true;
    $mail->Username = $SMTP_USER;
    $mail->Password = $SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->setFrom($SMTP_FROM ?: $SMTP_USER, 'Narropil Honey Website');
    $mail->addAddress($SMTP_TO);
    if ($email) {
        $mail->addReplyTo($email, $name ?: 'Website visitor');
    }

    $mail->Subject = 'Website enquiry from ' . $name;
    $body = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\n\nMessage:\n{$message}";
    $mail->Body = $body;

    $mail->send();
    echo json_encode(['ok' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $mail->ErrorInfo]);
}
