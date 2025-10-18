import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { KeyboardShortcut, getShortcutDisplay } from '../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

export function KeyboardShortcutsModal({ isOpen, onClose, shortcuts }: KeyboardShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="text-primary-600" size={24} aria-hidden="true" />
            <h2 id="shortcuts-modal-title" className="text-xl font-semibold text-gray-800">
              Keyboard Shortcuts
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-primary-500 focus:outline-none rounded"
            aria-label="Close shortcuts modal"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <span className="text-gray-700">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                {getShortcutDisplay(shortcut)}
              </kbd>
            </div>
          ))}
        </div>
        
        <footer className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Press <kbd className="px-1 py-0.5 text-xs font-semibold bg-gray-100 border rounded">?</kbd> to show/hide this help
          </p>
        </footer>
      </div>
    </div>
  );
}