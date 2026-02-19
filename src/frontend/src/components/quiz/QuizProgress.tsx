import React from 'react';

interface QuizProgressProps {
  current: number;
  total: number;
  label?: string;
  variant?: 'default' | 'brand';
  animated?: boolean;
}

export function QuizProgress({ 
  current, 
  total, 
  label = 'Question',
  variant = 'default',
  animated = false 
}: QuizProgressProps) {
  const percentage = (current / total) * 100;
  
  const barColor = variant === 'brand' ? 'bg-accent' : 'bg-accent';
  const bgColor = variant === 'brand' ? 'bg-neutral-light' : 'bg-neutral-light';
  const textColor = variant === 'brand' ? 'text-accent' : 'text-accent';
  const labelColor = variant === 'brand' ? 'text-secondary-light' : 'text-secondary-light';
  const animationClass = animated ? 'animate-fade-in-up' : '';
  
  return (
    <div className={`mb-8 ${animationClass}`}>
      <div className="flex justify-between items-center mb-2">
        <span className={`text-sm font-medium ${labelColor}`}>
          {label} {current} of {total}
        </span>
        <span className={`text-sm font-medium ${textColor}`}>
          {Math.round(percentage)}%
        </span>
      </div>
      <div className={`w-full ${bgColor} rounded-full h-2`}>
        <div
          className={`${barColor} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
