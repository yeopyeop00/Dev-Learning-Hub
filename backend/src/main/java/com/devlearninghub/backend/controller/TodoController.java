package com.devlearninghub.backend.controller;

import com.devlearninghub.backend.dto.TodoRequest;
import com.devlearninghub.backend.dto.TodoResponse;
import com.devlearninghub.backend.dto.TodoSummary;
import com.devlearninghub.backend.service.TodoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
public class TodoController {

    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public ResponseEntity<List<TodoResponse>> getTodo(@RequestParam Long userId) {
        return ResponseEntity.ok(todoService.getTodo(userId));
    }

    @PostMapping
    public ResponseEntity<TodoResponse> addTodo(@RequestBody TodoRequest request) {
        return ResponseEntity.ok(todoService.addTodo(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TodoResponse> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.toggleStatus(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<TodoSummary> getTodaySummary(@RequestParam Long userId) {
        return ResponseEntity.ok(todoService.getTodaySummary(userId));
    }
}
