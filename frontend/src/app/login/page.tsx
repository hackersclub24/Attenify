'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import { LogIn, AlertCircle } from 'lucide-react';

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
      const trimmedUsername = username.trim().toLowerCase();
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-6 shadow-xl sm:space-y-8 sm:p-10">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 sm:h-16 sm:w-16">
            <LogIn size={24} className="sm:h-8 sm:w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Sign in to Attenify
            </h2>
            <p className="mt-1.5 text-xs text-slate-600 sm:mt-2 sm:text-sm">
              Academic Attendance Management System
            </p>
          </div>
        </div>

        <form className="space-y-5 sm:space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="flex gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-600 sm:p-4 sm:text-sm border border-red-200">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-4 sm:space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="relative block w-full appearance-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full appearance-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 sm:py-3"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
