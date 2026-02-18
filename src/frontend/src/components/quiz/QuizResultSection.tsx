import React from 'react';

interface QuizResultSectionProps {
  children: React.ReactNode;
  variant?: 'white' | 'brand';
  className?: string;
}

export function QuizResultSection({ 
  children, 
  variant = 'white',
  className = '' 
}: QuizResultSectionProps) {
  const bgClass = variant === 'brand' ? 'bg-neutral-light' : 'bg-white';
  
  return (
    <div className={`py-8 ${className}`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className={`${bgClass} rounded-xl shadow-lg border border-neutral-light p-8`}>
          {children}
        </div>
      </div>
    </div>
  );
}
