'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useMobileMenu } from '../context/MobileMenuContext';
import { ThemeToggle } from './ThemeToggle';
import { Users, BookOpen, Presentation, CalendarCheck, LogOut, GraduationCap, X } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isOpen, closeMenu } = useMobileMenu();
  
  if (!user) return null;

  const links = {
    admin: [
      { name: 'Users', href: '/dashboard/admin', icon: Users },
      { name: 'Students', href: '/dashboard/admin/students', icon: GraduationCap },
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
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={closeMenu}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl transition-transform duration-300 ease-in-out md:relative md:z-0 md:translate-x-0 dark:border-slate-700 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex min-h-20 items-center gap-3 border-b border-slate-700 bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3">
          <span className="min-w-0 flex-1 break-words text-sm font-black leading-tight text-white drop-shadow-md sm:text-base">Attendance management system</span>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle className="h-9 w-9 border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/20" />
            <button
              onClick={closeMenu}
              className="rounded-lg p-1 text-slate-200 transition-colors hover:bg-slate-700 md:hidden"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* User Info Card */}
        <div className="border-b border-slate-700 bg-gradient-to-b from-slate-800 to-slate-900 p-6">
          <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-lg">
            <p className="truncate text-sm font-bold">{user.username}</p>
            <p className="mt-1 inline-block rounded-full border border-white/30 bg-slate-900/30 px-2.5 py-0.5 text-xs font-semibold tracking-wider text-white">
              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
            </p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1 px-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className={`group flex items-center rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-transform ${
                      isActive ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="border-t border-slate-700 bg-slate-900 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-red-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-red-400"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
