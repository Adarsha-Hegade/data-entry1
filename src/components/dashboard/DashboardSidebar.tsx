import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Settings 
} from 'lucide-react';

export default function DashboardSidebar() {
  const location = useLocation();
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tasks', href: '/tasks', icon: ClipboardList },
    ...(isAdmin ? [{ name: 'Users', href: '/users', icon: Users }] : []),
    { name: 'Settings', href: '/profile', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gray-800 min-h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <Icon
                  className={`
                    mr-3 h-6 w-6
                    ${isActive
                      ? 'text-white'
                      : 'text-gray-400 group-hover:text-gray-300'
                    }
                  `}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}