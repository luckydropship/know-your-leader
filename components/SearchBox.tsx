'use client';

import { useState, useCallback } from 'react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const [query, setQuery] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="bg-white rounded-xl p-6 mb-8 shadow-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="🔍 Search candidates by name, party, state, or ID..."
          className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-lg outline-none transition-all focus:border-blue-900 focus:ring-4 focus:ring-blue-100"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
          >
            Clear
          </button>
        )}
      </div>
      {query && (
        <div className="mt-4 text-sm text-gray-600">
          Searching for: <strong>{query}</strong>
        </div>
      )}
    </div>
  );
}