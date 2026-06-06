package com.devlearninghub.backend.repository;

import com.devlearninghub.backend.entity.TodoItem;
import com.devlearninghub.backend.entity.TodoStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TodoItemRepository extends JpaRepository<TodoItem, Long> {
    List<TodoItem> findByUserId(Long userId);
    List<TodoItem> findByStatus(TodoStatus status);
    List<TodoItem> findByCategory(String category);
}
