package com.devlearninghub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class GithubSetupResponse {
    private boolean success;
    private String message;
}
