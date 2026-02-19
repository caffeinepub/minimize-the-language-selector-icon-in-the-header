import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizOptionButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  isSelected?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  showFeedback?: boolean;
  variant?: 'default' | 'brand';
  animated?: boolean;
}

export function QuizOptionButton({
  text,
  onClick,
  disabled = false,
  isSelected = false,
  isCorrect = false,
  isIncorrect = false,
  showFeedback = false,
  variant = 'default',
  animated = false
}: QuizOptionButtonProps) {
  const getButtonClasses = () => {
    const baseClasses = 'w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between';
    const animationClass = animated ? 'animate-fade-in-up' : '';
    
    if (showFeedback && isCorrect) {
      return `${baseClasses} ${animationClass} bg-green-100 border-2 border-green-500 text-green-900`;
    }
    
    if (showFeedback && isIncorrect) {
      return `${baseClasses} ${animationClass} bg-red-100 border-2 border-red-500 text-red-900`;
    }
    
    if (isSelected) {
      return `${baseClasses} ${animationClass} bg-accent text-white border-2 border-accent`;
    }
    
    if (disabled) {
      return `${baseClasses} ${animationClass} bg-neutral-light border-2 border-neutral text-secondary-light cursor-not-allowed`;
    }
    
    if (variant === 'brand') {
      return `${baseClasses} ${animationClass} bg-white border-2 border-neutral hover:border-accent hover:bg-accent/5 cursor-pointer`;
    }
    
    return `${baseClasses} ${animationClass} bg-white border-2 border-neutral hover:border-accent hover:bg-accent/5 cursor-pointer`;
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      <span className="flex-1">{text}</span>
      {showFeedback && isCorrect && (
        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 ml-2" />
      )}
      {showFeedback && isIncorrect && (
        <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 ml-2" />
      )}
    </button>
  );
}
