'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-black">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <GraduationCap size={24} />
            </div>
            <span className="text-slate-900">Attenify</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 transition-all hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-blue-700 hover:to-blue-800"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mt-4 space-y-3 border-t border-slate-200 pt-4 md:hidden dark:border-slate-700">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              <Link
                href="/login"
                className="text-center text-sm font-medium text-slate-600 transition-all hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 text-center text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
