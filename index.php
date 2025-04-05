<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Dotenv\Dotenv;

require 'vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // 1. Basic Sanitization using filter_input
    $name    = trim(filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING));
    $email   = trim(filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL));
    $subject = trim(filter_input(INPUT_POST, 'subject', FILTER_SANITIZE_STRING));
    $message = trim(filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING));

    // 2. Validate Email & Length
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die("Invalid email format.");
    }
    if (strlen($name) < 2 || strlen($subject) < 2 || strlen($message) < 10) {
        die("Please provide valid input in all fields.");
    }

    // 3. Optional reCAPTCHA Server-side Validation
    if (!empty($_POST['g-recaptcha-response'])) {
        $recaptchaToken = $_POST['g-recaptcha-response'];
        $secretKey = $_ENV['RECAPTCHA_SECRET']; // from .env
        $recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify?secret={$secretKey}&response={$recaptchaToken}";

        $recaptchaResponse = file_get_contents($recaptchaUrl);
        $responseData = json_decode($recaptchaResponse, true);

        if (!$responseData["success"]) {
            die("reCAPTCHA validation failed. Please try again.");
        }
    }

    // 4. Set Up PHPMailer
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['SMTP_USER'];
        $mail->Password   = $_ENV['SMTP_PASS'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        // 5. Setup "From" & "Reply-To"
        $mail->setFrom($_ENV['SMTP_USER'], 'Your Website');
        $mail->addReplyTo($email, $name);

        // 6. Add Recipient
        $mail->addAddress('alyaarihazem@gmail.com'); 

        // 7. Email Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        // Convert special characters and newlines for HTML output
        $mail->Body    = nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8'));

        // 8. Send Email
        $mail->send();
        echo "Message has been sent successfully!";
    } catch (Exception $e) {
        // 9. Handle Errors
        echo "Message could not be sent. Mailer Error: " . $mail->ErrorInfo;
    }
}
?>
