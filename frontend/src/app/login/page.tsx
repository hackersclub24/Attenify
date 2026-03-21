'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import Link from 'next/link';
import { LogIn, AlertCircle, Loader2, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const trimmedUsername = username.trim();
      const trimmedPassword = password.trim();

      const res = await api.post('/api/auth/login', {
        username: trimmedUsername,
        password: trimmedPassword,
      });

      const { access_token, role } = res.data;
      if (!access_token) {
        throw new Error('No access token received');
      }

      await login(access_token, role);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || 
        err.response?.data?.message || 
        'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm sm:p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
              <GraduationCap size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Attenify
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Academic Attendance Management System
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-red-500" />
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                disabled={isLoading}
                className="input-base border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                disabled={isLoading}
                className="input-base border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
              Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>© 2026 Attenify. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
