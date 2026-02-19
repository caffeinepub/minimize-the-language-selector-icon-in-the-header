// Shared brand styling variants for quiz components
// Used to maintain consistent Travel Style Quiz look across different quiz types

export const quizBrandVariants = {
  // Button variants
  button: {
    primary: 'bg-accent hover:bg-accent-dark text-white',
    secondary: 'bg-neutral-light hover:bg-accent/10 text-secondary border-2 border-neutral',
    gradient: 'bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent text-white',
  },
  
  // Option button states
  option: {
    base: 'bg-white border-2 border-neutral hover:border-accent hover:bg-accent/5',
    selected: 'bg-accent text-white border-2 border-accent',
    correct: 'bg-green-100 border-2 border-green-500 text-green-900',
    incorrect: 'bg-red-100 border-2 border-red-500 text-red-900',
    disabled: 'bg-neutral-light border-2 border-neutral text-secondary-light cursor-not-allowed',
  },
  
  // Card variants
  card: {
    white: 'bg-white rounded-2xl shadow-lg',
    brand: 'bg-neutral-light rounded-xl shadow-lg border border-neutral-light',
  },
  
  // Progress bar
  progress: {
    bar: 'bg-accent',
    background: 'bg-neutral-light',
    text: 'text-accent',
    label: 'text-secondary-light',
  },
  
  // Result section
  result: {
    background: 'bg-neutral-light',
    border: 'border-neutral-light',
  },
  
  // Animation classes
  animations: {
    fadeInUp: 'animate-fade-in-up',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
  },
} as const;
