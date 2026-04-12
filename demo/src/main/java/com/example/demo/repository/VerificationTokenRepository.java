package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.User;
import com.example.demo.model.VerificationToken;


@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByOtp(String otp);   

    Optional<VerificationToken> findByUser(User user);   

    void deleteByUser(User user);
}