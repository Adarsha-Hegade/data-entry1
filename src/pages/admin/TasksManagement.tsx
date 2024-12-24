import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TasksTable from '../../components/admin/TasksTable';
import TaskForm from '../../components/forms/TaskForm';
import Modal from '../../components/modals/Modal';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';
import { supabase } from '../../lib/supabase';
import { AlertCircle } from 'lucide-react';

export default function TasksManagement() {
  const navigate = useNavigate();
  const { tasks, loading, error, refetch } = useTasks();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleEdit = (task: Task) => {
    navigate(`/tasks/${task.id}/edit`);
  };

  const handleAdd = () => {
    setShowTaskModal(true);
  };

  const handleDelete = async (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskToDelete);

      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md flex items-center">
        <AlertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage all tasks and assignments in the system
        </p>
      </div>

      <TasksTable
        tasks={tasks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {showTaskModal && (
        <Modal title="Create New Task" onClose={() => setShowTaskModal(false)}>
          <TaskForm
            onSuccess={() => {
              setShowTaskModal(false);
              refetch();
            }}
            onCancel={() => setShowTaskModal(false)}
          />
        </Modal>
      )}

      {showDeleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setShowDeleteConfirm(false)}>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}