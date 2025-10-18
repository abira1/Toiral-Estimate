import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../LoginPage';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the auth context
const mockLoginWithAccessCode = vi.fn();
const mockNavigate = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({
    loginWithAccessCode: mockLoginWithAccessCode
  })
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

const renderLoginPage = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage Accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have proper semantic HTML structure', () => {
    renderLoginPage();
    
    // Check for semantic elements
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    expect(screen.getByRole('navigation')).toBeInTheDocument(); // nav
  });

  it('should have proper heading structure', () => {
    renderLoginPage();
    
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();
    expect(mainHeading).toHaveTextContent(/Estimate your website cost with/);
    expect(mainHeading).toHaveAttribute('id', 'hero-heading');
  });

  it('should have accessible form elements', () => {
    renderLoginPage();
    
    // Check form accessibility
    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('aria-label', 'Login form');
    
    // Check input accessibility
    const accessCodeInput = screen.getByRole('textbox');
    expect(accessCodeInput).toHaveAttribute('id', 'access-code');
    expect(accessCodeInput).toHaveAttribute('aria-describedby', 'access-code-help');
    expect(accessCodeInput).toHaveAttribute('required');
    
    // Check label association
    const label = screen.getByLabelText('Access Code');
    expect(label).toBeInTheDocument();
  });

  it('should have proper ARIA labels for interactive elements', () => {
    renderLoginPage();
    
    // Contact Us button
    const contactButton = screen.getByRole('button', { name: /Contact us for support or questions/ });
    expect(contactButton).toHaveAttribute('aria-label', 'Contact us for support or questions');
    
    // Login button
    const loginButton = screen.getByRole('button', { name: /Login/ });
    expect(loginButton).toHaveAttribute('aria-describedby', 'login-status');
  });

  it('should have proper navigation landmarks', () => {
    renderLoginPage();
    
    const navigation = screen.getByRole('navigation');
    expect(navigation).toHaveAttribute('aria-label', 'Main navigation');
  });

  it('should have accessible aside section', () => {
    renderLoginPage();
    
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveAttribute('aria-label', 'Application preview');
  });

  it('should have proper image accessibility', () => {
    renderLoginPage();
    
    const logo = screen.getByAltText('Toiral Logo');
    expect(logo).toBeInTheDocument();
    
    // Window controls should have aria-labels
    const windowControls = screen.getAllByLabelText('Window control');
    expect(windowControls).toHaveLength(3);
  });

  it('should have focus indicators on interactive elements', () => {
    renderLoginPage();
    
    const contactButton = screen.getByRole('button', { name: /Contact us/ });
    expect(contactButton.className).toContain('focus:ring-2');
    expect(contactButton.className).toContain('focus:ring-primary-500');
    expect(contactButton.className).toContain('focus:outline-none');
    
    const accessCodeInput = screen.getByRole('textbox');
    expect(accessCodeInput.className).toContain('focus:ring-2');
    
    const loginButton = screen.getByRole('button', { name: /Login/ });
    expect(loginButton.className).toContain('focus:ring-2');
  });

  it('should have proper fieldset and legend for form grouping', () => {
    renderLoginPage();
    
    const fieldset = screen.getByRole('group');
    expect(fieldset).toBeInTheDocument();
    
    // Screen reader only legend
    expect(document.querySelector('legend')).toBeInTheDocument();
  });

  it('should provide help text for access code', () => {
    renderLoginPage();
    
    const helpText = screen.getByText(/Test Access Codes:/);
    expect(helpText).toHaveAttribute('id', 'access-code-help');
    
    // Check all test codes are listed
    expect(screen.getByText(/admin.*Admin panel access/)).toBeInTheDocument();
    expect(screen.getByText(/testuser1.*John Smith/)).toBeInTheDocument();
    expect(screen.getByText(/testuser2.*Sarah Johnson/)).toBeInTheDocument();
    expect(screen.getByText(/testuser3.*Michael Chen/)).toBeInTheDocument();
  });

  it('should handle form submission with proper loading states', async () => {
    mockLoginWithAccessCode.mockResolvedValue(undefined);
    renderLoginPage();
    
    const accessCodeInput = screen.getByRole('textbox');
    const loginButton = screen.getByRole('button', { name: /Login/ });
    
    // Enter access code
    await userEvent.type(accessCodeInput, 'admin');
    expect(accessCodeInput).toHaveValue('admin');
    
    // Submit form
    await userEvent.click(loginButton);
    
    // Check loading state
    await waitFor(() => {
      expect(loginButton).toHaveTextContent('Logging in...');
      expect(loginButton).toBeDisabled();
    });
    
    expect(mockLoginWithAccessCode).toHaveBeenCalledWith('admin');
  });

  it('should handle keyboard navigation properly', async () => {
    renderLoginPage();
    
    // Tab through interactive elements
    await userEvent.tab();
    expect(screen.getByRole('button', { name: /Contact us/ })).toHaveFocus();
    
    await userEvent.tab();
    expect(screen.getByRole('textbox')).toHaveFocus();
    
    await userEvent.tab();
    expect(screen.getByRole('button', { name: /Login/ })).toHaveFocus();
  });

  it('should have proper role and presentation for decorative elements', () => {
    renderLoginPage();
    
    // Animated preview elements should be aria-hidden
    const previewArea = screen.getByRole('img', { name: /Preview of quotation builder interface/ });
    expect(previewArea).toBeInTheDocument();
    
    // Check for aria-hidden on decorative elements
    const decorativeElements = document.querySelectorAll('[aria-hidden="true"]');
    expect(decorativeElements.length).toBeGreaterThan(0);
  });

  it('should maintain proper content hierarchy', () => {
    renderLoginPage();
    
    // Main content should be in main element
    const main = screen.getByRole('main');
    const heading = screen.getByRole('heading', { level: 1 });
    expect(main).toContainElement(heading);
    
    // Form should be in main content
    const form = screen.getByRole('form');
    expect(main).toContainElement(form);
  });
});