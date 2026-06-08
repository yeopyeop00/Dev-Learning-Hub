package com.devlearninghub.backend.service;

import com.devlearninghub.backend.dto.CalendarRequest;
import com.devlearninghub.backend.dto.CalendarResponse;
import com.devlearninghub.backend.entity.CalendarEvent;
import com.devlearninghub.backend.entity.EventType;
import com.devlearninghub.backend.entity.User;
import com.devlearninghub.backend.repository.CalendarEventRepository;
import com.devlearninghub.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CalendarService {

    private final CalendarEventRepository calendarEventRepository;
    private final UserRepository userRepository;

    public CalendarService(CalendarEventRepository calendarEventRepository, UserRepository userRepository) {
        this.calendarEventRepository = calendarEventRepository;
        this.userRepository = userRepository;
    }

    public List<CalendarResponse> getEvents(Long userId) {
        return calendarEventRepository.findByUserId(userId).stream()
                .map(CalendarResponse::new)
                .toList();
    }

    public CalendarResponse addEvent(CalendarRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        CalendarEvent event = new CalendarEvent();
        event.setUser(user);
        event.setTitle(request.getTitle());
        event.setDate(request.getDate());
        event.setTime(request.getTime());
        event.setType(request.getType());
        event.setColor(assignColor(request.getType()));

        return new CalendarResponse(calendarEventRepository.save(event));
    }

    public void deleteEvent(Long id) {
        calendarEventRepository.deleteById(id);
    }

    public List<CalendarResponse> getUpcoming(Long userId) {
        return calendarEventRepository.findByUserId(userId).stream()
                .filter(e -> !e.getDate().isBefore(LocalDate.now()))
                .map(CalendarResponse::new)
                .toList();
    }

    private String assignColor(EventType type) {
        return switch (type) {
            case CLASS -> "#4A90D9";
            case ASSIGNMENT -> "#E67E22";
            case EXAM -> "#E74C3C";
            case STUDY -> "#27AE60";
            case PERSONAL -> "#888888";
        };
    }
}
