package com.example.demo.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.model.User;
import com.example.demo.model.VerificationToken;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.VerificationTokenRepository;

@Service
public class UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public String register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (user.getEmail() == null || user.getEmail().isBlank()) {
            user.setEmail(user.getUsername());
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEmailVerified(false);
        userRepository.save(user);

        tokenRepository.deleteByUser(user);

        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);

        VerificationToken vt = new VerificationToken();
        vt.setOtp(otp);
        vt.setUser(user);
        vt.setExpiryDate(LocalDateTime.now().plusMinutes(5));
        tokenRepository.save(vt);

        try {
            emailService.sendEmail(
                user.getEmail(),
                "Email Verification OTP",
                "Your OTP is: " + otp + "\nValid for 5 minutes."
            );
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }

        return "User registered! Check email for OTP.";
    }

    @Transactional
    public String verifyOtp(String username, String otp) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        VerificationToken vt = tokenRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Invalid OTP or user not pending verification"));

        if (vt.getExpiryDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(vt);
            throw new RuntimeException("OTP expired");
        }

        if (!vt.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        user.setEmailVerified(true);
        userRepository.save(user);
        tokenRepository.delete(vt);

        return "Email verified successfully!";
    }

    @Transactional
    public String resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("User already verified");
        }

        tokenRepository.deleteByUser(user);

        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);

        VerificationToken vt = new VerificationToken();
        vt.setOtp(otp);
        vt.setUser(user);
        vt.setExpiryDate(LocalDateTime.now().plusMinutes(5));
        tokenRepository.save(vt);

        try {
            emailService.sendEmail(
                email,
                "Resent OTP",
                "Your new OTP is: " + otp
            );
        } catch (Exception e) {
            System.out.println("Email failed: " + e.getMessage());
        }

        return "New OTP sent successfully!";
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}
