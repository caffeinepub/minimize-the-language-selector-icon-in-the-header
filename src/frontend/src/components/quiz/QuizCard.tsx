import React from 'react';

interface QuizCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'white' | 'brand';
  animated?: boolean;
}

export function QuizCard({ 
  children, 
  className = '', 
  variant = 'white',
  animated = false 
}: QuizCardProps) {
  const baseClasses = variant === 'brand' 
    ? 'bg-neutral-light rounded-xl shadow-lg border border-neutral-light' 
    : 'bg-white rounded-2xl shadow-lg';
  
  const animationClass = animated ? 'animate-fade-in-up' : '';
  
  return (
    <div className={`${baseClasses} p-8 ${animationClass} ${className}`}>
      {children}
    </div>
  );
}
