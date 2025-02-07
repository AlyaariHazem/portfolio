<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

require 'vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 1. Basic Sanitization
    $name = trim(filter_var($_POST['name'], FILTER_SANITIZE_STRING));
    $email = trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL));
    $subject = trim(filter_var($_POST['subject'], FILTER_SANITIZE_STRING));
    $message = trim(filter_var($_POST['message'], FILTER_SANITIZE_STRING));

    // 2. Validate Email & Length
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format.");
    }
    if (strlen($name) < 2 || strlen($subject) < 2 || strlen($message) < 10) {
        die("Please provide valid input in all fields.");
    }

    // 3. Optional reCAPTCHA Server-side Validation
    if (isset($_POST['g-recaptcha-response'])) {
        $recaptchaToken = $_POST['g-recaptcha-response'];
        $secretKey = $_ENV['RECAPTCHA_SECRET']; // from .env
        $url = "https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$recaptchaToken}";

        $response = file_get_contents($url);
        $responseKeys = json_decode($response, true);

        if (!$responseKeys["success"]) {
            die("reCAPTCHA validation failed. Please try again.");
        }
    }

    // 4. Set Up PHPMailer
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; 
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USER']; 
        $mail->Password = $_ENV['SMTP_PASS']; 
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // 5. Setup "From" & "Reply-To"
        $mail->setFrom($_ENV['SMTP_USER'], 'Your Website');
        $mail->addReplyTo($email, $name);

        // 6. Add Recipient
        $mail->addAddress('alyaarihazem@gmail.com');

        // 7. Email Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        // Convert line breaks to <br> for HTML, or wrap in <pre> if you prefer
        $mail->Body    = nl2br($message);

        // 8. Send Email
        $mail->send();
        echo "Message has been sent successfully!";
    } catch (Exception $e) {
        // 9. Handle Errors
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>
