package com.example.flutterwave_demo.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.example.flutterwave_demo.dto.PaymentRequest;
import com.example.flutterwave_demo.service.FlutterwaveAuthService;

import java.util.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final FlutterwaveAuthService flutterwaveAuthService;

    @Value("${flutterwave.base-url}")
    private String flutterwaveUrl;

    @PostMapping("/initiate")
    public ResponseEntity<String> initiatePayment(@RequestBody PaymentRequest request) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String accessToken = flutterwaveAuthService.getAccessToken();
        headers.setBearerAuth(accessToken);

        headers.set("X-Trace-Id", UUID.randomUUID().toString());
        headers.set("X-Scenario-Key", "scenario:successful&issuer:visa");

        System.out.println("Calling Flutterwave with token: " + accessToken);

        Map<String, Object> body = new HashMap<>();
        body.put("payment_method_id", request.getPayment_method_id());
        body.put("customer_id", request.getCustomer_id());
        body.put("amount", request.getAmount());
        body.put("currency", request.getCurrency());
        body.put("reference", request.getReference());
        body.put("redirect_url", request.getRedirect_url());

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                flutterwaveUrl + "/charges",
                entity,
                String.class
        );

        System.out.println("Response status: " + response.getStatusCode());
        System.out.println("Response body: " + response.getBody());

        return response;
    }
}