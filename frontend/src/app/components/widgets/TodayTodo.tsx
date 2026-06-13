import { useEffect, useState } from "react";
import { CheckSquare } from "lucide-react";
import { getTodos, type TodoResponse } from "../../../api";

export function TodayTodo() {
  const [todos, setTodos] = useState<TodoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTodos()
      .then((items) => setTodos(items.slice(0, 5)))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare className="w-5 h-5 text-primary" />
        <h3>오늘의 Todo</h3>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">불러오는 중...</p>
      ) : todos.length === 0 ? (
        <p className="text-sm text-muted-foreground">오늘의 할 일이 없습니다</p>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => {
            const isDone = todo.status === "DONE";
            return (
              <div key={todo.id} className="p-3 bg-accent rounded-lg">
                <span className={`text-sm ${isDone ? "line-through text-muted-foreground" : ""}`}>
                  {todo.content}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
