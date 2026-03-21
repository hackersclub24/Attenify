'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../../lib/axios';
import { CheckCircle, XCircle, ArrowLeft, Loader2, Calendar } from 'lucide-react';

interface StudentData {
  id: number;
  username: string;
}

interface AttendanceRecord {
  id: number;
  date: string;
  records: { stu_id: number; status: string }[];
}

export default function SubjectAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const subId = params.sub_id as string;

  const [students, setStudents] = useState<StudentData[]>([]);
  const [pastRecords, setPastRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!subId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, recordsRes] = await Promise.all([
          api.get(`/api/teacher/subjects/${subId}/students`),
          api.get(`/api/teacher/attendance/${subId}`),
        ]);

        const fetchedStudents = studentsRes.data;
        setStudents(fetchedStudents);
        setPastRecords(recordsRes.data);

        // Initialize all students as 'present' by default for today's form
        const initialAttendance: Record<number, string> = {};
        fetchedStudents.forEach((student: StudentData) => {
          initialAttendance[student.id] = 'present';
        });
        setAttendance(initialAttendance);
      } catch (error) {
        console.error('Failed to fetch subject data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subId]);

  const toggleStatus = (studentId: number) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const recordsPayload = Object.entries(attendance).map(([stu_id, status]) => ({
      stu_id: parseInt(stu_id),
      status,
    }));

    try {
      await api.post('/api/teacher/attendance', {
        sub_id: parseInt(subId),
        date,
        records: recordsPayload,
      });

      setMessage('Attendance marked successfully!');
      
      // Refresh past records
      const recordsRes = await api.get(`/api/teacher/attendance/${subId}`);
      setPastRecords(recordsRes.data);
    } catch (error: any) {
      setMessage(error.response?.data?.detail || 'Failed to submit attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => router.push('/dashboard/teacher')}
          className="mb-4 flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Subjects
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Mark Attendance</h1>
        <p className="mt-2 text-slate-600">Subject ID: {subId}</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Attendance Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Student List</h2>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-slate-500" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white py-1.5 pl-3 pr-10 text-sm text-slate-900 shadow-sm [color-scheme:light] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark]"
                  required
                />
              </div>
            </div>
            
            {message && (
              <div className={`m-6 rounded-lg p-4 text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-slate-500">
                          No students enrolled in this subject.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => {
                        const isPresent = attendance[student.id] === 'present';
                        return (
                          <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                              {student.username}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => toggleStatus(student.id)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                                  isPresent
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                {isPresent ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                {isPresent ? 'Present' : 'Absent'}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">
                <button
                  type="submit"
                  disabled={isSubmitting || students.length === 0}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Submit Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Past Records View */}
        <div className="lg:col-span-1 border-l-0 lg:border-l border-t lg:border-t-0 border-slate-200 pt-8 lg:pt-0 lg:pl-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
            <Calendar size={20} className="text-blue-600" />
            Past Records
          </h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {pastRecords.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No attendance records found.</p>
            ) : (
              // Note: the backend grouping might vary depending on schema.
              // Assuming each record object corresponds to a distinct submission or date.
              pastRecords.map((record, idx) => {
                const total = record.records?.length || 0;
                const presents = record.records?.filter(r => r.status === 'present').length || 0;
                
                return (
                  <div key={record.id || idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{record.date}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                        Total: {total}
                      </span>
                    </div>
                    <div className="flex gap-2 text-sm mt-3">
                      <div className="flex-1 rounded-md bg-green-50 p-2 text-green-700 text-center border border-green-100">
                        <span className="block font-bold text-lg">{presents}</span>
                        <span className="text-xs uppercase tracking-wider">Present</span>
                      </div>
                      <div className="flex-1 rounded-md bg-red-50 p-2 text-red-700 text-center border border-red-100">
                        <span className="block font-bold text-lg">{total - presents}</span>
                        <span className="text-xs uppercase tracking-wider">Absent</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
