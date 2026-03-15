'use client';

import { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import Link from 'next/link';
import { BookOpen, Users, Loader2 } from 'lucide-react';

interface SubjectData {
  sub_id: number;
  sub_name: string;
  class_id: number;
  class_name?: string;
}

export default function TeacherSubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/teacher/subjects');
        setSubjects(res.data);
      } catch (error) {
        console.error('Failed to fetch assigned subjects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900">My Subjects</h1>
        <p className="mt-2 text-slate-600">Select a subject to mark attendance or view records.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : subjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
          You have no subjects assigned. Contact the administrator.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((sub) => (
            <Link key={sub.sub_id} href={`/dashboard/teacher/${sub.sub_id}`}>
              <div className="group flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md">
                <div>
                  <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{sub.sub_name}</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Subject ID: #{sub.sub_id}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="mr-2">Manage Attendance</span>
                  &rarr;
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
