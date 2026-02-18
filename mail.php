<?php
// =========================================
// SSD HOLDING - Contact Form Handler
// File: send.php
// =========================================

// CHANGE THIS:
$to = "YOUR_RECEIVER_EMAIL@example.com";

// Basic security headers
header('Content-Type: text/html; charset=UTF-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo "Method not allowed.";
  exit;
}

// Helper: sanitize
function clean($value) {
  $value = trim($value ?? "");
  $value = strip_tags($value);
  return $value;
}

$name = clean($_POST["name"] ?? "");
$email = clean($_POST["email"] ?? "");
$company = clean($_POST["company"] ?? "");
$message = clean($_POST["message"] ?? "");

// Validate required fields
if ($name === "" || $email === "" || $message === "") {
  http_response_code(400);
  echo "Missing required fields.";
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo "Invalid email.";
  exit;
}

// Build email
$subject = "New SSD HOLDING Lead: " . $name;

$body = "New lead from SSD HOLDING landing page\n\n";
$body .= "Name: {$name}\n";
$body .= "Email: {$email}\n";
$body .= "Company: {$company}\n\n";
$body .= "Message:\n{$message}\n";

$headers = "From: SSD HOLDING <no-reply@yourdomain.com>\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
  // Redirect back to contact section (nice UX)
  header("Location: index.html#contact");
  exit;
}

http_response_code(500);
echo "Failed to send email.";
