package com.example.demo.controller;
import com.example.demo.security.JwtService;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {
    @Autowired
    private UserService service;
    @Autowired
    private JwtService jwtService;


    // Register
    @PostMapping("/register")
    public User register(@Valid @RequestBody User user) {
        return service.register(user);
    }

    // Login
    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {

        User user = service.login(username, password);

        return jwtService.generateToken(user.getUsername(), user.getRole());
    }
}