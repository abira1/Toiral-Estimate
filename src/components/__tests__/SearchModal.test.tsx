import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { SearchModal } from '../SearchModal';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const renderSearchModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn()
  };

  return render(
    <BrowserRouter>
      <SearchModal {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('SearchModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <BrowserRouter>
        <SearchModal isOpen={false} onClose={vi.fn()} />
      </BrowserRouter>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    renderSearchModal();
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search pages and features...')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderSearchModal();
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    
    const searchInput = screen.getByRole('textbox');
    expect(searchInput).toHaveAttribute('aria-label', 'Search for pages and features');
    expect(searchInput).toHaveAttribute('aria-describedby');
  });

  it('should focus search input when opened', async () => {
    renderSearchModal();
    
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveFocus();
    });
  });

  it('should call onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    renderSearchModal({ onClose });
    
    const closeButton = screen.getByLabelText('Close search modal');
    await userEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('should call onClose when Escape key is pressed', async () => {
    const onClose = vi.fn();
    renderSearchModal({ onClose });
    
    const searchInput = screen.getByRole('textbox');
    await userEvent.type(searchInput, '{Escape}');
    
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('should filter results based on search query', async () => {
    renderSearchModal();
    
    const searchInput = screen.getByRole('textbox');
    await userEvent.type(searchInput, 'dashboard');
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('View your projects and account overview')).toBeInTheDocument();
    });
  });

  it('should show "no results" message for non-matching query', async () => {
    renderSearchModal();
    
    const searchInput = screen.getByRole('textbox');
    await userEvent.type(searchInput, 'nonexistent');
    
    await waitFor(() => {
      expect(screen.getByText(/No results found for "nonexistent"/)).toBeInTheDocument();
    });
  });

  it('should navigate to selected result on click', async () => {
    renderSearchModal();
    
    const searchInput = screen.getByRole('textbox');
    await userEvent.type(searchInput, 'dashboard');
    
    await waitFor(() => {
      const dashboardOption = screen.getByText('Dashboard');
      expect(dashboardOption).toBeInTheDocument();
    });
    
    const dashboardButton = screen.getByRole('option', { name: /Dashboard/ });
    await userEvent.click(dashboardButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should navigate with keyboard navigation', async () => {
    renderSearchModal();
    
    const searchInput = screen.getByRole('textbox');
    await userEvent.type(searchInput, 'services');
    
    // Wait for results to appear
    await waitFor(() => {
      expect(screen.getByText('Services')).toBeInTheDocument();
    });
    
    // Press arrow down to select first result
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    
    // Press Enter to navigate
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    
    expect(mockNavigate).toHaveBeenCalledWith('/services');
  });

  it('should handle arrow key navigation properly', async () => {
    renderSearchModal();
    
    const searchInput = screen.getByRole('textbox');
    await userEvent.type(searchInput, 'a'); // This should return multiple results
    
    await waitFor(() => {
      expect(screen.getAllByRole('option').length).toBeGreaterThan(1);
    });
    
    const firstOption = screen.getAllByRole('option')[0];
    const secondOption = screen.getAllByRole('option')[1];
    
    // First option should be selected by default
    expect(firstOption).toHaveAttribute('aria-selected', 'true');
    
    // Arrow down should select second option
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    expect(secondOption).toHaveAttribute('aria-selected', 'true');
    
    // Arrow up should go back to first option
    fireEvent.keyDown(searchInput, { key: 'ArrowUp' });
    expect(firstOption).toHaveAttribute('aria-selected', 'true');
  });

  it('should show initial empty state', () => {
    renderSearchModal();
    
    expect(screen.getByText('Start typing to search pages and features')).toBeInTheDocument();
    expect(screen.getByText('Navigate')).toBeInTheDocument();
    expect(screen.getByText('Select')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('should clear search query when modal closes and reopens', async () => {
    const onClose = vi.fn();
    const { rerender } = renderSearchModal({ onClose });
    
    const searchInput = screen.getByRole('textbox');
    await userEvent.type(searchInput, 'test query');
    
    // Close modal
    rerender(
      <BrowserRouter>
        <SearchModal isOpen={false} onClose={onClose} />
      </BrowserRouter>
    );
    
    // Reopen modal
    rerender(
      <BrowserRouter>
        <SearchModal isOpen={true} onClose={onClose} />
      </BrowserRouter>
    );
    
    // Search input should be empty
    expect(screen.getByRole('textbox')).toHaveValue('');
  });
});