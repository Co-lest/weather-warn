<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
        // Replace with your email details
            $to = "your_email@example.com";
            $subject = "Test Email from PHP";
            $message = "This is a test email sent from PHP.";
            $headers = "From: Your Name <your_email@example.com>";
            
            // Send the email
            if (mail($to, $subject, $message, $headers)) {
                echo "Email sent successfully!";
            } else {
                echo "Error sending email.";
            }
        ?>
</body>
</html>