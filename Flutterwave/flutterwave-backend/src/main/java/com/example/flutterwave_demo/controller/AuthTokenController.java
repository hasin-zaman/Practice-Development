package com.example.flutterwave_demo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthTokenController {

    private final com.example.flutterwave_demo.service.FlutterwaveAuthService flutterwaveAuthService;

    @GetMapping("/token")
    public ResponseEntity<?> getToken() {
        try {
            Map<String, Object> tokenResponse = flutterwaveAuthService.getFullTokenResponse();
            return ResponseEntity.ok(tokenResponse);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                Map.of("error", "Failed to get token", "message", e.getMessage())
            );
        }
    }
}
