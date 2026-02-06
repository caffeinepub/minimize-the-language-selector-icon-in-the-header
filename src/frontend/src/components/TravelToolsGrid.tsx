import React from 'react';
import { 
  Shuffle, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  MapPin, 
  Users,
  Train
} from 'lucide-react';

const tools = [
  {
    icon: Shuffle,
    title: 'Trip Randomizer',
    description: 'Let us surprise you with your next perfect destination based on your preferences',
    href: '#trip-randomizer'
  },
  {
    icon: ShoppingBag,
    title: 'Print on Demand Travel Products',
    description: 'Custom travel accessories and souvenirs designed just for your journey',
    href: '/coming-soon'
  },
  {
    icon: Train,
    title: 'Train vs Flight Prices',
    description: 'Compare costs and travel times between train and flight options',
    href: '#train-vs-flight-prices'
  },
  {
    icon: Package,
    title: 'Packing List',
    description: 'Smart packing lists tailored to your destination, weather, and activities',
    href: '#packing-list'
  },
  {
    icon: MapPin,
    title: 'Geography Knowledge Quiz',
    description: 'Test your world knowledge and discover new places to explore',
    href: '#geography-quiz'
  },
  {
    icon: Users,
    title: 'Travel Style Quiz',
    description: 'Find your perfect travel style and get personalized recommendations',
    href: '#travel-style-quiz'
  }
];

export default function TravelToolsGrid() {
  const handleToolClick = (href: string) => {
    if (href.startsWith('#')) {
      window.location.hash = href;
      window.location.reload();
    } else {
      window.location.href = href;
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Grid: 3 rows x 2 columns - Optimized for symmetrical balance */}
      <div className="hidden lg:grid grid-cols-2 gap-4 xl:gap-6">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          return (
            <button
              key={index}
              onClick={() => handleToolClick(tool.href)}
              className="group bg-white border border-neutral-light rounded-xl p-4 xl:p-6 hover:shadow-lg hover:border-accent transition-all duration-300 card-hover text-left"
            >
              <div className="w-8 h-8 xl:w-10 xl:h-10 bg-neutral-light rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-white transition-colors">
                <IconComponent className="w-4 h-4 xl:w-5 xl:h-5 text-secondary group-hover:text-white" />
              </div>
              <h3 className="text-sm xl:text-base font-semibold text-secondary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                {tool.title}
              </h3>
              <p className="text-secondary-light text-xs xl:text-sm leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Tablet Grid: 2 rows x 3 columns */}
      <div className="hidden md:grid lg:hidden grid-cols-3 gap-4">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          return (
            <button
              key={index}
              onClick={() => handleToolClick(tool.href)}
              className="group bg-white border border-neutral-light rounded-xl p-4 hover:shadow-lg hover:border-accent transition-all duration-300 card-hover text-left"
            >
              <div className="w-8 h-8 bg-neutral-light rounded-lg flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-white transition-colors">
                <IconComponent className="w-4 h-4 text-secondary group-hover:text-white" />
              </div>
              <h3 className="text-sm font-semibold text-secondary mb-2 group-hover:text-accent transition-colors line-clamp-2">
                {tool.title}
              </h3>
              <p className="text-secondary-light text-xs leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Mobile Grid: 2 columns x 3 rows */}
      <div className="grid md:hidden grid-cols-2 gap-3 sm:gap-4">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          return (
            <button
              key={index}
              onClick={() => handleToolClick(tool.href)}
              className="group bg-white border border-neutral-light rounded-xl p-3 sm:p-4 hover:shadow-lg hover:border-accent transition-all duration-300 card-hover text-left"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-neutral-light rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:bg-accent group-hover:text-white transition-colors">
                <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-secondary group-hover:text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-secondary mb-1 sm:mb-2 group-hover:text-accent transition-colors line-clamp-2">
                {tool.title}
              </h3>
              <p className="text-secondary-light text-xs leading-relaxed line-clamp-2 hidden sm:block">
                {tool.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
