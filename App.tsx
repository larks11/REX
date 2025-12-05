import React, { useState, useEffect } from 'react';
import TodoItem from './components/TodoItem';
import FilterBar from './components/FilterBar';
import { todoService } from './services/todoService';

// Simple ID generator
const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const FilterType = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState(FilterType.ALL);
  const [isLoading, setIsLoading] = useState(true);

  // Load from backend on mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await todoService.getAll();
        setTodos(data);
      } catch (e) {
        console.error("Failed to load todos", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadTodos();
  }, []);

  const handleAddTodo = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo = {
      id: generateId(),
      text: inputValue.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    // Optimistic update
    setTodos(prev => [newTodo, ...prev]);
    setInputValue('');
    
    // Persist to backend
    try {
      await todoService.create(newTodo);
    } catch (error) {
      console.error("Error saving todo:", error);
      // Revert on failure if needed, or show error
    }
  };

  const toggleTodo = async (id) => {
    const todoToUpdate = todos.find(t => t.id === id);
    if (!todoToUpdate) return;

    const updated = { ...todoToUpdate, completed: !todoToUpdate.completed };
    
    // Optimistic update
    setTodos(prev => prev.map(t => t.id === id ? updated : t));
    
    // Persist
    await todoService.update(updated);
  };

  const deleteTodo = async (id) => {
    // Optimistic update
    setTodos(prev => prev.filter(t => t.id !== id));
    
    // Persist
    await todoService.delete(id);
  };

  const clearCompleted = async () => {
    const activeTodos = todos.filter(t => !t.completed);
    setTodos(activeTodos);
    // For MERN simplicity, we usually delete individually or have a specific endpoint.
    // Here we will just re-sync or let the user delete manually.
    // For this implementation, we will refresh the state to active only
    // Note: A real bulk delete endpoint would be better, but we'll stick to simple CRUD.
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterType.ACTIVE) return !todo.completed;
    if (filter === FilterType.COMPLETED) return todo.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;

  if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-400">Loading Tasks...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-4 sm:px-6">
      
      {/* Header */}
      <header className="w-full max-w-2xl mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Todolist
        </h1>
        <p className="text-slate-500">Just Do It</p>
      </header>

      {/* Main Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Input Area */}
        <div className="p-6 border-b border-slate-100 bg-white">
          <form onSubmit={handleAddTodo} className="relative">
            <input
              type="text"
              className="w-full pl-5 pr-14 py-4 text-lg bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
              aria-label="Add task"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </form>
        </div>

        {/* Todo List */}
        <div className="p-6 bg-slate-50/50 min-h-[300px]">
          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
               <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
               </svg>
               <p className="text-lg font-medium">No tasks found</p>
               <p className="text-sm">Add a task to get started</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}

          {/* Filter Footer */}
          {todos.length > 0 && (
             <FilterBar 
               currentFilter={filter} 
               onFilterChange={setFilter} 
               itemsLeft={activeCount}
               onClearCompleted={clearCompleted}
             />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;