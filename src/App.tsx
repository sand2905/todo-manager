import { useState, useEffect, useMemo } from 'react';
import type { Todo } from './types';
import { TodoInput } from './components/TodoInput';
import { TodoItem } from './components/TodoItem';
import { TodoFilter } from './components/TodoFilter';
import type { Filter } from './components/TodoFilter';
import './App.css';

const STORAGE_KEY = 'todo-manager-items';

function loadTodos(): Todo[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos]
  );

  const filtered = useMemo(
    () =>
      todos.filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      }),
    [todos, filter]
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Todo Manager</h1>
        <p className="subtitle">Stay organized, get things done</p>
      </header>

      <main className="todo-container">
        <TodoInput onAdd={addTodo} />
        <TodoFilter current={filter} onChange={setFilter} counts={counts} />

        {filtered.length === 0 ? (
          <p className="empty-state">
            {filter === 'all'
              ? 'No tasks yet. Add one above!'
              : `No ${filter} tasks.`}
          </p>
        ) : (
          <ul className="todo-list">
            {filtered.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            ))}
          </ul>
        )}

        {counts.completed > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            Clear completed ({counts.completed})
          </button>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with React + TypeScript + Vite</p>
      </footer>
    </div>
  );
}

export default App;
