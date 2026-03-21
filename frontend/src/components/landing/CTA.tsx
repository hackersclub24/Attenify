'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="relative px-6 py-20 sm:py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 opacity-10 blur-3xl" />
        </div>
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-bold text-white sm:text-5xl">
          Start Managing Attendance the Smart Way
        </h2>
        <p className="mt-6 text-xl text-slate-300">
          Join 100+ schools already using Attenify to streamline their operations and save countless hours.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:from-blue-700 hover:to-blue-800"
          >
            Get Started Free
            <ArrowRight size={20} />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-400 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-slate-300 hover:bg-slate-800"
          >
            Learn More
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 flex flex-col items-center gap-4 border-t border-slate-700 pt-12 sm:flex-row sm:justify-center">
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-slate-300">✓ No credit card required</p>
          </div>
          <div className="h-1 w-1 rounded-full bg-slate-600 hidden sm:block" />
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-slate-300">✓ 14-day free trial</p>
          </div>
          <div className="h-1 w-1 rounded-full bg-slate-600 hidden sm:block" />
          <div className="text-center sm:text-left">
            <p className="text-sm font-medium text-slate-300">✓ Dedicated support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
