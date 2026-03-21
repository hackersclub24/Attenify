'use client';

import { CheckCircle2, Zap, BarChart3 } from 'lucide-react';

const benefits = [
  {
    icon: Zap,
    title: 'Save Hours of Work',
    description: 'Eliminate manual attendance tracking and save up to 10 hours per week on administrative tasks.',
  },
  {
    icon: CheckCircle2,
    title: 'Reduce Errors',
    description: 'Automated tracking ensures 100% accuracy. No more lost records or transcription mistakes.',
  },
  {
    icon: BarChart3,
    title: 'Actionable Insights',
    description: 'Get real-time dashboards and predictive analytics to identify trends and take action early.',
  },
];

const testimonials = [
  {
    name: 'Rajesh Kumar',
    role: 'School Principal',
    content: 'Attenify has transformed how we manage attendance. What used to take hours now takes minutes. Highly recommended!',
    school: 'Delhi Public School',
  },
  {
    name: 'Priya Singh',
    role: 'Teacher',
    content: 'The mobile app is fantastic. I can mark attendance from anywhere, and the reports are incredibly detailed.',
    school: 'St. Joseph\'s Academy',
  },
  {
    name: 'Amit Patel',
    role: 'School Admin',
    content: 'Best investment we made this year. The analytics help us identify at-risk students early.',
    school: 'Greenwood International',
  },
];

export function Benefits() {
  return (
    <section id="benefits" className="relative px-6 py-20 sm:py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-cyan-50" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Benefits Grid */}
        <div className="mb-20 grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div key={idx} className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* Testimonials Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Trusted by Educational Institutions
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            Schools and administrators worldwide are using Attenify to streamline their operations.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-lg transition-all"
            >
              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-lg">⭐</span>
                ))}
              </div>

              {/* Quote */}
              <p className="mb-6 text-slate-700 italic">"{testimonial.content}"</p>

              {/* Author */}
              <div className="border-t border-slate-200 pt-6">
                <p className="font-bold text-slate-900">{testimonial.name}</p>
                <p className="text-sm text-slate-600">{testimonial.role}</p>
                <p className="mt-1 text-xs font-medium text-blue-600">{testimonial.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
