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
    e.preventDefault();
    setIsLoading(true);

    try {
      await loginWithAccessCode(accessCode);
      
      // Navigate based on access code
      if (accessCode.toLowerCase() === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
      
      toast.success('Welcome to Toiral!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-lavender to-cream-light flex flex-col">
      {/* Navbar */}
      <nav className="py-4 px-6 md:px-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1">
            <img src="/toiraal.png" alt="Toiral Logo" className="h-full w-full object-contain" />
          </div>
          <span className="font-bold text-xl text-primary-800">Toiral</span>
        </div>
        <button className="px-4 py-2 text-sm border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
          Contact Us
        </button>
      </nav>
      {/* Hero Section */}
      <div className="flex-1 flex flex-col md:flex-row px-6 md:px-10 py-12 md:py-20">
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
            Estimate your website cost with{' '}
            <span className="text-secondary-600">Toiral</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Build custom quotations for your web development needs with our
            intuitive quotation builder.
          </p>
          <form onSubmit={handleLogin} className="max-w-md w-full">
            <div className="border-2 border-gray-300 rounded-xl p-2 flex flex-wrap sm:flex-nowrap overflow-hidden bg-white shadow-retro mb-4">
              <div className="bg-gray-100 p-2 rounded-lg mr-2">
                <LockIcon className="text-gray-500" size={20} />
              </div>
              <input type="text" placeholder="Enter your access code (use 'admin' for admin panel)" className="flex-1 outline-none text-gray-800 min-w-0 w-full" value={accessCode} onChange={e => setAccessCode(e.target.value)} />
              <button type="submit" disabled={isLoading} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700 transition-colors mt-2 sm:mt-0 w-full sm:w-auto">
                {isLoading ? 'Logging in...' : 'Login'}
                {!isLoading && <ArrowRightIcon size={16} />}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              <strong>Test Access Codes:</strong><br />
              • <strong>admin</strong> - Admin panel access<br />
              • <strong>testuser1</strong> - John Smith (active projects)<br />
              • <strong>testuser2</strong> - Sarah Johnson (new user)<br />
              • <strong>testuser3</strong> - Michael Chen (completed projects)
            </p>
          </form>
        </div>
        <div className="md:w-1/2 flex justify-center items-center mt-10 md:mt-0">
          <div className="w-full max-w-md aspect-square bg-white rounded-3xl border-2 border-gray-200 p-6 shadow-retro-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-12 bg-gray-100 flex items-center px-4 border-b border-gray-200">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="mx-auto text-sm font-medium text-gray-500">
                Quotation Builder
              </div>
            </div>
            <div className="mt-12 space-y-4">
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
        </div>
      </div>
      {/* Footer */}
      <footer className="py-4 px-6 md:px-10 text-center text-gray-500 text-sm border-t border-gray-200">
        © 2023 Toiral Web Development. All rights reserved.
      </footer>
    </div>;
}