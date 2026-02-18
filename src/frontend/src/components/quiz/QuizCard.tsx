import React from 'react';

interface QuizCardProps {
  children: React.ReactNode;
  className?: string;
}

export function QuizCard({ children, className = '' }: QuizCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg p-8 ${className}`}>
      {children}
    </div>
  );
}
