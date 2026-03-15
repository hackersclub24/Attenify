'use client';

import { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { BookOpen, PlusCircle, Loader2 } from 'lucide-react';

interface SubjectData {
  id: number;
  sub_name: string;
  teacher_id: number;
  class_id: number;
}

interface UserData {
  id: number;
  username: string;
  role: string;
}

interface ClassData {
  id: number;
  class_name: string;
  section: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [teachers, setTeachers] = useState<UserData[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
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

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherId || !classId) {
      setMessage('Please select both a teacher and a class.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      await api.post('/api/admin/subjects', {
        sub_name: subName,
        teacher_id: parseInt(teacherId),
        class_id: parseInt(classId),
      });
      setMessage('Subject created successfully!');
      setSubName('');
      setTeacherId('');
      setClassId('');
      fetchData(); // refresh subjects list
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to create subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTeacherName = (tId: number) => teachers.find(t => t.id === tId)?.username || 'Unknown';
  const getClassName = (cId: number) => {
    const cls = classes.find(c => c.id === cId);
    return cls ? `${cls.class_name} - ${cls.section}` : 'Unknown';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Manage Subjects</h1>
        <p className="mt-2 text-slate-600">Assign subjects to classes and teachers.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Create Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit lg:col-span-1">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
            <PlusCircle size={20} className="text-blue-600" />
            Create Subject
          </h2>
          
          {message && (
            <div className={`mb-4 rounded-lg p-3 text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleCreateSubject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Subject Name</label>
              <input type="text" required value={subName} onChange={(e) => setSubName(e.target.value)} placeholder="e.g. Mathematics" className="mt-1 block w-full rounded-md border-slate-300 p-2 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Assign Teacher</label>
              <select required value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 p-2 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Select Teacher --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.username}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Assign Class</label>
              <select required value={classId} onChange={(e) => setClassId(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 p-2 text-sm shadow-sm ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="">-- Select Class --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.class_name} - {c.section}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={isSubmitting} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400">
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Create Subject'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-800">All Subjects</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Subject Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Teacher</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
                    </td>
                  </tr>
                ) : subjects.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No subjects found.</td>
                  </tr>
                ) : (
                  subjects.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">#{s.id}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 border-l border-blue-100 flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-500" />
                        {s.sub_name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">{getTeacherName(s.teacher_id)}</td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-medium border border-slate-200">
                          {getClassName(s.class_id)}
                        </span>
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
