
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { dataService } from '@/services/dataService';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = dataService.getCurrentUser();

  const handleLogout = () => {
    dataService.logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b-4 border-primary">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">BA</span>
            </div>
            <span className="text-xl font-bold text-gray-800">Bharat Alert</span>
          </Link>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-gray-600">Welcome, {currentUser.name}</span>
                
                {currentUser.role === 'admin' ? (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">
                      Admin Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link to="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                )}
                
                <Button onClick={handleLogout} variant="destructive" size="sm">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
