package com.daksh.misinformation_detector.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon-key}")
    private String anonKey;

    private final RestClient restClient = RestClient.create();

    @PostMapping(
        value = "/login",
        consumes = MediaType.APPLICATION_JSON_VALUE
    )
    public Map<String, Object> login(@RequestBody LoginRequest request) {

        return restClient.post()
                .uri(supabaseUrl + "/auth/v1/token?grant_type=password")
                .header("apikey", anonKey)
                .header("Content-Type", "application/json")
                .body(Map.of(
                        "email", request.email(),
                        "password", request.password()
                ))
                .retrieve()
                .body(Map.class);
    }

    public record LoginRequest(String email, String password) {
    }
}