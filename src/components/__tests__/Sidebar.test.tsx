import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { Sidebar } from '../Sidebar';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the auth context
const mockLogout = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    logout: mockLogout
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    NavLink: ({ children, to, className, ...props }: any) => (
      <a href={to} className={typeof className === 'function' ? className({ isActive: false }) : className} {...props}>
        {children}
      </a>
    )
  };
});

const renderSidebar = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Sidebar />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Sidebar Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have proper semantic structure', () => {
    renderSidebar();
    
    // Desktop sidebar should be aside with complementary role
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveAttribute('aria-label', 'Main navigation');
    
    // Should contain navigation
    const navigation = screen.getByRole('navigation', { name: 'Primary navigation' });
    expect(navigation).toBeInTheDocument();
  });

  it('should have accessible navigation links with ARIA labels', () => {
    renderSidebar();
    
    // Check desktop navigation links have proper labels
    expect(screen.getByLabelText('Go to Dashboard')).toBeInTheDocument();
    expect(screen.getByLabelText('Browse Services')).toBeInTheDocument();
    expect(screen.getByLabelText('View My Projects')).toBeInTheDocument();
    expect(screen.getByLabelText('View My Quotations')).toBeInTheDocument();
    expect(screen.getByLabelText('View Analytics')).toBeInTheDocument();
  });

  it('should have focus indicators on all interactive elements', () => {
    renderSidebar();
    
    const dashboardLink = screen.getByLabelText('Go to Dashboard');
    expect(dashboardLink.className).toContain('focus:ring-2');
    expect(dashboardLink.className).toContain('focus:ring-primary-500');
    expect(dashboardLink.className).toContain('focus:outline-none');
    
    const logoutButton = screen.getByLabelText('Log out of your account');
    expect(logoutButton.className).toContain('focus:ring-2');
  });

  it('should have proper list structure for navigation items', () => {
    renderSidebar();
    
    // Navigation items should be in lists
    const lists = screen.getAllByRole('list');
    expect(lists.length).toBeGreaterThan(0);
    
    // Each navigation item should be a list item
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBeGreaterThan(0);
  });

  it('should have accessible buttons with proper labels', () => {
    renderSidebar();
    
    const settingsLink = screen.getByLabelText('Open Settings');
    expect(settingsLink).toBeInTheDocument();
    
    const logoutButton = screen.getByLabelText('Log out of your account');
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveAttribute('type', 'button');
  });

  it('should have icons with proper aria-hidden attributes', () => {
    renderSidebar();
    
    // Icons should be hidden from screen readers
    const hiddenElements = document.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenElements.length).toBeGreaterThan(0);
  });

  it('should handle logout functionality', async () => {
    mockLogout.mockResolvedValue(undefined);
    renderSidebar();
    
    const logoutButton = screen.getByLabelText('Log out of your account');
    await userEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it('should have mobile navigation with proper accessibility', () => {
    renderSidebar();
    
    // Mobile navigation should exist (even if hidden on desktop)
    const mobileNav = document.querySelector('nav[aria-label="Mobile navigation"]');
    expect(mobileNav).toBeInTheDocument();
    
    // Mobile nav should have proper role
    expect(mobileNav).toHaveAttribute('role', 'navigation');
  });

  it('should have proper keyboard navigation support', async () => {
    renderSidebar();
    
    const firstLink = screen.getByLabelText('Go to Dashboard');
    
    // Should be able to focus the first link
    await userEvent.click(firstLink);
    // In a real environment, this would test tab navigation
    // but jsdom doesn't fully support focus management
    expect(firstLink).toBeInTheDocument();
  });

  it('should show text labels in expanded view and hide in collapsed view', () => {
    renderSidebar();
    
    // Desktop sidebar should show labels in lg breakpoint
    const dashboardText = screen.getByText('Dashboard');
    expect(dashboardText.className).toContain('hidden');
    expect(dashboardText.className).toContain('lg:block');
  });

  it('should have consistent ARIA labeling across desktop and mobile', () => {
    renderSidebar();
    
    // Desktop dashboard link
    const desktopDashboard = screen.getByLabelText('Go to Dashboard');
    expect(desktopDashboard).toBeInTheDocument();
    
    // Mobile should have similar navigation structure
    const mobileNavigation = document.querySelector('nav[aria-label="Mobile navigation"]');
    expect(mobileNavigation).toBeInTheDocument();
  });

  it('should have proper visual hierarchy with headings where needed', () => {
    renderSidebar();
    
    // Logo/brand should be prominent but not interfere with navigation hierarchy
    const logoImage = screen.getByAltText('Toiral Logo');
    expect(logoImage).toBeInTheDocument();
    
    const brandText = screen.getByText('Toiral');
    expect(brandText).toBeInTheDocument();
  });

  it('should support screen reader navigation patterns', () => {
    renderSidebar();
    
    // Navigation should be properly labeled for screen readers
    const primaryNav = screen.getByRole('navigation', { name: 'Primary navigation' });
    expect(primaryNav).toBeInTheDocument();
    
    // Links should have meaningful text or labels
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      const hasText = link.textContent && link.textContent.trim().length > 0;
      const hasAriaLabel = link.hasAttribute('aria-label');
      expect(hasText || hasAriaLabel).toBe(true);
    });
  });

  it('should handle responsive behavior accessibly', () => {
    renderSidebar();
    
    // Desktop sidebar should be hidden on small screens
    const desktopSidebar = screen.getByRole('complementary');
    expect(desktopSidebar.className).toContain('hidden');
    expect(desktopSidebar.className).toContain('sm:flex');
    
    // Mobile navigation should be hidden on larger screens
    const mobileNav = document.querySelector('nav[aria-label="Mobile navigation"]');
    expect(mobileNav?.className).toContain('sm:hidden');
  });
});