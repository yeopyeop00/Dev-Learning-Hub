package com.devlearninghub.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NicknameRequest {
    private Long userId;
    private String nickname;
}
