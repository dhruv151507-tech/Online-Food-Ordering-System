package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
protected boolean shouldNotFilter(HttpServletRequest request) {

    String path = request.getServletPath();

    // ✅ Allow CORS preflight
    if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
        return true;
    }

    // ✅ Allow ALL auth endpoints
    return path.startsWith("/api/auth/");
}

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            try {
                String username = jwtService.extractUsername(token);
                String role = jwtService.extractRole(token);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role))
                        );

                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (Exception e) {
                // 🔥 DO NOT BLOCK → continue request
                filterChain.doFilter(request, response);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}