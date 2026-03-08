export interface Todo {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

const KEY = "habitflow_todos";

export function getTodos(): Todo[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(KEY, JSON.stringify(todos));
}

export function addTodo(text: string): Todo {
  const todos = getTodos();
  const todo: Todo = { id: crypto.randomUUID(), text, done: false, createdAt: new Date().toISOString() };
  todos.unshift(todo);
  saveTodos(todos);
  return todo;
}

export function toggleTodo(id: string) {
  const todos = getTodos().map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  saveTodos(todos);
}

export function deleteTodo(id: string) {
  saveTodos(getTodos().filter((t) => t.id !== id));
}
