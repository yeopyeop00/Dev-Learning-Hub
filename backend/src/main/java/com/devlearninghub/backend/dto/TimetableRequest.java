package com.devlearninghub.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
@Setter
public class TimetableRequest {
    private Long userId;
    private String subject;
    private String room;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private int duration;
    private String color;
}
