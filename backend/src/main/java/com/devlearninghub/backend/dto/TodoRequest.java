package com.devlearninghub.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TodoRequest {
    private Long userId;
    private String content;
    private String category;
}
