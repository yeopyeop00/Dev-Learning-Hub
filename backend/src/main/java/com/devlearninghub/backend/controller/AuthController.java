package com.devlearninghub.backend.controller;

import com.devlearninghub.backend.dto.AuthResponse;
import com.devlearninghub.backend.dto.LoginRequest;
import com.devlearninghub.backend.dto.SignupRequest;
import com.devlearninghub.backend.entity.User;
import com.devlearninghub.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        User user = authService.signup(request.getEmail(), request.getPwd(), request.getPwdConfirm());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(true, "회원가입이 완료되었습니다.", null));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = authService.login(request.getEmail(), request.getPwd());
        return ResponseEntity.ok(new AuthResponse(true, "로그인 성공", token));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        authService.logout();
        return ResponseEntity.ok(new AuthResponse(true, "로그아웃 되었습니다.", null));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<AuthResponse> handleResponseStatusException(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode())
                .body(new AuthResponse(false, e.getReason(), null));
    }
}
