package com.devlearninghub.backend.service;

import com.devlearninghub.backend.dto.TimetableRequest;
import com.devlearninghub.backend.dto.TimetableResponse;
import com.devlearninghub.backend.entity.TimetableEntry;
import com.devlearninghub.backend.entity.User;
import com.devlearninghub.backend.repository.TimetableEntryRepository;
import com.devlearninghub.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class TimetableService {

    private final TimetableEntryRepository timetableEntryRepository;
    private final UserRepository userRepository;

    public TimetableService(TimetableEntryRepository timetableEntryRepository, UserRepository userRepository) {
        this.timetableEntryRepository = timetableEntryRepository;
        this.userRepository = userRepository;
    }

    public List<TimetableResponse> getTimetable(Long userId) {
        return timetableEntryRepository.findByUserId(userId).stream()
                .map(TimetableResponse::new)
                .toList();
    }

    public TimetableResponse addEntry(TimetableRequest request) {
        validateInput(request);
        checkTimeConflict(request);

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TimetableEntry entry = new TimetableEntry();
        entry.setUser(user);
        entry.setSubject(request.getSubject());
        entry.setRoom(request.getRoom());
        entry.setDayOfWeek(request.getDayOfWeek());
        entry.setStartTime(request.getStartTime());
        entry.setDuration(request.getDuration());
        entry.setColor(request.getColor());

        return new TimetableResponse(timetableEntryRepository.save(entry));
    }

    public void deleteEntry(Long id) {
        timetableEntryRepository.deleteById(id);
    }

    public List<TimetableResponse> getTodayClasses(Long userId) {
        DayOfWeek today = DayOfWeek.from(LocalDate.now());
        return timetableEntryRepository.findByUserId(userId).stream()
                .filter(e -> e.getDayOfWeek() == today)
                .map(TimetableResponse::new)
                .toList();
    }

    private void validateInput(TimetableRequest request) {
        if (request.getSubject() == null || request.getSubject().isBlank()
                || request.getDayOfWeek() == null
                || request.getStartTime() == null) {
            throw new RuntimeException("필수 항목 누락");
        }
    }

    private void checkTimeConflict(TimetableRequest request) {
        List<TimetableEntry> existing = timetableEntryRepository.findByUserId(request.getUserId());
        LocalTime newStart = request.getStartTime();
        int newDuration = request.getDuration();

        for (TimetableEntry entry : existing) {
            if (entry.getDayOfWeek() != request.getDayOfWeek()) continue;

            LocalTime existStart = entry.getStartTime();
            int existDuration = entry.getDuration();

            if (existStart.isBefore(newStart.plusMinutes(newDuration))
                    && newStart.isBefore(existStart.plusMinutes(existDuration))) {
                throw new RuntimeException("시간 충돌");
            }
        }
    }
}
