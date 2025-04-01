
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 py-3 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-primary font-bold text-xl">DesignSwipe</span>
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.role === 'designer' ? (
                <Link to="/tasks" className="text-gray-600 hover:text-primary">
                  Tasks
                </Link>
              ) : (
                <Link to="/post-task" className="text-gray-600 hover:text-primary">
                  Post Task
                </Link>
              )}
              <Link to="/dashboard" className="text-gray-600 hover:text-primary">
                Dashboard
              </Link>
              <Button onClick={handleLogout} variant="ghost" className="text-gray-600">
                Logout
              </Button>
              <Link to="/profile" className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-4 py-2 text-primary hover:text-primary-dark transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
