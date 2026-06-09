package com.devlearninghub.backend.dto;

import com.devlearninghub.backend.entity.TodoItem;
import com.devlearninghub.backend.entity.TodoStatus;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class TodoResponse {
    private Long id;
    private String content;
    private TodoStatus status;
    private String category;
    private int priority;
    private LocalDateTime createdAt;

    public TodoResponse(TodoItem item) {
        this.id = item.getId();
        this.content = item.getContent();
        this.status = item.getStatus();
        this.category = item.getCategory();
        this.priority = item.getPriority();
        this.createdAt = item.getCreatedAt();
    }
}
