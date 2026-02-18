import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuizActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  text: string;
  variant?: 'primary' | 'secondary' | 'gradient';
  disabled?: boolean;
}

export function QuizActionButton({
  onClick,
  icon: Icon,
  text,
  variant = 'primary',
  disabled = false
}: QuizActionButtonProps) {
  const getButtonClasses = () => {
    const baseClasses = 'flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
      case 'gradient':
        return `${baseClasses} bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white`;
      case 'secondary':
        return `${baseClasses} bg-neutral-light hover:bg-neutral text-secondary`;
      case 'primary':
      default:
        return `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white`;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={getButtonClasses()}
    >
      <Icon className="w-5 h-5" />
      <span>{text}</span>
    </button>
  );
}
