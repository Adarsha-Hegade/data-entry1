import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Task } from '../../types';
import { getScoreColor } from '../../lib/utils';

export default function UserDashboard() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      if (!profile) return;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', profile.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTasks(data);
      }
      setLoading(false);
    }

    fetchTasks();
  }, [profile]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Tasks</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Link
            key={task.id}
            to={`/tasks/${task.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {task.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {task.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {task.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(task.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}

        {tasks.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No active tasks found.</p>
          </div>
        )}
      </div>
    </div>
  );
}