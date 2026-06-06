import { useState } from "react";
import { useOutletContext } from "react-router";
import { Plus, Trash2, Check } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  category: string;
  priority: "high" | "medium" | "low";
}

interface OutletContext {
  isLoggedIn: boolean;
}

export function TodoList() {
  const { isLoggedIn } = useOutletContext<OutletContext>();
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "백준 1234번 풀기", completed: true, category: "알고리즘", priority: "high" },
    { id: 2, text: "자료구조 과제 제출", completed: true, category: "과제", priority: "high" },
    { id: 3, text: "React 프로젝트 진행", completed: false, category: "프로젝트", priority: "medium" },
    { id: 4, text: "운영체제 복습", completed: false, category: "학습", priority: "medium" },
    { id: 5, text: "알고리즘 강의 듣기", completed: false, category: "학습", priority: "low" },
  ]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          category: "일반",
          priority: "medium",
        },
      ]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600";
      case "low":
        return "bg-blue-500/10 text-blue-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  if (!isLoggedIn) {
    return (
      <div className="space-y-6">
        <div>
          <h2>Todo 리스트</h2>
          <p className="text-muted-foreground">로그인 후 이용 가능합니다</p>
        </div>
        <div className="flex items-center justify-center h-[400px] border border-border rounded-lg bg-card/50">
          <p className="text-muted-foreground">로그인하여 할 일을 관리하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Todo 리스트</h2>
        <p className="text-muted-foreground">오늘 할 일을 관리하세요</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">전체</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">완료</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <p className="text-sm text-muted-foreground">진행 중</p>
          <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        </div>
      </div>

      {/* Add Todo */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTodo()}
            placeholder="새로운 할 일을 입력하세요..."
            className="flex-1 px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={addTodo}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            추가
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg ${
            filter === "all" ? "bg-primary text-primary-foreground" : "bg-accent"
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg ${
            filter === "active" ? "bg-primary text-primary-foreground" : "bg-accent"
          }`}
        >
          진행 중
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg ${
            filter === "completed" ? "bg-primary text-primary-foreground" : "bg-accent"
          }`}
        >
          완료
        </button>
      </div>

      {/* Todo List */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-4 p-4 bg-accent rounded-lg group"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  todo.completed
                    ? "bg-primary border-primary"
                    : "border-muted-foreground hover:border-primary"
                }`}
              >
                {todo.completed && <Check className="w-4 h-4 text-primary-foreground" />}
              </button>

              <div className="flex-1">
                <p className={todo.completed ? "line-through text-muted-foreground" : ""}>
                  {todo.text}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {todo.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(todo.priority)}`}>
                    {todo.priority}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/10 rounded-lg transition-opacity"
              >
                <Trash2 className="w-5 h-5 text-destructive" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
