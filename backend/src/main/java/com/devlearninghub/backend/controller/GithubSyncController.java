package com.devlearninghub.backend.controller;

import com.devlearninghub.backend.dto.*;
import com.devlearninghub.backend.service.GithubSyncService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/github")
public class GithubSyncController {

    private final GithubSyncService githubSyncService;

    public GithubSyncController(GithubSyncService githubSyncService) {
        this.githubSyncService = githubSyncService;
    }

    @PostMapping("/setup")
    public ResponseEntity<?> setupAccount(@RequestBody GithubSetupRequest request) {
        return ResponseEntity.ok(githubSyncService.setupAccount(request));
    }

    @GetMapping("/stat")
    public ResponseEntity<?> getGithubStat(@RequestParam Long userId) {
        return ResponseEntity.ok(githubSyncService.getGithubStat(userId));
    }

    @GetMapping("/programmers")
    public ResponseEntity<?> getProgrammersStat(@RequestParam Long userId) {
        return ResponseEntity.ok(githubSyncService.getProgrammersStat(userId));
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncAll(@RequestParam Long userId) {
        return ResponseEntity.ok(githubSyncService.syncAll(userId));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
