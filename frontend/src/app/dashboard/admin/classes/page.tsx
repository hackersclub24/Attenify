'use client';

import { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { PlusCircle, Loader2, Edit, Trash2, X } from 'lucide-react';

interface ClassData {
  class_id: number;
  class_name: string;
  section: string;
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [editingClassId, setEditingClassId] = useState<number | null>(null);
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/classes');
      setClasses(res.data);
    } catch (error) {
      console.error('Failed to fetch classes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const resetForm = () => {
    setEditingClassId(null);
    setClassName('');
    setSection('');
    setMessage('');
  };

  const handleEditClick = (cls: ClassData) => {
    setEditingClassId(cls.class_id);
    setClassName(cls.class_name);
    setSection(cls.section);
    setMessage('');
  };

  const handleDeleteClass = async (classId: number) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    try {
      await api.delete(`/api/admin/classes/${classId}`);
      if (editingClassId === classId) {
        resetForm();
      }
      fetchClasses();
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to delete class');
    }
  };

  const handleSubmitClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      if (editingClassId) {
        await api.put(`/api/admin/classes/${editingClassId}`, {
          class_name: className,
          section,
        });
        setMessage('Class updated successfully!');
      } else {
        await api.post('/api/admin/classes', {
          class_name: className,
          section,
        });
        setMessage('Class created successfully!');
      }
      resetForm();
      fetchClasses();
    } catch (error: any) {
      setMessage(error.response?.data?.detail || `Failed to ${editingClassId ? 'update' : 'create'} class`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Manage Classes</h1>
        <p className="mt-2 text-slate-600">Create academic classes and sections.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Create Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              {editingClassId ? <Edit size={20} className="text-amber-600" /> : <PlusCircle size={20} className="text-blue-600" />}
              {editingClassId ? 'Edit Class' : 'Create Class'}
            </h2>
            {editingClassId && (
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600" title="Cancel Edit">
                <X size={20} />
              </button>
            )}
          </div>
          
          {message && (
            <div className={`mb-4 rounded-lg p-3 text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmitClass} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Class Name</label>
              <input type="text" required value={className} onChange={(e) => setClassName(e.target.value)} placeholder="e.g. 10th Grade" className="mt-1 block w-full rounded-md border-slate-300 p-2 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Section</label>
              <input type="text" required value={section} onChange={(e) => setSection(e.target.value)} placeholder="e.g. A" className="mt-1 block w-full rounded-md border-slate-300 p-2 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" disabled={isSubmitting} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : editingClassId ? 'Save Changes' : 'Create Class'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-800">All Classes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Class Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Section</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
                    </td>
                  </tr>
                ) : classes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No classes found.</td>
                  </tr>
                ) : (
                  classes.map((c) => (
                    <tr key={c.class_id} className={`transition-colors ${editingClassId === c.class_id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">#{c.class_id}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">{c.class_name}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">{c.section}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(c)}
                            className="text-amber-500 hover:text-amber-700 transition-colors p-1.5 rounded hover:bg-amber-100"
                            title="Edit Class"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClass(c.class_id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded hover:bg-red-100"
                            title="Delete Class"
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
