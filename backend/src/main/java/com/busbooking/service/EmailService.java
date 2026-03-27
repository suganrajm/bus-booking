package com.busbooking.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private SimpleMailMessage buildMessage(String to, String subject, String body) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("GoBus <" + fromEmail + ">");
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        return msg;
    }

    public void sendRegistrationEmail(String toEmail, String name) {
        try {
            String body = "Hello " + name + ",\n\n"
                    + "Welcome to GoBus! Your registration was successful.\n\n"
                    + "You can now log in to search and book bus tickets.\n\n"
                    + "Thank you for choosing GoBus!\n"
                    + "– The GoBus Team";
            SimpleMailMessage message = buildMessage(toEmail, "🎉 Welcome to GoBus!", body);
            mailSender.send(message);
            log.info("Registration email sent to {}", toEmail);
            System.out.println("\n=== EMAIL SENT: Registration to " + toEmail + " ===");
        } catch (Exception e) {
            log.error("Failed to send registration email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendBookingConfirmation(String toEmail, Long bookingId, String travelDate, String source, String destination) {
        try {
            String body = "Dear Traveller,\n\n"
                    + "Your booking has been CONFIRMED! \u2705\n\n"
                    + "  Booking ID : #" + bookingId + "\n"
                    + "  Route      : " + source + " → " + destination + "\n"
                    + "  Travel Date: " + travelDate + "\n\n"
                    + "Please be at the boarding point 15 minutes before departure.\n\n"
                    + "Safe travels!\n"
                    + "– The GoBus Team";
            SimpleMailMessage message = buildMessage(toEmail, "✅ Booking Confirmed – #" + bookingId, body);
            mailSender.send(message);
            log.info("Booking confirmation email sent to {}", toEmail);
            System.out.println("\n=== EMAIL SENT: Booking confirmation to " + toEmail + " ===");
        } catch (Exception e) {
            log.error("Failed to send booking confirmation to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendCancellationNotification(String toEmail, Long bookingId) {
        try {
            String body = "Dear Traveller,\n\n"
                    + "Your booking #" + bookingId + " has been successfully CANCELLED. \u274C\n\n"
                    + "If you did not request this cancellation, please contact our support immediately.\n"
                    + "Refunds (if applicable) will be processed within 5–7 business days.\n\n"
                    + "We hope to see you on board again soon!\n"
                    + "– The GoBus Team";
            SimpleMailMessage message = buildMessage(toEmail, "❌ Booking Cancelled – #" + bookingId, body);
            mailSender.send(message);
            log.info("Cancellation email sent to {}", toEmail);
            System.out.println("\n=== EMAIL SENT: Cancellation to " + toEmail + " ===");
        } catch (Exception e) {
            log.error("Failed to send cancellation email to {}: {}", toEmail, e.getMessage());
        }
    }
}
