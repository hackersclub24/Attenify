'use client';

import { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { BookOpen, PlusCircle, Loader2, Edit, Trash2, X } from 'lucide-react';

interface SubjectData {
  sub_id: number;
  sub_name: string;
  teacher_id: number;
  teacher_user_id?: number;
  class_id: number;
  teacher_name?: string; // Newly added from backend
}

interface UserData {
  user_id: number;
  username: string;
  role: string;
}

interface ClassData {
  class_id: number;
  class_name: string;
  section: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [teachers, setTeachers] = useState<UserData[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [editingSubId, setEditingSubId] = useState<number | null>(null);
  const [subName, setSubName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [classId, setClassId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, usersRes, clsRes] = await Promise.all([
        api.get('/api/admin/subjects'),
        api.get('/api/admin/users'),
        api.get('/api/admin/classes')
      ]);
      setSubjects(subRes.data);
      setTeachers(usersRes.data.filter((u: UserData) => u.role === 'teacher'));
      setClasses(clsRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setEditingSubId(null);
    setSubName('');
    setTeacherId('');
    setClassId('');
    setMessage('');
  };

  const handleEditClick = (subject: SubjectData) => {
    setEditingSubId(subject.sub_id);
    setSubName(subject.sub_name);
    setTeacherId(String(subject.teacher_user_id ?? ''));
    setClassId(String(subject.class_id));
    setMessage('');
  };

  const handleDeleteSubject = async (subId: number) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try {
      await api.delete(`/api/admin/subjects/${subId}`);
      if (editingSubId === subId) resetForm();
      fetchData();
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to delete subject');
    }
  };

  const handleSubmitSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !classId) {
      setMessage('Please select both a teacher and a class.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const payload = {
        sub_name: subName,
        teacher_id: parseInt(teacherId),
        class_id: parseInt(classId),
      };

      if (editingSubId) {
        await api.put(`/api/admin/subjects/${editingSubId}`, payload);
        setMessage('Subject updated successfully!');
      } else {
        await api.post('/api/admin/subjects', payload);
        setMessage('Subject created successfully!');
      }

      resetForm();
      fetchData(); // refresh subjects list
    } catch (error: any) {
      setMessage(error.response?.data?.detail || `Failed to ${editingSubId ? 'update' : 'create'} subject`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getClassName = (cId: number) => {
    const cls = classes.find(c => c.class_id === cId);
    return cls ? `${cls.class_name} - ${cls.section}` : 'Unknown';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Manage Subjects</h1>
        <p className="mt-2 text-slate-600">Assign subjects to classes and teachers.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Create Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
              {editingSubId ? <Edit size={20} className="text-amber-600" /> : <PlusCircle size={20} className="text-blue-600" />}
              {editingSubId ? 'Edit Subject' : 'Create Subject'}
            </h2>
            {editingSubId && (
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

          <form onSubmit={handleSubmitSubject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Subject Name</label>
              <input type="text" required value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="e.g. Mathematics" className="mt-1 block w-full rounded-md border-slate-300 p-2 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Assign Teacher</label>
              <select required value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 shadow-sm [color-scheme:light] ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark]">
                <option value="" disabled className="text-slate-500">-- Select Teacher --</option>
                {teachers.map(t => (
                  <option key={t.user_id} value={t.user_id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">{t.username}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Assign Class</label>
              <select required value={classId} onChange={(e) => setClassId(e.target.value)} className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 shadow-sm [color-scheme:light] ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark]">
                <option value="" disabled className="text-slate-500">-- Select Class --</option>
                {classes.map(c => (
                  <option key={c.class_id} value={c.class_id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">{c.class_name} - {c.section}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={isSubmitting} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : editingSubId ? 'Save Changes' : 'Create Subject'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">All Subjects</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
                    </td>
                  </tr>
                ) : subjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No subjects found.</td>
                  </tr>
                ) : (
                  subjects.map((s) => (
                    <tr key={s.sub_id} className={`transition-colors ${editingSubId === s.sub_id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">#{s.sub_id}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100 border-l border-blue-100 flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-500" />
                        {s.sub_name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        {s.teacher_name || `ID: ${s.teacher_id}`}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-medium border border-slate-200">
                          {getClassName(s.class_id)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(s)}
                            className="text-amber-500 hover:text-amber-700 transition-colors p-1.5 rounded hover:bg-amber-100"
                            title="Edit Subject"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(s.sub_id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded hover:bg-red-100"
                            title="Delete Subject"
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
