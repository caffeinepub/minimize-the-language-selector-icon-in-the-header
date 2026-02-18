import React from 'react';

interface QuizPageProps {
  children: React.ReactNode;
  className?: string;
}

export function QuizPage({ children, className = '' }: QuizPageProps) {
  return (
    <div className={`min-h-screen bg-white py-8 ${className}`}>
      <div className="max-w-4xl mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
