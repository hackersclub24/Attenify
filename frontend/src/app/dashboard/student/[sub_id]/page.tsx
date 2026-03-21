'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../../lib/axios';
import { ArrowLeft, Loader2, Calendar, CheckCircle, XCircle } from 'lucide-react';

interface AttendanceRecord {
  atten_id: number;
  stu_id: number;
  sub_id: number;
  date: string;
  status: string;
}

export default function StudentSubjectAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const subId = params.sub_id as string;

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!subId) return;

    const fetchAttendanceDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/student/attendance/${subId}`);
        // Ensure it's always an array even if response is structured differently
        setRecords(Array.isArray(res.data) ? res.data : []);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('No attendance found for this subject.');
        } else {
          setError('Failed to load attendance details.');
        }
        console.error('Failed to fetch attendance details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceDetails();
  }, [subId]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Calculate stats
  const total = records.length;
  const presentCount = records.filter(r => r.status === 'present').length;
  const percentage = total > 0 ? Math.round((presentCount / total) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => router.push('/dashboard/student')}
          className="mb-4 flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Attendance Details</h1>
        <p className="mt-2 text-slate-600">Subject ID: {subId}</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
          {error}
        </div>
      ) : records.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
          No attendance records recorded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Summary Card */}
          <div className="lg:col-span-1 border border-slate-200 bg-white rounded-xl shadow-sm h-fit">
            <div className="p-6 border-b border-slate-100 bg-slate-50 rounded-t-xl">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Summary Statistics</h2>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className={`relative flex h-32 w-32 items-center justify-center rounded-full border-4 ${
                  percentage >= 75 ? 'border-green-500 text-green-600' :
                  percentage >= 60 ? 'border-yellow-500 text-yellow-600' :
                  'border-red-500 text-red-600'
                }`}>
                  <span className="text-3xl font-black">{percentage}%</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-slate-600 font-medium">Total Classes</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{total}</span>
                </div>
                <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100 text-green-800">
                  <span className="font-medium">Present</span>
                  <span className="font-bold">{presentCount}</span>
                </div>
                <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100 text-red-800">
                  <span className="font-medium">Absent</span>
                  <span className="font-bold">{total - presentCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Records List */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden h-fit">
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Daily Records</h2>
            </div>
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="bg-white px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="bg-white px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {records.map((record) => {
                    const isPresent = record.status === 'present';
                    return (
                      <tr key={record.atten_id} className="hover:bg-slate-50 transition-colors">
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100">
                          {record.date}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                            isPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {isPresent ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {isPresent ? 'Present' : 'Absent'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
