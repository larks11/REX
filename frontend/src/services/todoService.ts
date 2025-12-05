import { LOCAL_STORAGE_KEY } from '../constants';

/**
 * SERVICE LAYER (Pure JS)
 * 
 * Configured for MERN Stack usage.
 */

const USE_BACKEND = true; // Enabled for MERN

// If we are in production (built vite app), use relative path which proxies to the same server.
// If we are in dev (localhost:3000), point to localhost:5000.
// Vite defines import.meta.env.PROD
const API_BASE_URL = (import.meta as any).env.PROD 
  ? '/api/todos' 
  : 'http://localhost:5000/api/todos';

// --- LocalStorage Implementation (Fallback) ---
const getStoredTodos = () => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Storage error", e);
    return [];
  }
};
const saveStoredTodos = (todos: any) => localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));

// --- API Implementation (Real Mode) ---
const api = {
  getAll: async () => {
    try {
        const res = await fetch(API_BASE_URL);
        if (!res.ok) throw new Error('Failed to fetch todos');
        return res.json();
    } catch(e) {
        console.warn("Backend not reachable, returning empty array.");
        throw e;
    }
  },
  create: async (todo: any) => {
    const res = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Failed to create todo');
    return res.json();
  },
  update: async (todo: any) => {
    const res = await fetch(`${API_BASE_URL}/${todo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!res.ok) throw new Error('Failed to update todo');
    return res.json();
  },
  delete: async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete todo');
  },
};

// --- Unified Export ---
export const todoService = {
  async getAll() {
    if (USE_BACKEND) return api.getAll();
    return getStoredTodos();
  },

  async create(todo: any) {
    if (USE_BACKEND) return api.create(todo);

    const todos = getStoredTodos();
    const newTodos = [todo, ...todos];
    saveStoredTodos(newTodos);
    return todo;
  },

  async update(updatedTodo: any) {
    if (USE_BACKEND) return api.update(updatedTodo);

    const todos = getStoredTodos();
    const newTodos = todos.map((t: any) => t.id === updatedTodo.id ? updatedTodo : t);
    saveStoredTodos(newTodos);
    return updatedTodo;
  },

  async delete(id: string) {
    if (USE_BACKEND) return api.delete(id);

    const todos = getStoredTodos();
    const newTodos = todos.filter((t: any) => t.id !== id);
    saveStoredTodos(newTodos);
  },
};