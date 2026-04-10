package com.example.demo.model;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
   @NotBlank(message = "Email is required")
@Email(message = "Invalid email format")
@Column(unique = true)
    private String username;
    @NotBlank
    private String password;
    // ADMIN or USER
    private String role;
}