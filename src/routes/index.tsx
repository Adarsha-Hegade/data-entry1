import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import UserDashboard from '../pages/dashboard/UserDashboard';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import TasksManagement from '../pages/admin/TasksManagement';
import UsersManagement from '../pages/admin/UsersManagement';
import TaskForm from '../pages/admin/TaskForm';
import DataEntryForm from '../components/dataEntry/DataEntryForm';
import Profile from '../pages/dashboard/Profile';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profile || profile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function AppRoutes() {
  const { profile } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Protected routes */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route
          path="/dashboard"
          element={
            profile?.role === 'admin' ? 
              <AdminDashboard /> : 
              <UserDashboard />
          }
        />
        
        {/* Admin routes */}
        <Route element={<AdminRoute><></></AdminRoute>}>
          <Route path="/tasks" element={<TasksManagement />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/:taskId/edit" element={<TaskForm />} />
          <Route path="/users" element={<UsersManagement />} />
        </Route>

        {/* User routes */}
        <Route path="/tasks/:taskId" element={<DataEntryForm />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}