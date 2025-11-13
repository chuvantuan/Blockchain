package com.dao.adminservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrackDemoResponse {
    private String originalPassword;
    private List<CrackResult> results;
}
