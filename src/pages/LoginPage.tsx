import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, LockIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithAccessCode } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    console.log('🚀 handleLogin called with access code:', accessCode);
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('📞 Calling loginWithAccessCode...');
      await loginWithAccessCode(accessCode);
      console.log('✅ loginWithAccessCode completed successfully');
      
      // Navigate based on access code
      if (accessCode.toLowerCase() === 'admin') {
        console.log('🔄 Navigating to /admin');
        navigate('/admin');
      } else {
        // Check if this is a new workflow client (has clientId in localStorage)
        const clientId = localStorage.getItem('clientId');
        if (clientId) {
          console.log('🔄 Navigating to /client-dashboard for workflow client');
          navigate('/client-dashboard');
        } else {
          console.log('🔄 Navigating to /dashboard for test user');
          navigate('/dashboard');
        }
      }
      
      toast.success('Welcome to Toiral!');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error types with user-friendly messages
      if (error.message.includes('ACCESS_CODE_EMPTY')) {
        toast.error('Please enter an access code to continue.');
      } else if (error.message.includes('ACCESS_CODE_TOO_SHORT')) {
        toast.error('Access code must be at least 3 characters long.');
      } else if (error.message.includes('INVALID_ACCESS_CODE')) {
        toast.error('Invalid access code. Please check and try again.\n\nValid codes: admin, testuser1, testuser2, testuser3');
      } else if (error.message.includes('Firebase')) {
        toast.error('Connection error. Please check your internet and try again.');
      } else {
        // Generic fallback for unknown errors
        toast.error('Login failed. Please try again or contact support.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-lavender to-cream-light flex flex-col">
      {/* Navbar */}
      <header>
        <nav className="py-4 px-6 md:px-10 flex justify-between items-center" role="navigation" aria-label="Main navigation">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1">
              <img src="/toiraal.png" alt="Toiral Logo" className="h-full w-full object-contain" />
            </div>
            <span className="font-bold text-xl text-primary-800">Toiral</span>
          </div>
          <button 
            className="px-4 py-2 text-sm border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none" 
            aria-label="Contact us for support or questions"
          >
            Contact Us
          </button>
        </nav>
      </header>
      {/* Hero Section */}
      <main className="flex-1 flex flex-col md:flex-row px-6 md:px-10 py-12 md:py-20">
        <section className="md:w-1/2 flex flex-col justify-center" aria-labelledby="hero-heading">
          <h1 id="hero-heading" className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
            Estimate your website cost with{' '}
            <span className="text-secondary-600">Toiral</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Build custom quotations for your web development needs with our
            intuitive quotation builder.
          </p>
          <form onSubmit={handleLogin} className="max-w-md w-full" aria-label="Login form">
            <fieldset className="border-2 border-gray-300 rounded-xl p-2 flex flex-wrap sm:flex-nowrap overflow-hidden bg-white shadow-retro mb-4">
              <legend className="sr-only">Access Code Login</legend>
              <div className="bg-gray-100 p-2 rounded-lg mr-2" aria-hidden="true">
                <LockIcon className="text-gray-500" size={20} />
              </div>
              <label htmlFor="access-code" className="sr-only">Access Code</label>
              <input 
                id="access-code"
                type="text" 
                placeholder="Enter access code (e.g., 'admin' or 'testuser1')" 
                className="flex-1 outline-none text-gray-800 min-w-0 w-full focus:ring-2 focus:ring-primary-500 focus:outline-none" 
                value={accessCode} 
                onChange={e => setAccessCode(e.target.value)}
                aria-describedby="access-code-help"
                required
              />
              <button 
                type="submit" 
                disabled={isLoading} 
                className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 disabled:opacity-50 transition-colors mt-2 sm:mt-0 w-full sm:w-auto focus:ring-2 focus:ring-primary-500 focus:outline-none"
                aria-describedby="login-status"
              >
                <span>{isLoading ? 'Logging in...' : 'Login'}</span>
                {!isLoading && <ArrowRightIcon size={16} aria-hidden="true" />}
              </button>
            </fieldset>
            <div id="access-code-help" className="text-sm text-gray-500 mt-2">
              <strong>How to Login:</strong><br />
              • Enter your <strong>Access Code</strong> (8-character code like ABC12XYZ)<br />
              • Or enter your <strong>Client Code</strong> (e.g., CLI001AB)<br />
              <br />
              <strong>Test Access Codes:</strong><br />
              • <strong>admin</strong> - Admin panel access<br />
              • <strong>testuser1</strong> - John Smith (active projects)<br />
              • <strong>testuser2</strong> - Sarah Johnson (new user)<br />
              • <strong>testuser3</strong> - Michael Chen (completed projects)
            </div>
          </form>
        </section>
        <aside className="md:w-1/2 flex justify-center items-center mt-10 md:mt-0" aria-label="Application preview">
          <div className="w-full max-w-md aspect-square bg-white rounded-3xl border-2 border-gray-200 p-6 shadow-retro-lg relative overflow-hidden" role="img" aria-label="Preview of quotation builder interface">
            <div className="absolute top-0 left-0 w-full h-12 bg-gray-100 flex items-center px-4 border-b border-gray-200">
              <div className="flex gap-2" role="presentation">
                <div className="w-3 h-3 rounded-full bg-red-400" aria-label="Window control"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400" aria-label="Window control"></div>
                <div className="w-3 h-3 rounded-full bg-green-400" aria-label="Window control"></div>
              </div>
              <div className="mx-auto text-sm font-medium text-gray-500">
                Quotation Builder
              </div>
            </div>
            <div className="mt-12 space-y-4" aria-hidden="true">
              <div className="h-8 bg-lavender-light rounded-lg w-3/4 animate-pulse"></div>
              <div className="h-8 bg-lavender-light rounded-lg w-1/2 animate-pulse"></div>
              <div className="h-20 bg-cream rounded-lg w-full animate-pulse"></div>
              <div className="flex gap-3">
                <div className="h-12 bg-lavender-light rounded-lg w-1/3 animate-pulse"></div>
                <div className="h-12 bg-lavender-light rounded-lg w-1/3 animate-pulse"></div>
                <div className="h-12 bg-lavender-light rounded-lg w-1/3 animate-pulse"></div>
              </div>
              <div className="h-10 bg-secondary-200 rounded-lg w-1/2 mx-auto animate-pulse"></div>
            </div>
          </div>
        </aside>
      </main>
      {/* Footer */}
      <footer className="py-4 px-6 md:px-10 text-center text-gray-500 text-sm border-t border-gray-200" role="contentinfo">
        © 2023 Toiral Web Development. All rights reserved.
      </footer>
    </div>;
}