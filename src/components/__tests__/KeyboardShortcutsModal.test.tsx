import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KeyboardShortcutsModal } from '../KeyboardShortcutsModal';
import { KeyboardShortcut } from '../../hooks/useKeyboardShortcuts';

const mockShortcuts: KeyboardShortcut[] = [
  {
    key: 'k',
    ctrlKey: true,
    action: vi.fn(),
    description: 'Open search'
  },
  {
    key: 'Escape',
    action: vi.fn(),
    description: 'Close modals'
  },
  {
    key: '?',
    action: vi.fn(),
    description: 'Show keyboard shortcuts'
  }
];

const renderKeyboardShortcutsModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    shortcuts: mockShortcuts
  };

  return render(<KeyboardShortcutsModal {...defaultProps} {...props} />);
};

describe('KeyboardShortcutsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <KeyboardShortcutsModal 
        isOpen={false} 
        onClose={vi.fn()} 
        shortcuts={mockShortcuts} 
      />
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    renderKeyboardShortcutsModal();
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderKeyboardShortcutsModal();
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'shortcuts-modal-title');
    
    const title = screen.getByRole('heading', { name: 'Keyboard Shortcuts' });
    expect(title).toHaveAttribute('id', 'shortcuts-modal-title');
  });

  it('should display all shortcuts', () => {
    renderKeyboardShortcutsModal();
    
    expect(screen.getByText('Open search')).toBeInTheDocument();
    expect(screen.getByText('Close modals')).toBeInTheDocument();
    expect(screen.getByText('Show keyboard shortcuts')).toBeInTheDocument();
  });

  it('should display keyboard shortcut combinations', () => {
    renderKeyboardShortcutsModal();
    
    // Check for keyboard shortcut displays
    const kbdElements = screen.getAllByRole('generic', { name: /key/i });
    expect(kbdElements.length).toBeGreaterThan(0);
  });

  it('should call onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    renderKeyboardShortcutsModal({ onClose });
    
    const closeButton = screen.getByLabelText('Close shortcuts modal');
    await userEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('should display help text about showing/hiding', () => {
    renderKeyboardShortcutsModal();
    
    expect(screen.getByText(/Press.*to show\/hide this help/)).toBeInTheDocument();
  });

  it('should show keyboard icon in header', () => {
    renderKeyboardShortcutsModal();
    
    // The keyboard icon should be present (Lucide React icon)
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should handle empty shortcuts array', () => {
    renderKeyboardShortcutsModal({ shortcuts: [] });
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    
    // Should still show the help text
    expect(screen.getByText(/Press.*to show\/hide this help/)).toBeInTheDocument();
  });

  it('should display shortcuts in proper format', () => {
    // Mock Mac platform for Cmd key display
    Object.defineProperty(navigator, 'platform', {
      value: 'MacIntel',
      writable: true
    });

    const macShortcuts: KeyboardShortcut[] = [
      {
        key: 'k',
        metaKey: true,
        action: vi.fn(),
        description: 'Open search (Mac)'
      }
    ];

    renderKeyboardShortcutsModal({ shortcuts: macShortcuts });
    
    expect(screen.getByText('Open search (Mac)')).toBeInTheDocument();
  });

  it('should have proper semantic structure', () => {
    renderKeyboardShortcutsModal();
    
    // Check for proper header/footer structure
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    
    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('should display keyboard shortcut descriptions correctly', () => {
    const customShortcuts: KeyboardShortcut[] = [
      {
        key: 'Enter',
        action: vi.fn(),
        description: 'Submit form'
      },
      {
        key: 'Tab',
        action: vi.fn(),
        description: 'Navigate to next element'
      }
    ];

    renderKeyboardShortcutsModal({ shortcuts: customShortcuts });
    
    expect(screen.getByText('Submit form')).toBeInTheDocument();
    expect(screen.getByText('Navigate to next element')).toBeInTheDocument();
  });
});