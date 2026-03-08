import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, CheckCircle2, Circle } from "lucide-react";
import { getTodos, addTodo, toggleTodo, deleteTodo, Todo } from "@/lib/todos";

interface TodoSectionProps {
  refreshKey: number;
}

export default function TodoSection({ refreshKey }: TodoSectionProps) {
  const [todos, setTodos] = useState<Todo[]>(() => getTodos());
  const [input, setInput] = useState("");
  const [showInput, setShowInput] = useState(false);

  const refresh = () => setTodos(getTodos());

  const handleAdd = () => {
    const text = input.trim();
    if (!text) return;
    addTodo(text);
    setInput("");
    setShowInput(false);
    refresh();
  };

  const handleToggle = (id: string) => {
    toggleTodo(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteTodo(id);
    refresh();
  };

  // Only show today's todos
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayTodos = todos.filter((t) => t.createdAt.slice(0, 10) === todayStr);
  const doneCount = todayTodos.filter((t) => t.done).length;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-muted-foreground">
          오늘의 할 일 {todayTodos.length > 0 && (
            <span className="text-xs font-normal ml-1">({doneCount}/{todayTodos.length})</span>
          )}
        </p>
        <button
          onClick={() => setShowInput(!showInput)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-secondary/50 text-secondary-foreground text-xs font-semibold hover:bg-secondary/70 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> 추가
        </button>
      </div>

      <AnimatePresence>
        {showInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-3"
          >
            <form
              onSubmit={(e) => { e.preventDefault(); handleAdd(); }}
              className="flex gap-2"
            >
              <input
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="할 일 입력..."
                className="flex-1 text-sm px-3 py-2 rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
              >
                추가
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {todayTodos.length === 0 && !showInput ? (
        <p className="text-xs text-muted-foreground/60 text-center py-4">할 일을 추가해보세요 ✏️</p>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {todayTodos.map((todo) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-card border border-border/50 group ${
                  todo.done ? "opacity-50" : ""
                }`}
              >
                <button onClick={() => handleToggle(todo.id)} className="shrink-0">
                  {todo.done ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground/40" />
                  )}
                </button>
                <span className={`text-sm flex-1 ${todo.done ? "line-through text-muted-foreground" : ""}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground/50" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
