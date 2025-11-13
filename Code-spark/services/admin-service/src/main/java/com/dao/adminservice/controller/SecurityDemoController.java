package com.dao.adminservice.controller;

import com.dao.adminservice.dto.CrackDemoResponse;
import com.dao.adminservice.dto.CrackRequest;
import com.dao.adminservice.service.SecurityDemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dao.adminservice.entity.CrackDemoHistory;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/security")
@RequiredArgsConstructor
public class SecurityDemoController {

    private final SecurityDemoService securityDemoService;

    @PostMapping("/crack-demo")
    public ResponseEntity<CrackDemoResponse> runCrackDemo(@RequestBody CrackRequest request) {
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        // To make the demo effective, we limit the password length.
        // Cracking long passwords with brute force would take too long even for MD5.
        if (request.getPassword().length() > 6) {
            // You can return a specific error message if you prefer
             throw new IllegalArgumentException("Password is too long for this demo. Please use a password with 6 characters or less.");
        }
        CrackDemoResponse response = securityDemoService.runDemo(request.getPassword());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/crack-demo/history")
    public ResponseEntity<List<CrackDemoHistory>> getHistory() {
        List<CrackDemoHistory> history = securityDemoService.getHistory();
        return ResponseEntity.ok(history);
    }
}
