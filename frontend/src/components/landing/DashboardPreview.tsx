'use client';

import { useEffect, useState } from 'react';
import { Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import api from '../../lib/axios';

interface PreviewStats {
  total_students: number;
  classes: number;
  present_today: number;
  avg_attendance: number;
}

interface ActivityItem {
  name: string;
  status: 'Complete' | 'In Progress';
}

interface TrendItem {
  day: string;
  percentage: number;
}

interface DashboardPreviewData {
  stats: PreviewStats;
  recent_activity: ActivityItem[];
  weekly_trend: TrendItem[];
}

const defaultPreviewData: DashboardPreviewData = {
  stats: {
    total_students: 234,
    classes: 12,
    present_today: 92,
    avg_attendance: 89,
  },
  recent_activity: [
    { name: 'Class 10-A', status: 'Complete' },
    { name: 'Class 12-B', status: 'In Progress' },
    { name: 'Lab Session', status: 'Complete' },
    { name: 'Tutorial', status: 'In Progress' },
  ],
  weekly_trend: [
    { day: 'Mon', percentage: 92 },
    { day: 'Tue', percentage: 88 },
    { day: 'Wed', percentage: 95 },
    { day: 'Thu', percentage: 85 },
    { day: 'Fri', percentage: 91 },
  ],
};

export function DashboardPreview() {
  const [previewData, setPreviewData] = useState<DashboardPreviewData>(defaultPreviewData);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await api.get('/api/public/landing-preview');
        setPreviewData(res.data);
      } catch (error) {
        console.error('Failed to fetch dashboard preview data', error);
      }
    };

    fetchPreview();
  }, []);

  const statsCards = [
    {
      icon: Users,
      label: 'Total Students',
      value: `${previewData.stats.total_students}`,
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: BookOpen,
      label: 'Classes',
      value: `${previewData.stats.classes}`,
      color: 'from-cyan-600 to-cyan-700',
    },
    {
      icon: Calendar,
      label: 'Present Today',
      value: `${previewData.stats.present_today}%`,
      color: 'from-emerald-600 to-emerald-700',
    },
    {
      icon: TrendingUp,
      label: 'Avg Attendance',
      value: `${previewData.stats.avg_attendance}%`,
      color: 'from-purple-600 to-purple-700',
    },
  ];

  return (
    <section id="demo-video" className="relative px-6 py-20 sm:py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-100 to-cyan-100 opacity-20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Dashboard Preview
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            A clean, intuitive interface designed for productivity.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 opacity-20 blur-3xl" />

          {/* Dashboard */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white shadow-2xl">
            {/* Header Bar */}
            <div className="border-b border-slate-200 bg-white px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Attendance management system Dashboard</p>
                  <p className="text-xs text-slate-500">Logged in as Admin</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-slate-600">Online</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="px-8 py-8">
              {/* Top Stats */}
              <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statsCards.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="rounded-xl bg-white p-6 border border-slate-200 hover:shadow-md transition-all">
                      <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                        <Icon size={20} />
                      </div>
                      <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                  );
                })}
              </div>

              {/* Tables/Content */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Attendance */}
                <div className="rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-6 py-4">
                    <h3 className="font-bold text-slate-900">Recent Attendance</h3>
                  </div>
                  <div className="divide-y divide-slate-200">
                    {previewData.recent_activity.map((item, idx) => (
                      <div key={`${item.name}-${idx}`} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-medium text-slate-700">{item.name}</span>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.status === 'Complete' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attendance Trend */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <h3 className="mb-4 font-bold text-slate-900">Weekly Trend</h3>
                  <div className="space-y-3">
                    {previewData.weekly_trend.map((item, idx) => {
                      const percentage = item.percentage;
                      return (
                        <div key={`${item.day}-${idx}`} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700">{item.day}</span>
                            <span className="text-sm font-bold text-slate-900">{percentage}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
