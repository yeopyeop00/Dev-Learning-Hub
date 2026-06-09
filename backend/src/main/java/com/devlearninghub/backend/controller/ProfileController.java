package com.devlearninghub.backend.controller;

import com.devlearninghub.backend.dto.NicknameRequest;
import com.devlearninghub.backend.dto.ProfileResponse;
import com.devlearninghub.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(@RequestParam Long userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PatchMapping("/nickname")
    public ResponseEntity<ProfileResponse> updateNickname(@RequestBody NicknameRequest request) {
        return ResponseEntity.ok(profileService.updateNickname(request.getUserId(), request.getNickname()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
