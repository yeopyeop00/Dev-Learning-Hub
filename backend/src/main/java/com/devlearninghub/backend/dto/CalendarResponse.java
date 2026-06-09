package com.devlearninghub.backend.dto;

import com.devlearninghub.backend.entity.CalendarEvent;
import com.devlearninghub.backend.entity.EventType;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
public class CalendarResponse {
    private Long id;
    private String title;
    private LocalDate date;
    private LocalTime time;
    private EventType type;
    private String color;

    public CalendarResponse(CalendarEvent event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.date = event.getDate();
        this.time = event.getTime();
        this.type = event.getType();
        this.color = event.getColor();
    }
}
