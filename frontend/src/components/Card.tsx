import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  size?: 'default' | 'large';
}

export function Card({ 
  children, 
  className = '', 
  title, 
  description, 
  icon, 
  size = 'default' 
}: CardProps) {
  const sizeClass = size === 'large' ? 'p-8' : 'p-6';
  
  return (
    <div className={`rounded-xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200 ${sizeClass} ${className}`}>
      {(title || icon) && (
        <div className="flex items-start gap-3 mb-4">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div>
            {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
            {description && <p className="text-sm text-slate-600 mt-1">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export function CardGrid({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {children}
    </div>
  );
}
