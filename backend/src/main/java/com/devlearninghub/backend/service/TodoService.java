package com.devlearninghub.backend.service;

import com.devlearninghub.backend.dto.TodoRequest;
import com.devlearninghub.backend.dto.TodoResponse;
import com.devlearninghub.backend.dto.TodoSummary;
import com.devlearninghub.backend.entity.TodoItem;
import com.devlearninghub.backend.entity.TodoStatus;
import com.devlearninghub.backend.entity.User;
import com.devlearninghub.backend.repository.TodoItemRepository;
import com.devlearninghub.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TodoService {

    private final TodoItemRepository todoItemRepository;
    private final UserRepository userRepository;

    public TodoService(TodoItemRepository todoItemRepository, UserRepository userRepository) {
        this.todoItemRepository = todoItemRepository;
        this.userRepository = userRepository;
    }

    public List<TodoResponse> getTodo(Long userId) {
        return todoItemRepository.findByUserId(userId).stream()
                .map(TodoResponse::new)
                .toList();
    }

    public TodoResponse addTodo(TodoRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TodoItem item = new TodoItem();
        item.setUser(user);
        item.setContent(request.getContent());
        item.setCategory(request.getCategory());
        item.setStatus(TodoStatus.PENDING);
        item.setCreatedAt(LocalDateTime.now());

        return new TodoResponse(todoItemRepository.save(item));
    }

    public TodoResponse toggleStatus(Long id) {
        TodoItem item = todoItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Todo not found"));
        item.setStatus(item.getStatus() == TodoStatus.PENDING ? TodoStatus.DONE : TodoStatus.PENDING);
        return new TodoResponse(todoItemRepository.save(item));
    }

    public void deleteTodo(Long id) {
        todoItemRepository.deleteById(id);
    }

    public TodoSummary getTodaySummary(Long userId) {
        List<TodoItem> items = todoItemRepository.findByUserId(userId);
        int total = items.size();
        int completed = (int) items.stream()
                .filter(item -> item.getStatus() == TodoStatus.DONE)
                .count();
        return new TodoSummary(total, completed);
    }
}
