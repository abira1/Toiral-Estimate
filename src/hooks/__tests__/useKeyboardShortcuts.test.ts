import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts, getShortcutDisplay, KeyboardShortcut } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  let mockAction1: ReturnType<typeof vi.fn>;
  let mockAction2: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockAction1 = vi.fn();
    mockAction2 = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should register keyboard shortcuts', () => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        ctrlKey: true,
        action: mockAction1,
        description: 'Open search'
      }
    ];

    const { result } = renderHook(() => useKeyboardShortcuts(shortcuts));
    expect(result.current).toEqual(shortcuts);
  });

  it('should trigger action when correct key combination is pressed', () => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        ctrlKey: true,
        action: mockAction1,
        description: 'Open search'
      }
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Simulate Ctrl+K keydown event
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true
    });

    Object.defineProperty(event, 'preventDefault', {
      value: vi.fn(),
      writable: true
    });

    document.dispatchEvent(event);
    expect(mockAction1).toHaveBeenCalledOnce();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should not trigger action for incorrect key combination', () => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        ctrlKey: true,
        action: mockAction1,
        description: 'Open search'
      }
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Simulate just 'k' without ctrl
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: false,
      bubbles: true
    });

    document.dispatchEvent(event);
    expect(mockAction1).not.toHaveBeenCalled();
  });

  it('should handle multiple shortcuts', () => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        ctrlKey: true,
        action: mockAction1,
        description: 'Open search'
      },
      {
        key: '?',
        action: mockAction2,
        description: 'Show help'
      }
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    // Test first shortcut
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true
    }));
    expect(mockAction1).toHaveBeenCalledOnce();

    // Test second shortcut
    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: '?',
      ctrlKey: false,
      bubbles: true
    }));
    expect(mockAction2).toHaveBeenCalledOnce();
  });

  it('should handle Meta key (Cmd on Mac)', () => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        metaKey: true,
        action: mockAction1,
        description: 'Open search'
      }
    ];

    renderHook(() => useKeyboardShortcuts(shortcuts));

    document.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true
    }));
    expect(mockAction1).toHaveBeenCalledOnce();
  });
});

describe('getShortcutDisplay', () => {
  beforeEach(() => {
    // Mock navigator.platform
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      writable: true
    });
  });

  it('should display Ctrl key on non-Mac platforms', () => {
    Object.defineProperty(navigator, 'platform', {
      value: 'Win32',
      writable: true
    });

    const shortcut: KeyboardShortcut = {
      key: 'k',
      ctrlKey: true,
      action: vi.fn(),
      description: 'Test'
    };

    expect(getShortcutDisplay(shortcut)).toBe('Ctrl + K');
  });

  it('should display Cmd (⌘) key on Mac platforms', () => {
    const shortcut: KeyboardShortcut = {
      key: 'k',
      metaKey: true,
      action: vi.fn(),
      description: 'Test'
    };

    expect(getShortcutDisplay(shortcut)).toBe('⌘ + K');
  });

  it('should display multiple modifier keys', () => {
    const shortcut: KeyboardShortcut = {
      key: 'k',
      ctrlKey: true,
      shiftKey: true,
      altKey: true,
      action: vi.fn(),
      description: 'Test'
    };

    expect(getShortcutDisplay(shortcut)).toBe('Ctrl + Shift + Alt + K');
  });

  it('should display key without modifiers', () => {
    const shortcut: KeyboardShortcut = {
      key: '?',
      action: vi.fn(),
      description: 'Test'
    };

    expect(getShortcutDisplay(shortcut)).toBe('?');
  });
});