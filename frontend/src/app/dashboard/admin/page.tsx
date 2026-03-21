'use client';

import { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { PlusCircle, Loader2, Trash2, Edit, X, Users } from 'lucide-react';

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

    // Trim whitespace from input fields
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">Manage Users</h1>
              <p className="text-sm text-slate-600">Create, edit, and manage admin, teacher, and student accounts.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Card */}
        <div className="card lg:sticky lg:top-24 lg:h-fit">
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-3">
              {editingUserId ? (
                <>
                  <Edit size={20} className="text-amber-600" />
                  <h2 className="text-lg font-bold text-slate-900">Edit User</h2>
                </>
              ) : (
                <>
                  <PlusCircle size={20} className="text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-900">Create User</h2>
                </>
              )}
            </div>
            {editingUserId && (
              <button 
                onClick={resetForm} 
                className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600"
                title="Cancel Edit"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          {message && (
            <div className={`mb-5 flex items-center gap-3 rounded-lg border p-3 text-sm font-medium ${
              message.includes('success') 
                ? 'border-green-200 bg-green-50 text-green-700' 
                : 'border-red-200 bg-red-50 text-red-700'
            }`}>
              <div className={`h-2 w-2 rounded-full ${message.includes('success') ? 'bg-green-600' : 'bg-red-600'}`} />
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input 
                type="text" 
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="input-base"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="input-base"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password 
                {editingUserId && <span className="ml-1 text-xs font-normal text-slate-500">(optional to keep current)</span>}
              </label>
              <input 
                type="password" 
                required={!editingUserId} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="input-base"
                placeholder={editingUserId ? "Leave blank to keep current" : "Enter password"}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  className="input-base"
                >
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)} 
                  className="input-base"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className={`mt-6 w-full flex items-center justify-center gap-2 rounded-lg px-4 py-3 font-semibold text-white shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed ${
                editingUserId 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:ring-amber-300' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-blue-300'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> 
                  {editingUserId ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                editingUserId ? 'Save Changes' : 'Create User'
              )}
            </button>
          </form>
        </div>

        {/* Users Table Card */}
        <div className="card-lg lg:col-span-2 overflow-hidden p-0">
          <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-8 py-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">All Users</h2>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
              {users.length} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="table-header">User</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-3" />
                      <p className="text-slate-600 font-medium">Loading users...</p>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center">
                      <div className="inline-block rounded-lg bg-slate-100 p-4 mb-3">
                        <Users size={32} className="mx-auto text-slate-400" />
                      </div>
                      <p className="text-lg font-semibold text-slate-900 mb-1">No users found</p>
                      <p className="text-sm text-slate-600">Create a user using the form to get started.</p>
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr 
                      key={u.user_id} 
                      className={`table-row-hover transition-colors duration-200 ${
                        editingUserId === u.user_id 
                          ? 'border-l-4 border-l-amber-500 bg-amber-50' 
                          : ''
                      }`}
                    >
                      <td className="table-cell">
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-slate-900">{u.username}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                          <span className="text-xs text-slate-400">ID: #{u.user_id}</span>
                        </div>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize badge
                          ${u.role === 'admin' ? 'badge-danger' : 
                            u.role === 'teacher' ? 'badge-info' : 
                            'badge-success'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize
                          ${u.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="table-cell text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(u)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 transition-all hover:bg-amber-200 hover:text-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-300"
                            title="Edit User"
                          >
                            <Edit size={16} />
                            <span className="hidden sm:inline">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.user_id)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-all hover:bg-red-200 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-300"
                            title="Delete User"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Delete</span>
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
