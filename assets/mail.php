<?php
// Include PHPMailer classes manually
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $errors = [];

    $name = isset($_POST["name"])?trim($_POST["name"]):"";
    $email = isset($_POST["email"])?filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL):"";
    $phone = isset($_POST["whatsapp"])?trim($_POST["whatsapp"]):"";
    $message = isset($_POST["description"])?trim($_POST["description"]):"";
    $details =  isset($_POST["details"])? trim($_POST["details"]):""; 

    $data = [$name, $email, $phone, $message, $details];
    if(empty($name))
        $errors['name'] ='El nombre es obligatorio';

    if(empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL))
        $errors['email'] ='El correo electronico es obligatorio';

    if(empty($phone)){
        $errors['whatsapp'] = 'El numero de whatsApp es obligatorio';
    }

    if(empty($message)){
        $errors['description'] = 'La descripción del proyecto es obligatorio';
    }

    if(!empty($errors)){
        http_response_code(400);
        echo json_encode(['ok'=>false, 'errors' => $errors]);
        exit;
    }

    // Recipient
    $recipient = "administracion@dinozign.com";

    // PHPMailer setup    
    try {
        $mail = new PHPMailer();

        $mail->isSMTP();
        $mail->Host = 'sandbox.smtp.mailtrap.io';
        $mail->SMTPAuth = true;
        $mail->Port = 2525;
        $mail->Username = '7969e4afd75316';
        $mail->Password = '241e2cdbeab563';
        
        //Recipients
        $mail->setFrom('administracion@dinozign.com', 'Dinozign'); // "From" address (Sender email & name shown in inbox)
        $mail->addAddress($recipient); // Admin inbox
        $mail->Subject = "$name se contacto con nosotros";
        
        // Content
        $mail->isHTML(true);
        $mail->CharSet = 'UTF-8';

        $email_content = "<html>";
        $email_content .= "<p><strong>Se ha recibido una solicitud</strong></p>";
        $email_content .= "<p><strong>Nombre de cliente o empresa:</strong> ".$name."</p>";
        $email_content .= "<p><strong>Correo:</strong> ".$email."</p>";
        $email_content .= "<p><strong>WhatsApp:</strong> ".$phone."</p>";
        $email_content .= "<strong>Objetivo de proyecto:</strong>";
        $email_content .= "<p>".$message."</p>";
        $email_content .= "<strong>Mensaje:</strong>";
        $detalle_texto = !empty($details) ? $details : 'El cliente no dejó un mensaje adicional';
        $email_content .= "<p>" . $detalle_texto . "</p>";
        $email_content .= "<html>";

        $mail->Body    = $email_content;
        $mail->send();

        http_response_code(200);
        echo json_encode(['ok'=>true, 'errors' => null]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['ok'=>false, 'errors' => "Error al enviar el correo". $e->getMessage()]);
    }

}
