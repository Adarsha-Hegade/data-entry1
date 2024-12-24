import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Building2, User } from 'lucide-react';

export default function DashboardHeader() {
  const { profile, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">DataEntry Pro</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5" />
              <span>{profile?.full_name}</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}