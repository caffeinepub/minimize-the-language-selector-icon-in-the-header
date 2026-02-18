interface TravelArchetype {
  name: string;
  description: string;
  emoji: string;
  traits: string[];
}

interface PersonalityProfile {
  bullets: string[];
  callout: string;
}

export function getPersonalityProfile(
  primary: TravelArchetype,
  secondary?: TravelArchetype
): PersonalityProfile {
  const profiles: Record<string, PersonalityProfile> = {
    'Thrill Seeker': {
      bullets: [
        'You value adrenaline and pushing your physical limits during travel',
        'You make decisions based on excitement level and adventure potential',
        'You hate slow-paced itineraries and overly cautious travel companions',
        'Safety briefings feel like obstacles between you and the next thrill'
      ],
      callout: 'You\'re the friend who books the bungee jump before the hotel. Your passport is basically an extreme sports scorecard, and "relaxing vacation" sounds like an oxymoron.'
    },
    'Culture Connoisseur': {
      bullets: [
        'You value authentic cultural experiences and deep historical understanding',
        'You make decisions by researching local customs and seeking meaningful connections',
        'You hate tourist traps and superficial "Instagram spot" destinations',
        'Skipping a museum to sleep in feels like a wasted opportunity'
      ],
      callout: 'You\'re the traveler who knows more about local history than the tour guide. Your camera roll is 90% architecture, and you\'ve never met a museum you didn\'t love.'
    },
    'Chill Escapist': {
      bullets: [
        'You value peace, relaxation, and stress-free environments during travel',
        'You make decisions based on comfort level and relaxation potential',
        'You hate rushed schedules and high-stress activities',
        'The idea of a "packed itinerary" makes you need a vacation from your vacation'
      ],
      callout: 'You\'re the master of doing absolutely nothing—and loving every minute. Your ideal day involves a beach, a book, and zero plans. "Adventure" means trying a new cocktail at the resort bar.'
    },
    'Luxe Nomad': {
      bullets: [
        'You value premium experiences and believe travel should be indulgent',
        'You make decisions based on quality, exclusivity, and comfort',
        'You hate budget accommodations and cutting corners on experiences',
        'The phrase "roughing it" is not in your travel vocabulary'
      ],
      callout: 'You don\'t just travel—you arrive in style. Five-star hotels are your baseline, and you\'ve never met a spa treatment you didn\'t book. YOLO is your travel budget philosophy.'
    },
    'Social Butterfly': {
      bullets: [
        'You value human connections and shared experiences during travel',
        'You make decisions based on social opportunities and meeting new people',
        'You hate traveling alone and destinations with limited nightlife',
        'A trip without making at least five new friends feels incomplete'
      ],
      callout: 'You collect people, not postcards. Your travel stories always start with "So I met this person..." and you\'ve never seen a group tour you didn\'t want to join.'
    },
    'Master Planner': {
      bullets: [
        'You value organization, efficiency, and maximizing every travel moment',
        'You make decisions based on research, reviews, and detailed planning',
        'You hate spontaneity and last-minute changes to your itinerary',
        'Winging it sounds less like freedom and more like chaos'
      ],
      callout: 'Your itinerary has an itinerary. You know exactly where you\'ll be at 2:47 PM next Thursday, and you\'ve already made reservations. Spontaneous? Sure—if it\'s scheduled.'
    },
    'Wanderlust Free Spirit': {
      bullets: [
        'You value spontaneity and letting the journey unfold naturally',
        'You make decisions in the moment based on intuition and opportunity',
        'You hate rigid schedules and over-planned itineraries',
        'Booking a return flight feels like limiting your possibilities'
      ],
      callout: 'You don\'t plan trips—you let them happen. Your best travel stories start with "I had no idea where I was going, but..." and you\'ve mastered the art of beautiful chaos.'
    }
  };

  const primaryProfile = profiles[primary.name];

  // If blended, merge complementary bullets
  if (secondary) {
    const secondaryProfile = profiles[secondary.name];
    const blendedBullets = [
      primaryProfile.bullets[0],
      secondaryProfile.bullets[0],
      primaryProfile.bullets[1],
      secondaryProfile.bullets[2]
    ];

    const blendedCallout = `You're a unique blend: ${primaryProfile.callout.split('.')[0]}, but ${secondaryProfile.callout.split('.')[0].toLowerCase()}.`;

    return {
      bullets: blendedBullets,
      callout: blendedCallout
    };
  }

  return primaryProfile;
}
