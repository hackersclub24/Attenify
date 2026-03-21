'use client';

import {
  BarChart3,
  Users2,
  Lock,
  Smartphone,
  Zap,
  FileText,
  Clock,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Get instant insights into attendance patterns with comprehensive dashboards and detailed reports.',
  },
  {
    icon: Users2,
    title: 'Role-Based Access',
    description: 'Manage admins, teachers, and students with granular permission controls.',
  },
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and secure authentication keep your data protected.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Track attendance on the go with responsive design that works on all devices.',
  },
  {
    icon: Zap,
    title: 'Automated Workflows',
    description: 'Reduce manual work with automated attendance tracking and report generation.',
  },
  {
    icon: FileText,
    title: 'Export & Reports',
    description: 'Generate professional reports in multiple formats for auditing and analysis.',
  },
  {
    icon: Clock,
    title: 'Time Zone Support',
    description: 'Manage students and classes across multiple time zones effortlessly.',
  },
  {
    icon: TrendingUp,
    title: 'Predictive Insights',
    description: 'Identify trends and predict attendance patterns to take proactive action.',
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-6 py-20 sm:py-24 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 opacity-10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-slate-900 sm:text-5xl">
            Powerful Features Built For You
          </h2>
          <p className="mt-4 text-xl text-slate-600">
            Everything you need to manage attendance efficiently and effectively.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-blue-300 hover:shadow-lg hover:shadow-blue-200/50"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 transition-all group-hover:scale-110">
                  <Icon size={24} className="text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
