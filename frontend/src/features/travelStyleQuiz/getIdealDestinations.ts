import { Destination } from './idealDestinationsModel';

interface TravelArchetype {
  name: string;
  description: string;
  emoji: string;
  traits: string[];
}

const destinationDatabase: Record<string, Destination[]> = {
  'Thrill Seeker': [
    {
      id: 'queenstown',
      name: 'Queenstown, New Zealand',
      description: 'The adventure capital of the world with bungee jumping, skydiving, and extreme sports.',
      tags: ['Adventure', 'Extreme Sports', 'Mountains']
    },
    {
      id: 'interlaken',
      name: 'Interlaken, Switzerland',
      description: 'Paragliding, canyoning, and skiing in the heart of the Swiss Alps.',
      tags: ['Mountains', 'Skiing', 'Paragliding']
    },
    {
      id: 'moab',
      name: 'Moab, Utah',
      description: 'Rock climbing, mountain biking, and off-road adventures in stunning red rock country.',
      tags: ['Desert', 'Climbing', 'Biking']
    }
  ],
  'Culture Connoisseur': [
    {
      id: 'kyoto',
      name: 'Kyoto, Japan',
      description: 'Ancient temples, traditional tea ceremonies, and preserved cultural heritage.',
      tags: ['History', 'Temples', 'Tradition']
    },
    {
      id: 'rome',
      name: 'Rome, Italy',
      description: 'Millennia of history with world-class museums, ancient ruins, and Renaissance art.',
      tags: ['History', 'Art', 'Architecture']
    },
    {
      id: 'marrakech',
      name: 'Marrakech, Morocco',
      description: 'Vibrant souks, stunning palaces, and rich Islamic architecture and culture.',
      tags: ['Culture', 'Markets', 'Architecture']
    }
  ],
  'Chill Escapist': [
    {
      id: 'maldives',
      name: 'Maldives',
      description: 'Overwater bungalows, pristine beaches, and ultimate tropical relaxation.',
      tags: ['Beach', 'Luxury', 'Relaxation']
    },
    {
      id: 'bali',
      name: 'Bali, Indonesia',
      description: 'Peaceful rice terraces, yoga retreats, and serene beach resorts.',
      tags: ['Beach', 'Wellness', 'Nature']
    },
    {
      id: 'santorini',
      name: 'Santorini, Greece',
      description: 'Stunning sunsets, white-washed villages, and peaceful Mediterranean vibes.',
      tags: ['Beach', 'Scenic', 'Romantic']
    }
  ],
  'Luxe Nomad': [
    {
      id: 'dubai',
      name: 'Dubai, UAE',
      description: 'Ultra-luxury hotels, world-class shopping, and exclusive dining experiences.',
      tags: ['Luxury', 'Shopping', 'Modern']
    },
    {
      id: 'paris',
      name: 'Paris, France',
      description: 'Michelin-starred restaurants, haute couture, and five-star elegance.',
      tags: ['Luxury', 'Fashion', 'Dining']
    },
    {
      id: 'monaco',
      name: 'Monaco',
      description: 'Glamorous casinos, yacht-filled harbors, and exclusive luxury lifestyle.',
      tags: ['Luxury', 'Exclusive', 'Coastal']
    }
  ],
  'Social Butterfly': [
    {
      id: 'barcelona',
      name: 'Barcelona, Spain',
      description: 'Vibrant nightlife, beach clubs, and endless opportunities to meet fellow travelers.',
      tags: ['Nightlife', 'Beach', 'Social']
    },
    {
      id: 'bangkok',
      name: 'Bangkok, Thailand',
      description: 'Bustling street markets, rooftop bars, and a thriving backpacker social scene.',
      tags: ['Nightlife', 'Markets', 'Social']
    },
    {
      id: 'berlin',
      name: 'Berlin, Germany',
      description: 'World-famous club scene, diverse neighborhoods, and welcoming social atmosphere.',
      tags: ['Nightlife', 'Culture', 'Social']
    }
  ],
  'Master Planner': [
    {
      id: 'singapore',
      name: 'Singapore',
      description: 'Efficient public transport, well-organized attractions, and excellent infrastructure.',
      tags: ['Modern', 'Efficient', 'Clean']
    },
    {
      id: 'tokyo',
      name: 'Tokyo, Japan',
      description: 'Punctual trains, organized districts, and countless well-reviewed attractions.',
      tags: ['Modern', 'Efficient', 'Urban']
    },
    {
      id: 'zurich',
      name: 'Zurich, Switzerland',
      description: 'Precise timing, excellent planning resources, and reliable infrastructure.',
      tags: ['Efficient', 'Clean', 'Organized']
    }
  ],
  'Wanderlust Free Spirit': [
    {
      id: 'lisbon',
      name: 'Lisbon, Portugal',
      description: 'Winding streets perfect for wandering, hidden viewpoints, and spontaneous discoveries.',
      tags: ['Walkable', 'Charming', 'Affordable']
    },
    {
      id: 'chiang-mai',
      name: 'Chiang Mai, Thailand',
      description: 'Laid-back atmosphere, easy to navigate, and full of unexpected adventures.',
      tags: ['Relaxed', 'Affordable', 'Nature']
    },
    {
      id: 'oaxaca',
      name: 'Oaxaca, Mexico',
      description: 'Colorful streets, spontaneous festivals, and endless opportunities for serendipity.',
      tags: ['Culture', 'Colorful', 'Authentic']
    }
  ]
};

export function getIdealDestinations(
  primary: TravelArchetype,
  secondary?: TravelArchetype
): Destination[] {
  const primaryDestinations = destinationDatabase[primary.name] || [];

  if (secondary) {
    const secondaryDestinations = destinationDatabase[secondary.name] || [];
    // Merge: 2 from primary, 1 from secondary
    return [
      ...primaryDestinations.slice(0, 2),
      secondaryDestinations[0]
    ].filter(Boolean);
  }

  return primaryDestinations;
}
