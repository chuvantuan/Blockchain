package com.dao.adminservice.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@Entity
@Table(name = "crack_demo_history")
public class CrackDemoHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String originalPassword;

    @Column(nullable = false, length = 50)
    private String algorithm;

    @Column(name = "hash_value", nullable = false, columnDefinition = "TEXT")
    private String hashValue;

    @Column(nullable = false)
    private boolean cracked;

    @Column(nullable = false)
    private long timeTakenMs;

    @Column(nullable = false)
    private long attempts;

    private String crackedPassword;

    @CreationTimestamp
    private Instant testTimestamp;
}
