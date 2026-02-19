import React from 'react';
import { LucideIcon } from 'lucide-react';

interface QuizActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  text: string;
  variant?: 'primary' | 'secondary' | 'gradient' | 'brand-primary' | 'brand-secondary';
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
      case 'brand-primary':
        return `${baseClasses} bg-accent hover:bg-accent-dark text-white`;
      case 'brand-secondary':
        return `${baseClasses} bg-neutral-light hover:bg-accent/10 text-secondary border-2 border-neutral`;
      case 'gradient':
        return `${baseClasses} bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent text-white`;
      case 'secondary':
        return `${baseClasses} bg-neutral-light hover:bg-neutral text-secondary`;
      case 'primary':
      default:
        return `${baseClasses} bg-accent hover:bg-accent-dark text-white`;
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
