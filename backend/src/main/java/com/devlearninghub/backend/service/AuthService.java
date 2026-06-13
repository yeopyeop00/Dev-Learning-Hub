package com.devlearninghub.backend.service;

import com.devlearninghub.backend.entity.User;
import com.devlearninghub.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public User signup(String email, String pwd, String pwdConfirm) {
        if (!validateEmail(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이메일 형식이 올바르지 않습니다.");
        }
        if (!validatePwdMatch(pwd, pwdConfirm)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "비밀번호가 일치하지 않습니다.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다.");
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(pwd));
        return userRepository.save(user);
    }

    public User login(String email, String pwd) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(pwd, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        return user;
    }

    public void logout() {
        // 세션 토큰 무효화는 추후 토큰 저장소 연동 시 구현
    }

    public boolean validateEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public boolean validatePwdMatch(String pwd, String pwdConfirm) {
        return pwd != null && pwd.equals(pwdConfirm);
    }
}
