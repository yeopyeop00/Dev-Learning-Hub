package com.devlearninghub.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GithubSetupRequest {
    private Long userId;
    private String githubUsername;
    private String programmersRepo;
}
