import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  path: string;
  type: 'page' | 'feature';
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchData: SearchResult[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'View your projects and account overview',
      path: '/dashboard',
      type: 'page'
    },
    {
      id: 'services',
      title: 'Services',
      description: 'Browse available services and create quotations',
      path: '/services',
      type: 'page'
    },
    {
      id: 'projects',
      title: 'My Projects',
      description: 'View and manage your active projects',
      path: '/my-projects',
      type: 'page'
    },
    {
      id: 'quotations',
      title: 'My Quotations',
      description: 'View your quotation history and status',
      path: '/my-quotations',
      type: 'page'
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'View project analytics and insights',
      path: '/analytics',
      type: 'page'
    },
    {
      id: 'admin',
      title: 'Admin Panel',
      description: 'Administrative functions and settings',
      path: '/admin',
      type: 'page'
    }
  ];

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

    setResults(filtered);
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleResultClick(results[selectedIndex]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-50" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="search-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 overflow-hidden">
        <header className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Search className="text-gray-400 flex-shrink-0" size={20} aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search pages and features..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 outline-none text-gray-800 placeholder-gray-500"
              aria-label="Search for pages and features"
              aria-describedby="search-instructions"
            />
            <button 
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-primary-500 focus:outline-none rounded"
              aria-label="Close search modal"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
          <p id="search-instructions" className="sr-only">
            Use arrow keys to navigate results, Enter to select, Escape to close
          </p>
        </header>
        
        {query.trim() !== '' && (
          <div className="max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              <ul role="listbox" aria-label="Search results">
                {results.map((result, index) => (
                  <li key={result.id}>
                    <button
                      onClick={() => handleResultClick(result)}
                      className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 focus:bg-gray-50 focus:outline-none ${
                        index === selectedIndex ? 'bg-primary-50' : ''
                      }`}
                      role="option"
                      aria-selected={index === selectedIndex}
                    >
                      <div className="font-medium text-gray-800">{result.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{result.description}</div>
                      <div className="text-xs text-primary-600 mt-1">{result.type}</div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500" role="status">
                <Search size={40} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">Try searching for pages like "dashboard" or "services"</p>
              </div>
            )}
          </div>
        )}
        
        {query.trim() === '' && (
          <div className="p-8 text-center text-gray-500">
            <Search size={40} className="mx-auto mb-3 opacity-50" aria-hidden="true" />
            <p>Start typing to search pages and features</p>
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <span><kbd className="px-1 py-0.5 bg-gray-100 border rounded">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 border rounded">Enter</kbd> Select</span>
              <span><kbd className="px-1 py-0.5 bg-gray-100 border rounded">Esc</kbd> Close</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}