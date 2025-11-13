package com.dao.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrackResult {
    private String algorithm;
    private String hash;
    private boolean cracked;
    private long timeTakenMs;
    private long attempts;
    private String crackedPassword;
}
