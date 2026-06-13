package com.devlearninghub.backend.dto;

import com.devlearninghub.backend.entity.TimetableEntry;
import lombok.Getter;

import java.time.DayOfWeek;
import java.time.format.DateTimeFormatter;

@Getter
public class TimetableResponse {
    private Long id;
    private String subject;
    private String room;
    private DayOfWeek dayOfWeek;
    private String startTime;
    private int duration;
    private String color;

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("HH:mm");

    public TimetableResponse(TimetableEntry entry) {
        this.id = entry.getId();
        this.subject = entry.getSubject();
        this.room = entry.getRoom();
        this.dayOfWeek = entry.getDayOfWeek();
        this.startTime = entry.getStartTime() != null ? entry.getStartTime().format(TIME_FMT) : null;
        this.duration = entry.getDuration();
        this.color = entry.getColor();
    }
}
