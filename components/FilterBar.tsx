import React from 'react';

const FilterType = {
  ALL: 'ALL',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
};

const FilterBar = ({ currentFilter, onFilterChange, itemsLeft, onClearCompleted }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-slate-500 mt-6 pt-4 border-t border-slate-100 gap-4">
      <span className="font-medium">{itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left</span>
      
      <div className="flex p-1 bg-slate-100 rounded-lg self-center">
        {Object.values(FilterType).map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-1.5 rounded-md transition-all duration-200 capitalize font-medium ${
              currentFilter === filter
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {filter.toLowerCase()}
          </button>
        ))}
      </div>

      <button
        onClick={onClearCompleted}
        className="text-slate-400 hover:text-red-500 transition-colors text-right sm:text-left"
      >
        Clear completed
      </button>
    </div>
  );
};

export default FilterBar;