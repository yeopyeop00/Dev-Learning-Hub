package com.devlearninghub.backend.dto;

import com.devlearninghub.backend.entity.TimetableEntry;
import lombok.Getter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Getter
public class TimetableResponse {
    private Long id;
    private String subject;
    private String room;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private int duration;
    private String color;

    public TimetableResponse(TimetableEntry entry) {
        this.id = entry.getId();
        this.subject = entry.getSubject();
        this.room = entry.getRoom();
        this.dayOfWeek = entry.getDayOfWeek();
        this.startTime = entry.getStartTime();
        this.duration = entry.getDuration();
        this.color = entry.getColor();
    }
}
