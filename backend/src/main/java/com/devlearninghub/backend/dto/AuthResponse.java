package com.devlearninghub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private String token;
    private Long userId;
    private String nickname;
}
