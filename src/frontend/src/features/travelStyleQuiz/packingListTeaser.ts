interface TravelArchetype {
  name: string;
  description: string;
  emoji: string;
  traits: string[];
}

interface PackingListTeaser {
  essentials: string[];
  whatYouNeed: string[];
  oftenForgotten: string[];
}

export function getPackingListTeaser(
  primary: TravelArchetype,
  secondary?: TravelArchetype
): PackingListTeaser {
  const teasers: Record<string, PackingListTeaser> = {
    'Thrill Seeker': {
      essentials: [
        'Action camera (GoPro or similar)',
        'Quick-dry athletic wear',
        'Sturdy hiking boots',
        'First aid kit (the real one)',
        'Waterproof phone case',
        'Energy bars and hydration pack',
        'Multi-tool or Swiss Army knife'
      ],
      whatYouNeed: [
        'Compression bandages',
        'Blister prevention tape',
        'Portable charger (high capacity)'
      ],
      oftenForgotten: [
        'Extra memory cards for all those action shots',
        'Backup pair of sunglasses',
        'Dry bag for electronics'
      ]
    },
    'Culture Connoisseur': {
      essentials: [
        'Comfortable walking shoes',
        'Lightweight daypack',
        'Travel journal and quality pen',
        'Portable phone charger',
        'Modest clothing for religious sites',
        'Phrasebook or translation app',
        'Reusable water bottle'
      ],
      whatYouNeed: [
        'Museum-friendly crossbody bag',
        'Notebook for sketching/notes',
        'Comfortable scarf (versatile for temples/churches)'
      ],
      oftenForgotten: [
        'Binoculars for architecture details',
        'Small flashlight for dim historical sites',
        'Plastic bags to protect guidebooks from rain'
      ]
    },
    'Chill Escapist': {
      essentials: [
        'Kindle or favorite books',
        'Quality sunscreen (high SPF)',
        'Comfortable loungewear',
        'Sleep mask and earplugs',
        'Favorite skincare products',
        'Flip-flops or comfy sandals',
        'Beach/pool bag'
      ],
      whatYouNeed: [
        'Aloe vera gel',
        'Portable speaker for beach vibes',
        'Hammock (if you\'re feeling ambitious)'
      ],
      oftenForgotten: [
        'After-sun moisturizer',
        'Waterproof phone pouch',
        'Extra sunglasses (you will lose one)'
      ]
    },
    'Luxe Nomad': {
      essentials: [
        'Designer luggage set',
        'Premium skincare travel kit',
        'Elegant evening wear',
        'Quality jewelry and accessories',
        'Silk sleep mask',
        'Luxury fragrance',
        'Leather passport holder'
      ],
      whatYouNeed: [
        'Wrinkle-release spray',
        'Portable steamer',
        'Premium noise-canceling headphones'
      ],
      oftenForgotten: [
        'Shoe bags for designer footwear',
        'Garment bag for formal wear',
        'Travel-size luxury hair products'
      ]
    },
    'Social Butterfly': {
      essentials: [
        'Portable phone charger',
        'Going-out outfits',
        'Business cards or contact info',
        'Comfortable party shoes',
        'Breath mints and gum',
        'Compact mirror',
        'Small gift items from home'
      ],
      whatYouNeed: [
        'Selfie stick or tripod',
        'Portable Bluetooth speaker',
        'Extra phone storage for all those photos'
      ],
      oftenForgotten: [
        'Hangover recovery kit',
        'Backup phone charger (you\'ll be out late)',
        'Stain remover pen'
      ]
    },
    'Master Planner': {
      essentials: [
        'Printed itinerary and confirmations',
        'Travel organizer with compartments',
        'Backup copies of documents',
        'Portable charger',
        'Travel insurance documents',
        'Emergency contact list',
        'Packing cubes (labeled, of course)'
      ],
      whatYouNeed: [
        'Ziplock bags (various sizes)',
        'Pen and small notebook',
        'Luggage scale'
      ],
      oftenForgotten: [
        'Backup credit card',
        'Photocopies of passport',
        'Local emergency numbers written down'
      ]
    },
    'Wanderlust Free Spirit': {
      essentials: [
        'Versatile clothing (mix and match)',
        'Lightweight backpack',
        'Universal adapter',
        'Quick-dry towel',
        'Flip-flops',
        'Reusable shopping bag',
        'Minimal toiletries'
      ],
      whatYouNeed: [
        'Duct tape (fixes everything)',
        'Sarong or large scarf (multi-use)',
        'Carabiner clips'
      ],
      oftenForgotten: [
        'Laundry detergent packets',
        'Clothesline or paracord',
        'Padlock for hostel lockers'
      ]
    }
  };

  const primaryTeaser = teasers[primary.name];

  // If blended, merge lists
  if (secondary) {
    const secondaryTeaser = teasers[secondary.name];
    return {
      essentials: [
        ...primaryTeaser.essentials.slice(0, 4),
        ...secondaryTeaser.essentials.slice(0, 3)
      ],
      whatYouNeed: [
        ...primaryTeaser.whatYouNeed.slice(0, 2),
        secondaryTeaser.whatYouNeed[0]
      ],
      oftenForgotten: [
        primaryTeaser.oftenForgotten[0],
        secondaryTeaser.oftenForgotten[0],
        primaryTeaser.oftenForgotten[1]
      ]
    };
  }

  return primaryTeaser;
}
