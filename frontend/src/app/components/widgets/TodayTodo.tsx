import { CheckSquare } from "lucide-react";
import { useState } from "react";

export function TodayTodo() {
  const [todos, setTodos] = useState([
    { id: 1, text: "백준 1문제 풀기", completed: true },
    { id: 2, text: "알고리즘 과제 제출", completed: true },
    { id: 3, text: "React 프로젝트 진행", completed: false },
    { id: 4, text: "자료구조 복습", completed: false },
    { id: 5, text: "운영체제 강의 듣기", completed: false },
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare className="w-5 h-5 text-primary" />
        <h3>오늘의 Todo</h3>
      </div>
      <div className="space-y-2">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-3 p-3 bg-accent rounded-lg cursor-pointer hover:bg-accent/80"
            onClick={() => toggleTodo(todo.id)}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                todo.completed
                  ? "bg-primary border-primary"
                  : "border-muted-foreground"
              }`}
            >
              {todo.completed && (
                <svg
                  className="w-3 h-3 text-primary-foreground"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className={todo.completed ? "line-through text-muted-foreground" : ""}>
              {todo.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
