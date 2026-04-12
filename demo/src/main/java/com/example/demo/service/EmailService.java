package com.example.demo.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        try {
            if (mailSender == null) {
                System.out.println("⚠️ JavaMailSender not configured. Skipping email to: " + to);
                return;
            }
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom("noreply@foodordering.com");

            mailSender.send(message);
            System.out.println("✅ Email sent to: " + to);
        } catch (Exception e) {
            System.out.println("⚠️ Email sending failed (continuing anyway): " + e.getMessage());
            // Don't throw - allow registration to proceed
        }
    }
}
