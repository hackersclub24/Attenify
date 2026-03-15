'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, Presentation, CalendarCheck, LogOut } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const links = {
    admin: [
      { name: 'Users', href: '/dashboard/admin', icon: Users },
      { name: 'Classes', href: '/dashboard/admin/classes', icon: Presentation },
      { name: 'Subjects', href: '/dashboard/admin/subjects', icon: BookOpen },
    ],
    teacher: [
      { name: 'My Subjects', href: '/dashboard/teacher', icon: BookOpen },
    ],
    student: [
      { name: 'My Attendance', href: '/dashboard/student', icon: CalendarCheck },
    ],
  };

  const navLinks = links[user.role as keyof typeof links] || [];

  return (
    <div className="flex w-64 flex-col border-r border-slate-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-center border-b border-slate-200 px-6 text-2xl font-black tracking-tight text-blue-600">
        Attenify
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-2 px-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'
                  }`}
                />
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <div className="mb-4 rounded-lg bg-white p-3 shadow-sm border border-slate-100">
          <p className="truncate text-sm font-bold text-slate-900">{user.username}</p>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-blue-600">
            {user.role}
          </p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-red-600 border border-slate-200 shadow-sm transition-all hover:bg-red-50 hover:border-red-200"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}
