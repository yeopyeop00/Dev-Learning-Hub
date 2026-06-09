package com.devlearninghub.backend.service;

import com.devlearninghub.backend.dto.ProfileResponse;
import com.devlearninghub.backend.entity.User;
import com.devlearninghub.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private final UserRepository userRepository;

    public ProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new ProfileResponse(user);
    }

    public ProfileResponse updateNickname(Long userId, String nickname) {
        validateNickname(nickname);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setNickname(nickname);
        return new ProfileResponse(userRepository.save(user));
    }

    private void validateNickname(String nickname) {
        if (nickname == null || nickname.isBlank() || nickname.length() < 2 || nickname.length() > 20) {
            throw new RuntimeException("닉네임 형식 오류");
        }
    }
}
