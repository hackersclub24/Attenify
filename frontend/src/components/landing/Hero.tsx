'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/axios';

interface LandingStats {
  classes: number;
  students: number;
  present_rate: number;
  working_days: number;
}

const defaultStats: LandingStats = {
  classes: 0,
  students: 0,
  present_rate: 0,
  working_days: 0,
};

export function Hero() {
  const [stats, setStats] = useState<LandingStats>(defaultStats);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/public/landing-stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch landing stats', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative overflow-hidden px-6 py-20 sm:py-24 lg:py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-gradient-to-br from-blue-200 to-cyan-200 opacity-20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
              <Zap size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">🚀 Fast & Secure</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl font-black leading-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Effortless Attendance Management for
                <span className="ml-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Modern Teams
                </span>
              </h1>
              <p className="text-xl leading-relaxed text-slate-600 max-w-xl">
                Real-time tracking, automated reports, and actionable analytics. 
                Stop wasting time on spreadsheets. Start managing attendance the smart way.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-blue-800"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <button
                onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-300 px-8 py-4 text-lg font-semibold text-slate-900 transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                View Demo
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 border-t border-slate-200 pt-8">
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.classes}+</p>
                <p className="text-sm text-slate-600">Classes Running</p>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.students}+</p>
                <p className="text-sm text-slate-600">Students Tracked</p>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats.present_rate}%</p>
                <p className="text-sm text-slate-600">Attendance Rate</p>
              </div>
            </div>
          </div>

          {/* Right Visual - Dashboard Mockup */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto w-full max-w-md">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 opacity-20 blur-3xl" />

              {/* Dashboard Card */}
              <div className="relative space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Attendance Overview</h3>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <Zap size={20} className="text-blue-600" />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-4 border border-green-200">
                    <p className="text-sm font-medium text-slate-600">Present Today</p>
                    <p className="mt-2 text-2xl font-bold text-emerald-600">92%</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 p-4 border border-blue-200">
                    <p className="text-sm font-medium text-slate-600">Total Students</p>
                    <p className="mt-2 text-2xl font-bold text-blue-600">234</p>
                  </div>
                </div>

                {/* Mini Table */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-700">Recent Activity</p>
                  {['Class 10-A', 'Class 12-B', 'Lab Session'].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                    >
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                        Complete
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Bar */}
                <div className="mt-6 flex gap-2 pt-4 border-t border-slate-200">
                  <div className="h-1 flex-1 rounded-full bg-green-500" />
                  <div className="h-1 flex-1 rounded-full bg-yellow-500" />
                  <div className="h-1 flex-1 rounded-full bg-slate-200" />
                </div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -right-6 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                <p className="text-xs font-medium text-slate-600">Real-time Sync</p>
                <p className="mt-2 text-sm font-bold text-slate-900">✓ All devices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
