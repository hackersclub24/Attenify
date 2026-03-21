'use client';

import { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { PlusCircle, Loader2, Trash2, Edit, X } from 'lucide-react';

interface UserData {
  user_id: number;
  username: string;
  email: string;
  role: string;
}

interface ClassData {
  class_id: number;
  class_name: string;
  section: string;
}

interface StudentData {
  stu_id: number;
  user_id: number;
  roll_no: string;
  class_id: number;
  username?: string;
  class_name?: string;
  section?: string;
}

export default function AdminStudentsPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [editingStuId, setEditingStuId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | ''>('');
  const [rollNo, setRollNo] = useState('');
  const [classId, setClassId] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, classesRes, studentsRes] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/classes'),
        api.get('/api/admin/students')
      ]);
      
      // Filter only users with 'student' role
      const studentUsers = usersRes.data.filter((u: UserData) => u.role === 'student');
      setUsers(studentUsers);
      setClasses(classesRes.data);
      setStudents(studentsRes.data);
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
    setEditingStuId(null);
    setUserId('');
    setRollNo('');
    setClassId('');
    setMessage('');
  };

  const handleEditClick = (student: StudentData) => {
    setEditingStuId(student.stu_id);
    setUserId(student.user_id);
    setRollNo(student.roll_no);
    setClassId(student.class_id);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !classId) {
      setMessage('Please select a user and a class.');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    const payload = {
      user_id: Number(userId),
      roll_no: rollNo,
      class_id: Number(classId)
    };

    try {
      if (editingStuId) {
        // Edit existing student mapping
        await api.put(`/api/admin/students/${editingStuId}`, payload);
        setMessage('Student mapping updated successfully!');
      } else {
        // Create new student mapping
        await api.post('/api/admin/students', payload);
        setMessage('Student assigned to class successfully!');
      }
      
      resetForm();
      fetchData();
    } catch (error: any) {
      let errorMsg = error.response?.data?.detail || `Failed to ${editingStuId ? 'update' : 'create'} student mapping`;
      if (typeof errorMsg === 'object' && errorMsg !== null && !Array.isArray(errorMsg)) {
        // Handle FastAPI validation error format
         errorMsg = JSON.stringify(errorMsg);
      }
      setMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (stuId: number) => {
    if (!confirm('Are you sure you want to remove this student from their class?')) return;
    try {
      await api.delete(`/api/admin/students/${stuId}`);
      if (editingStuId === stuId) resetForm();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to remove student');
    }
  };

  const getClassName = (cId: number) => {
    const cls = classes.find(c => c.class_id === cId);
    return cls ? `${cls.class_name} - ${cls.section}` : `ID: ${cId}`;
  };

  const getUsername = (uId: number) => {
    const user = users.find(u => u.user_id === uId);
    return user ? user.username : `ID: ${uId}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">Assign Students</h1>
        <p className="mt-2 text-slate-600">Map student accounts to their respective classes and assign roll numbers.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
              {editingStuId ? <Edit size={20} className="text-amber-600" /> : <PlusCircle size={20} className="text-blue-600" />}
              {editingStuId ? 'Edit Assignment' : 'Assign Student'}
            </h2>
            {editingStuId && (
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
              <label className="block text-sm font-medium text-slate-700">Student Account</label>
              <select
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 shadow-sm [color-scheme:light] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark]"
              >
                <option value="" disabled className="text-slate-500">-- Select Student User --</option>
                {users.map(u => (
                  <option key={u.user_id} value={u.user_id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">{u.username} ({u.email})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Roll Number</label>
              <input 
                type="text" 
                required 
                value={rollNo} 
                onChange={(e) => setRollNo(e.target.value)} 
                className="mt-1 block w-full rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" 
                placeholder="e.g., 101"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Class & Section</label>
              <select
                required
                value={classId}
                onChange={(e) => setClassId(e.target.value ? Number(e.target.value) : '')}
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 shadow-sm [color-scheme:light] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark]"
              >
                <option value="" disabled className="text-slate-500">-- Select Class --</option>
                {classes.map(c => (
                  <option key={c.class_id} value={c.class_id} className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">{c.class_name} - {c.section}</option>
                ))}
              </select>
            </div>

            <button type="submit" disabled={isSubmitting} className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-white transition-colors focus:ring-4 disabled:bg-slate-300 disabled:cursor-not-allowed ${editingStuId ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-100' : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-100'}`}>
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : editingStuId ? 'Save Changes' : 'Assign Student'}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Assigned Students</h2>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{students.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Details</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-2" />
                      <p>Loading assignments...</p>
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                      <p className="text-lg font-medium text-slate-600 mb-1">No students assigned</p>
                      <p className="text-sm">Use the form to map a student to a class.</p>
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.stu_id} className={`transition-colors ${editingStuId === s.stu_id ? 'bg-amber-50' : 'hover:bg-slate-50'}`}>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{s.username || getUsername(s.user_id)}</span>
                          <span className="text-xs text-slate-500">Roll No: {s.roll_no}</span>
                          <span className="text-xs text-slate-400">User ID: #{s.user_id}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-100">
                          {s.class_name ? `${s.class_name} - ${s.section}` : getClassName(s.class_id)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(s)}
                            className="text-amber-500 hover:text-amber-700 transition-colors p-1.5 rounded hover:bg-amber-100"
                            title="Edit Assignment"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(s.stu_id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1.5 rounded hover:bg-red-100"
                            title="Remove Assignment"
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
