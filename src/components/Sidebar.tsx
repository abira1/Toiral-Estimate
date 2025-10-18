import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HomeIcon, ListIcon, PackageIcon, SettingsIcon, LogOutIcon, LayoutGridIcon, BriefcaseIcon, BarChart3Icon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
export function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return <>
      {/* Desktop Sidebar */}
      <aside className="bg-white border-r border-gray-200 w-20 lg:w-64 flex-col h-screen fixed hidden sm:flex" role="complementary" aria-label="Main navigation">
        <div className="p-4 border-b border-gray-200 flex items-center justify-center lg:justify-start">
          <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1">
            <img src="/toiraal.png" alt="Toiral Logo" className="h-full w-full object-contain" />
          </div>
          <span className="font-bold text-xl text-primary-800 hidden lg:block ml-2">
            Toiral
          </span>
        </div>
        <nav className="flex-1 py-8 px-2 lg:px-4" role="navigation" aria-label="Primary navigation">
          <ul className="space-y-2" role="list">
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-xl transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                aria-label="Go to Dashboard"
              >
                <HomeIcon size={20} className="flex-shrink-0" aria-hidden="true" />
                <span className="ml-3 hidden lg:block">Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/services" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-xl transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                aria-label="Browse Services"
              >
                <LayoutGridIcon size={20} className="flex-shrink-0" aria-hidden="true" />
                <span className="ml-3 hidden lg:block">Services</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/my-projects" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-xl transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                aria-label="View My Projects"
              >
                <BriefcaseIcon size={20} className="flex-shrink-0" aria-hidden="true" />
                <span className="ml-3 hidden lg:block">My Projects</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/my-quotations" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-xl transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                aria-label="View My Quotations"
              >
                <ListIcon size={20} className="flex-shrink-0" aria-hidden="true" />
                <span className="ml-3 hidden lg:block">My Quotations</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => 
                  `flex items-center p-3 rounded-xl transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                  }`
                }
                aria-label="View Analytics"
              >
                <BarChart3Icon size={20} className="flex-shrink-0" aria-hidden="true" />
                <span className="ml-3 hidden lg:block">Analytics</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <ul className="space-y-2" role="list">
            <li>
              <a 
                href="#" 
                className="flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
                aria-label="Open Settings"
              >
                <SettingsIcon size={20} className="flex-shrink-0" aria-hidden="true" />
                <span className="ml-3 hidden lg:block">Settings</span>
              </a>
            </li>
            <li>
              <button 
                onClick={handleLogout} 
                className="w-full flex items-center p-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none"
                aria-label="Log out of your account"
              >
                <LogOutIcon size={20} className="flex-shrink-0" aria-hidden="true" />
                <span className="ml-3 hidden lg:block">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50" role="navigation" aria-label="Mobile navigation">
        <div className="flex justify-around items-center py-2" role="list">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `flex flex-col items-center p-2 rounded-xl transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                isActive ? 'text-primary-700' : 'text-gray-600'
              }`
            }
            aria-label="Go to Dashboard"
          >
            <HomeIcon size={24} aria-hidden="true" />
            <span className="text-xs mt-1">Home</span>
          </NavLink>
          <NavLink 
            to="/services" 
            className={({ isActive }) => 
              `flex flex-col items-center p-2 rounded-xl transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                isActive ? 'text-primary-700' : 'text-gray-600'
              }`
            }
            aria-label="Browse Services"
          >
            <LayoutGridIcon size={24} aria-hidden="true" />
            <span className="text-xs mt-1">Services</span>
          </NavLink>
          <NavLink 
            to="/my-projects" 
            className={({ isActive }) => 
              `flex flex-col items-center p-2 rounded-xl transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                isActive ? 'text-primary-700' : 'text-gray-600'
              }`
            }
            aria-label="View My Projects"
          >
            <BriefcaseIcon size={24} aria-hidden="true" />
            <span className="text-xs mt-1">Projects</span>
          </NavLink>
          <NavLink 
            to="/my-quotations" 
            className={({ isActive }) => 
              `flex flex-col items-center p-2 rounded-xl transition-colors focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                isActive ? 'text-primary-700' : 'text-gray-600'
              }`
            }
            aria-label="View My Quotations"
          >
            <ListIcon size={24} aria-hidden="true" />
            <span className="text-xs mt-1">Quotes</span>
          </NavLink>
          <button 
            onClick={handleLogout} 
            className="flex flex-col items-center p-2 rounded-xl transition-colors text-gray-600 focus:ring-2 focus:ring-primary-500 focus:outline-none"
            aria-label="Log out of your account"
          >
            <LogOutIcon size={24} aria-hidden="true" />
            <span className="text-xs mt-1">Logout</span>
          </button>
        </div>
      </nav>
    </>;
}