'use client';

import { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import Link from 'next/link';
import { BookOpen, CalendarCheck, Loader2 } from 'lucide-react';

interface AttendanceSummary {
  subject: string;
  total_classes: number;
  present: number;
  absent: number;
  percentage: number;
}

export default function StudentDashboardPage() {
  const [summary, setSummary] = useState<AttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/student/attendance');
        setSummary(res.data);
      } catch (error: any) {
        if (error.response?.status === 404) {
          // This happens when the user doesn't have a linked student profile yet
          setSummary([]);
        } else {
          console.error('Failed to fetch attendance summary', error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Attendance</h1>
        <p className="mt-2 text-slate-600">Overview of your attendance across all enrolled subjects.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : summary.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
          No attendance records found. Ensure you are enrolled in a class.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {summary.map((item, index) => {
            // Determine color based on percentage
            let colorClass = 'text-green-600 bg-green-50 border-green-200';
            if (item.percentage < 75 && item.percentage >= 60) {
              colorClass = 'text-yellow-600 bg-yellow-50 border-yellow-200';
            } else if (item.percentage < 60) {
              colorClass = 'text-red-600 bg-red-50 border-red-200';
            }

            return (
              <div key={index} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-lg bg-blue-100 p-2.5 text-blue-600">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1 flex-1" title={item.subject}>
                    {item.subject}
                  </h3>
                </div>

                <div className={`mb-4 flex flex-col items-center justify-center rounded-lg border py-6 ${colorClass}`}>
                  <span className="text-3xl font-black">{item.percentage}%</span>
                  <span className="text-xs font-semibold uppercase tracking-wider mt-1 opacity-80">Attendance</span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded bg-slate-50 p-2 text-center border border-slate-100">
                    <span className="block font-bold text-slate-700">{item.present}/{item.total_classes}</span>
                    <span className="text-xs text-slate-500">Classes Attended</span>
                  </div>
                  <div className="rounded bg-slate-50 p-2 text-center border border-slate-100">
                    <span className="block font-bold text-slate-700">{item.absent}</span>
                    <span className="text-xs text-slate-500">Classes Missed</span>
                  </div>
                </div>

                {/* Optional: Add a link to detailed view if you implement [sub_id] routing and have the subject ID.
                    Since summary doesn't return sub_id right now, we can only view summary, or we need to fetch subjects to map the ID. */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
