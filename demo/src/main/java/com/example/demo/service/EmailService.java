package com.example.demo.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String text) {
        if (!StringUtils.hasText(apiKey)) {
            throw new RuntimeException("Resend API key is not configured");
        }

        if (!StringUtils.hasText(fromEmail)) {
            throw new RuntimeException("Resend sender email is not configured");
        }

        Resend resend = new Resend(apiKey);

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(fromEmail)
                .to(to)
                .subject(subject)
                .text(text)
                .build();

        try {
            resend.emails().send(params);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email via Resend: " + e.getMessage(), e);
        }
    }
}
