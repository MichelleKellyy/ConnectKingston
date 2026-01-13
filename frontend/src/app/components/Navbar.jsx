import { Link, useLocation } from 'react-router-dom';
import { Users, Briefcase, Target } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                VolunteerMatch Kingston
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/opportunities"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/opportunities')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Opportunities
            </Link>
            
            <Link
              to="/matches"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/matches')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Target className="h-4 w-4 mr-2" />
              My Matches
            </Link>
            
            <Link
              to="/profile"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/profile')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
