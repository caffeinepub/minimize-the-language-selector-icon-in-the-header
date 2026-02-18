import React from 'react';

interface QuizProgressProps {
  current: number;
  total: number;
  label?: string;
}

export function QuizProgress({ current, total, label = 'Question' }: QuizProgressProps) {
  const percentage = (current / total) * 100;
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-secondary-light">
          {label} {current} of {total}
        </span>
        <span className="text-sm font-medium text-accent">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-neutral-light rounded-full h-2">
        <div
          className="bg-accent h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
