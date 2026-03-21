'use client';

import { LogIn, ClipboardCheck, TrendingUp, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: 1,
    icon: LogIn,
    title: 'Sign In',
    description: 'Create your account or sign in with your school credentials in seconds.',
  },
  {
    number: 2,
    icon: ClipboardCheck,
    title: 'Mark Attendance',
    description: 'Track attendance for classes, subjects, and sessions with a single click.',
  },
  {
    number: 3,
    icon: TrendingUp,
    title: 'View Insights',
    description: 'Access real-time dashboards and comprehensive reports instantly.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative px-6 py-20 sm:py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 opacity-10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            Get started in three simple steps. It's that easy.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative">
                {/* Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center transition-all hover:shadow-lg hover:border-blue-200">
                  {/* Number Badge */}
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-2xl font-bold text-white">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Icon size={24} className="text-blue-600" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>

                {/* Arrow connecting to next step */}
                {idx < steps.length - 1 && (
                  <div className="hidden absolute -right-6 top-1/2 -translate-y-1/2 md:flex">
                    <ArrowRight size={32} className="text-blue-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Arrows */}
        <div className="mt-8 space-y-4 md:hidden">
          <div className="flex justify-center">
            <div className="rotate-90">
              <ArrowRight size={32} className="text-blue-300" />
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rotate-90">
              <ArrowRight size={32} className="text-blue-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
