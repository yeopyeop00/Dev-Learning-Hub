package com.devlearninghub.backend.controller;

import com.devlearninghub.backend.dto.TimetableRequest;
import com.devlearninghub.backend.dto.TimetableResponse;
import com.devlearninghub.backend.service.TimetableService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @GetMapping
    public ResponseEntity<List<TimetableResponse>> getTimetable(@RequestParam Long userId) {
        return ResponseEntity.ok(timetableService.getTimetable(userId));
    }

    @PostMapping
    public ResponseEntity<TimetableResponse> addEntry(@RequestBody TimetableRequest request) {
        return ResponseEntity.ok(timetableService.addEntry(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        timetableService.deleteEntry(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/today")
    public ResponseEntity<List<TimetableResponse>> getTodayClasses(@RequestParam Long userId) {
        return ResponseEntity.ok(timetableService.getTodayClasses(userId));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
