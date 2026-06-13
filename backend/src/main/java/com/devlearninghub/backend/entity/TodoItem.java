package com.devlearninghub.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "todo_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TodoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String content;

    @Enumerated(EnumType.STRING)
    private TodoStatus status;

    private String category;
    private LocalDateTime createdAt;
}
