'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useMobileMenu } from '../context/MobileMenuContext';
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
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-slate-200 bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:z-0 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 px-6">
          <span className="text-2xl font-black tracking-tight text-blue-600">Attenify</span>
          <button
            onClick={closeMenu}
            className="rounded-lg p-1 text-slate-600 transition-colors hover:bg-slate-100 md:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
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
                  onClick={closeMenu}
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
    </>
  );
}
