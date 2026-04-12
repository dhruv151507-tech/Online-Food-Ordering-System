package com.example.demo.controller;
import com.example.demo.security.JwtService;
import com.example.demo.model.User;
import com.example.demo.model.VerificationToken;
import com.example.demo.service.UserService;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.VerificationTokenRepository;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService service;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VerificationTokenRepository tokenRepository;


    // Register
    @PostMapping("/register")
    public String register(@Valid @RequestBody User user) {
        return service.register(user);
    }
   @GetMapping("/verify")
public String verifyEmail(@RequestParam String otp) {

    VerificationToken vt = tokenRepository.findByOtp(otp)
            .orElseThrow(() -> new RuntimeException("Invalid token"));

    if (vt.getExpiryDate().isBefore(LocalDateTime.now())) {
        throw new RuntimeException("Token expired");
    }

    User user = vt.getUser();
    user.setEmailVerified(true);
    userRepository.save(user);

    tokenRepository.delete(vt);

    return "Email verified successfully!";
}

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String otp = body.get("otp");
        return service.verifyOtp(username, otp);
    }

    // Login
    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {

        User user = service.login(username, password);

        return jwtService.generateToken(user.getUsername(), user.getRole());
    }
    // Resend OTP. Accept either `?email=...` or JSON `{ "email": "..." }`.
    @PostMapping("/resend-otp")
    public String resendOtp(@RequestParam(required = false) String email,
                            @RequestBody(required = false) Map<String, String> body) {
        if ((email == null || email.isBlank()) && body != null) {
            email = body.get("email");
        }

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        return service.resendOtp(email);
    }
}
