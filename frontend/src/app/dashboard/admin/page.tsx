'use client';

import { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { PlusCircle, Loader2, Trash2, Edit, X } from 'lucide-react';

interface UserData {
  user_id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [status, setStatus] = useState('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const resetForm = () => {
    setEditingUserId(null);
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('student');
    setStatus('active');
    setMessage('');
  };

  const handleEditClick = (user: UserData) => {
    setEditingUserId(user.user_id);
    setUsername(user.username);
    setEmail(user.email || '');
    setPassword(''); // Leave blank unless they want to change it
    setRole(user.role);
    setStatus(user.status);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Trim whitespace and convert to lowercase
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const payload: any = { username: trimmedUsername, email: trimmedEmail, role, status };
    if (trimmedPassword) {
      payload.password = trimmedPassword; // Only send password if it was entered
    }

    try {
      if (editingUserId) {
        // Edit existing user
        await api.put(`/api/admin/users/${editingUserId}`, payload);
        setMessage('User updated successfully!');
      } else {
        // Create new user (requires password)
        if (!trimmedPassword) {
          setMessage('Password is required for new users.');
          setIsSubmitting(false);
          return;
        }
        await api.post('/api/admin/users', { ...payload, password: trimmedPassword });
        setMessage('User created successfully!');
      }
      
      resetForm();
      fetchUsers();
    } catch (error: any) {
      let errorMsg = error.response?.data?.detail || `Failed to ${editingUserId ? 'update' : 'create'} user`;
      if (typeof errorMsg === 'object' && errorMsg !== null && !Array.isArray(errorMsg)) {
        // Handle FastAPI validation error format
         errorMsg = JSON.stringify(errorMsg);
      }
      setMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      if (editingUserId === userId) resetForm();
      fetchUsers();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Manage Users</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">Create, edit, and manage admin, teacher, and student accounts.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              {editingUserId ? <Edit size={20} className="text-amber-600" /> : <PlusCircle size={20} className="text-blue-600" />}
              {editingUserId ? 'Edit User' : 'Create User'}
            </h2>
            {editingUserId && (
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600" title="Cancel Edit">
                <X size={20} />
              </button>
            )}
          </div>
          
          {message && (
            <div className={`mb-4 rounded-lg p-3 text-sm flex items-center ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Username</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password {editingUserId && <span className="text-slate-400 font-normal">(leave blank to keep current)</span>}
              </label>
              <input type="password" required={!editingUserId} value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors focus:ring-4 disabled:bg-slate-300 disabled:cursor-not-allowed ${editingUserId ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-100' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-100'}`}>
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : editingUserId ? 'Save Changes' : 'Create User'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">All Users</h2>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{users.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-2" />
                      <p>Loading users...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      <p className="text-lg font-medium text-slate-600 mb-1">No users found</p>
                      <p className="text-sm">Create a user using the form to get started.</p>
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.user_id} className={`transition-colors ${editingUserId === u.user_id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{u.username}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                          <span className="text-xs text-slate-400">ID: #{u.user_id}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                          ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                            u.role === 'teacher' ? 'bg-blue-100 text-blue-800' : 
                            'bg-emerald-100 text-emerald-800'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                          ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(u)}
                            className="text-amber-500 hover:text-amber-700 transition-colors p-1.5 rounded hover:bg-amber-100"
                            title="Edit User"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.user_id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded hover:bg-red-100"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
