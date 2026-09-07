package com.daksh.misinformation_detector.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String root() {
        return "Misinformation Detector Backend API is running";
    }

    @GetMapping("/api/health")
    public String health() {
        return "Backend is running";
    }

    @GetMapping("/api/auth-test")
    public String authTest() {
        return "Authenticated successfully";
    }
}