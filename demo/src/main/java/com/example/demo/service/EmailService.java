package com.example.demo.service;

import com.resend.Resend;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
        @Value("${RESEND_API_KEY}")
    private String apiKey;


    public void sendEmail(String to, String subject, String text) {
         try {
            Resend resend = new Resend(apiKey);

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("onboarding@resend.dev")
                    .to(to)
                    .subject(subject)
                    .text(text)
                    .build();

            resend.emails().send(params);
            System.out.println("✅ Email sent to: " + to);
        } catch (Exception e) {
          System.out.println("⚠️ Email sending failed (continuing anyway): " + e.getMessage());
            // Don't throw - allow registration to proceed
        }
    }
}
