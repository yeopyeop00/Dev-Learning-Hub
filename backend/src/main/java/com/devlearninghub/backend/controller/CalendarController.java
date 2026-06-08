package com.devlearninghub.backend.controller;

import com.devlearninghub.backend.dto.CalendarRequest;
import com.devlearninghub.backend.dto.CalendarResponse;
import com.devlearninghub.backend.service.CalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping
    public ResponseEntity<List<CalendarResponse>> getEvents(@RequestParam Long userId) {
        return ResponseEntity.ok(calendarService.getEvents(userId));
    }

    @PostMapping
    public ResponseEntity<CalendarResponse> addEvent(@RequestBody CalendarRequest request) {
        return ResponseEntity.ok(calendarService.addEvent(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        calendarService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<CalendarResponse>> getUpcoming(@RequestParam Long userId) {
        return ResponseEntity.ok(calendarService.getUpcoming(userId));
    }
}
