package com.devlearninghub.backend.dto;

import com.devlearninghub.backend.entity.User;
import lombok.Getter;

@Getter
public class ProfileResponse {
    private Long id;
    private String email;
    private String nickname;
    private String profileImagePath;
    private String githubUsername;
    private String programmersRepo;

    public ProfileResponse(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.profileImagePath = user.getProfileImagePath();
        this.githubUsername = user.getGithubUsername();
        this.programmersRepo = user.getProgrammersRepo();
    }
}
