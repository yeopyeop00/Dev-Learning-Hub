package com.devlearninghub.backend.dto;

import com.devlearninghub.backend.entity.EventType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class CalendarRequest {
    private Long userId;
    private String title;
    private LocalDate date;
    private LocalTime time;
    private EventType type;
}
