package com.devlearninghub.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TodoSummary {
    private int total;
    private int completed;
}
