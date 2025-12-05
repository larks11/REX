import React, { useState } from 'react';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group flex flex-col p-4 bg-white border border-slate-100 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md mb-3 ${
        todo.completed ? 'opacity-75' : 'opacity-100'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        {/* Main Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
            todo.completed
              ? 'bg-green-500 border-green-500'
              : 'border-slate-300 hover:border-indigo-400'
          }`}
          aria-label="Toggle completion"
        >
          {todo.completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Text Content */}
        <div className="flex-grow min-w-0">
          <p
            className={`text-lg transition-all duration-200 truncate ${
              todo.completed ? 'text-slate-400 line-through' : 'text-slate-800 font-medium'
            }`}
          >
            {todo.text}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;