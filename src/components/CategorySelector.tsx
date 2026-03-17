import React from 'react';
import { X } from 'lucide-react';

interface CategorySelectorProps {
  title: string;
  items: string[];
  selectedItems: string[];
  maxSelections: number;
  onToggle: (item: string) => void;
  onClear: () => void;
}

export function CategorySelector({
  title,
  items,
  selectedItems,
  maxSelections,
  onToggle,
  onClear
}: CategorySelectorProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">{title}</h3>
          <span className="text-xs text-zinc-500">
            ({selectedItems.length}/{maxSelections})
          </span>
        </div>
        {selectedItems.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-zinc-400 hover:text-orange-500 transition-colors flex items-center gap-1"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isSelected = selectedItems.includes(item);
          const isDisabled = !isSelected && selectedItems.length >= maxSelections;
          
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              disabled={isDisabled}
              className={`px-4 py-2 text-sm rounded-full transition-all duration-200 border ${
                isSelected
                  ? 'bg-orange-500 border-orange-500 text-black font-medium shadow-[0_0_10px_rgba(249,115,22,0.3)]'
                  : isDisabled
                  ? 'bg-zinc-900/50 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}
