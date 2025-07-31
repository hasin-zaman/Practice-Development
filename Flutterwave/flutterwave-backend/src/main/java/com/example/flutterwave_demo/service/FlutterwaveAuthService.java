package com.example.flutterwave_demo.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FlutterwaveAuthService {

    @Value("${flutterwave.client-id}")
    private String clientId;

    @Value("${flutterwave.client-secret}")
    private String clientSecret;

    @Value("${flutterwave.token-url}")
    private String tokenUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAccessToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        Map<String, String> params = new LinkedHashMap<>();
        params.put("client_id", clientId);
        params.put("client_secret", clientSecret);
        params.put("grant_type", "client_credentials");

        StringBuilder body = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (body.length() > 0)
                body.append("&");
            body.append(entry.getKey()).append("=").append(entry.getValue());
        }

        HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);

        @SuppressWarnings("rawtypes")
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return (String) response.getBody().get("access_token");
        } else {
            throw new RuntimeException("Failed to fetch token: " + response.getStatusCode());
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getFullTokenResponse() throws Exception {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("client_id", clientId);
        formData.add("client_secret", clientSecret);
        formData.add("grant_type", "client_credentials");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(formData, headers);

        @SuppressWarnings("rawtypes")
        ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            return response.getBody();
        } else {
            throw new Exception("Token request failed with status: " + response.getStatusCode());
        }
    }

}
