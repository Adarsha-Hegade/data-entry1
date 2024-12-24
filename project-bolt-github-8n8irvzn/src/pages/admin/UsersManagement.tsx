import { useState } from 'react';
import UsersTable from '../../components/admin/UsersTable';
import UserForm from '../../components/forms/UserForm';
import Modal from '../../components/modals/Modal';
import { useUsers } from '../../hooks/useUsers';
import { Profile } from '../../types';
import { supabase } from '../../lib/supabase';
import { AlertCircle } from 'lucide-react';

export default function UsersManagement() {
  const { users, loading, error, refetch } = useUsers();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleEdit = (user: Profile) => {
    // TODO: Implement edit functionality
    console.log('Edit user:', user);
  };

  const handleAdd = () => {
    setShowUserModal(true);
  };

  const handleDelete = async (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userToDelete);

      if (error) throw error;
      await refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage user accounts and permissions
        </p>
      </div>

      <UsersTable
        users={users}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      {showUserModal && (
        <Modal title="Create New User" onClose={() => setShowUserModal(false)}>
          <UserForm
            onSuccess={() => {
              setShowUserModal(false);
              refetch();
            }}
            onCancel={() => setShowUserModal(false)}
          />
        </Modal>
      )}

      {showDeleteConfirm && (
        <Modal title="Confirm Delete" onClose={() => setShowDeleteConfirm(false)}>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this user? This action cannot be undone.
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