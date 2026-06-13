package com.devlearninghub.backend.dto;

import com.devlearninghub.backend.entity.ActivityLog;
import lombok.Getter;

@Getter
public class ActivityLogResponse {
    private final String message;
    private final String date;

    public ActivityLogResponse(ActivityLog log) {
        this.message = log.getMessage();
        this.date = log.getDate() != null ? log.getDate().toString() : null;
    }
}
