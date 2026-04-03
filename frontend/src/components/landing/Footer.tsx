'use client';

import Link from 'next/link';
import { GraduationCap, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <GraduationCap size={24} />
              </div>
              <span className="text-xl font-black text-slate-900">Attendance management system</span>
            </div>
            <p className="text-sm text-slate-600">
              Smart attendance management for modern educational institutions.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="mb-4 font-bold text-slate-900">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-4 font-bold text-slate-900">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="mb-4 font-bold text-slate-900">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 transition-colors hover:text-slate-900">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="mb-4 font-bold text-slate-900">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600 transition-all hover:bg-blue-600 hover:text-white"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600 transition-all hover:bg-blue-400 hover:text-white"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600 transition-all hover:bg-blue-700 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-slate-600">
            © 2026 Attendance management system. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>Made with ❤️ for educators</span>
            <span>•</span>
            <span>Built on FastAPI & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
