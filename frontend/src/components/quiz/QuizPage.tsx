import React from 'react';

interface QuizPageProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'brand';
}

export function QuizPage({ children, className = '', variant = 'default' }: QuizPageProps) {
  const bgClass = variant === 'brand' ? 'bg-white' : 'bg-white';
  
  return (
    <div className={`min-h-screen ${bgClass} py-8 ${className}`}>
      <div className="max-w-4xl mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
