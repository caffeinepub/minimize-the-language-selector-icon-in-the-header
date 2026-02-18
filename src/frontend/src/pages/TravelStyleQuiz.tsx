import React, { useState } from 'react';
import { Compass, RotateCcw, Home, Share2, Instagram, Package, MapPin, User, Luggage } from 'lucide-react';
import { useFileUrl } from '../blob-storage/FileStorage';
import { generateTravelStyleQuizStory, downloadInstagramStory } from '../utils/instagramStoryGenerator';
import { showToast } from '../utils/toast';
import { QuizPage } from '../components/quiz/QuizPage';
import { QuizCard } from '../components/quiz/QuizCard';
import { QuizProgress } from '../components/quiz/QuizProgress';
import { QuizOptionButton } from '../components/quiz/QuizOptionButton';
import { QuizActionButton } from '../components/quiz/QuizActionButton';
import { QuizResultSection } from '../components/quiz/QuizResultSection';
import { getPersonalityProfile } from '../features/travelStyleQuiz/personalityProfile';
import { getPackingListTeaser } from '../features/travelStyleQuiz/packingListTeaser';
import { useIdealDestinations } from '../features/travelStyleQuiz/useIdealDestinations';

interface TravelArchetype {
  name: string;
  description: string;
  emoji: string;
  traits: string[];
}

interface Question {
  id: number;
  question: string;
  options: {
    text: string;
    archetype: string;
  }[];
}

// Travel archetypes
const archetypes: Record<string, TravelArchetype> = {
  'Thrill Seeker': {
    name: 'Thrill Seeker',
    description: 'You live for adrenaline and adventure! From bungee jumping to extreme sports, you seek experiences that get your heart racing.',
    emoji: '🏔️',
    traits: ['Adventure sports', 'Extreme activities', 'High-energy experiences', 'Risk-taking', 'Physical challenges']
  },
  'Culture Connoisseur': {
    name: 'Culture Connoisseur',
    description: 'You\'re passionate about immersing yourself in local cultures, history, and traditions. Museums, art galleries, and cultural sites are your happy places.',
    emoji: '🏛️',
    traits: ['Museums & galleries', 'Historical sites', 'Local traditions', 'Art appreciation', 'Cultural immersion']
  },
  'Chill Escapist': {
    name: 'Chill Escapist',
    description: 'You travel to unwind and recharge. Beach resorts, spa retreats, and peaceful destinations help you find your zen.',
    emoji: '🏖️',
    traits: ['Relaxation', 'Beach destinations', 'Spa treatments', 'Peaceful environments', 'Stress relief']
  },
  'Luxe Nomad': {
    name: 'Luxe Nomad',
    description: 'You believe in traveling in style! Five-star hotels, fine dining, and premium experiences are essential to your perfect trip.',
    emoji: '✨',
    traits: ['Luxury accommodations', 'Fine dining', 'Premium services', 'Exclusive experiences', 'High-end comfort']
  },
  'Social Butterfly': {
    name: 'Social Butterfly',
    description: 'You love meeting new people and experiencing destinations through social connections. Group tours, local meetups, and vibrant nightlife energize you.',
    emoji: '🦋',
    traits: ['Meeting locals', 'Group activities', 'Nightlife', 'Social events', 'Making connections']
  },
  'Master Planner': {
    name: 'Master Planner',
    description: 'You thrive on detailed itineraries and well-organized trips. Every moment is planned to maximize your travel experience.',
    emoji: '📋',
    traits: ['Detailed planning', 'Organized itineraries', 'Research-driven', 'Efficient travel', 'Goal-oriented']
  },
  'Wanderlust Free Spirit': {
    name: 'Wanderlust Free Spirit',
    description: 'You prefer spontaneous adventures and going with the flow. Last-minute bookings and unexpected discoveries make your travels magical.',
    emoji: '🌟',
    traits: ['Spontaneous travel', 'Flexible plans', 'Unexpected discoveries', 'Go with the flow', 'Adventure seeking']
  }
};

// Quiz questions
const questions: Question[] = [
  {
    id: 1,
    question: "What's your ideal vacation accommodation?",
    options: [
      { text: "A luxury resort with all amenities", archetype: "Luxe Nomad" },
      { text: "A cozy local guesthouse with character", archetype: "Culture Connoisseur" },
      { text: "A beachfront bungalow for ultimate relaxation", archetype: "Chill Escapist" },
      { text: "A hostel where I can meet fellow travelers", archetype: "Social Butterfly" },
      { text: "An adventure lodge near outdoor activities", archetype: "Thrill Seeker" },
      { text: "Whatever I find last minute - I'm flexible!", archetype: "Wanderlust Free Spirit" },
      { text: "A well-reviewed hotel I've researched thoroughly", archetype: "Master Planner" }
    ]
  },
  {
    id: 2,
    question: "How do you prefer to plan your trips?",
    options: [
      { text: "Detailed itinerary planned months in advance", archetype: "Master Planner" },
      { text: "Book the flight and figure out the rest later", archetype: "Wanderlust Free Spirit" },
      { text: "Research cultural sites and historical attractions", archetype: "Culture Connoisseur" },
      { text: "Find the best spas and relaxation spots", archetype: "Chill Escapist" },
      { text: "Look for extreme sports and adventure activities", archetype: "Thrill Seeker" },
      { text: "Book premium experiences and fine dining", archetype: "Luxe Nomad" },
      { text: "Find group tours and social activities", archetype: "Social Butterfly" }
    ]
  },
  {
    id: 3,
    question: "What's your ideal travel day?",
    options: [
      { text: "Bungee jumping followed by white-water rafting", archetype: "Thrill Seeker" },
      { text: "Visiting three museums and a historical site", archetype: "Culture Connoisseur" },
      { text: "Beach lounging with a good book and massage", archetype: "Chill Escapist" },
      { text: "Michelin-starred lunch and luxury shopping", archetype: "Luxe Nomad" },
      { text: "Meeting locals at a street festival", archetype: "Social Butterfly" },
      { text: "Following my perfectly timed schedule", archetype: "Master Planner" },
      { text: "Wandering and seeing where the day takes me", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 4,
    question: "What type of destination excites you most?",
    options: [
      { text: "Ancient ruins and historical cities", archetype: "Culture Connoisseur" },
      { text: "Tropical islands with pristine beaches", archetype: "Chill Escapist" },
      { text: "Mountain ranges perfect for extreme sports", archetype: "Thrill Seeker" },
      { text: "Cosmopolitan cities with luxury amenities", archetype: "Luxe Nomad" },
      { text: "Vibrant cities with amazing nightlife", archetype: "Social Butterfly" },
      { text: "Well-connected destinations with good infrastructure", archetype: "Master Planner" },
      { text: "Off-the-beaten-path hidden gems", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 5,
    question: "How do you handle unexpected changes during travel?",
    options: [
      { text: "I get stressed - I prefer things to go as planned", archetype: "Master Planner" },
      { text: "I love it! The best adventures are unplanned", archetype: "Wanderlust Free Spirit" },
      { text: "I adapt and find cultural opportunities in the change", archetype: "Culture Connoisseur" },
      { text: "I find a spa or beach to relax until it's sorted", archetype: "Chill Escapist" },
      { text: "I turn it into an extreme adventure", archetype: "Thrill Seeker" },
      { text: "I upgrade to first-class to make it more comfortable", archetype: "Luxe Nomad" },
      { text: "I meet other travelers and make new friends", archetype: "Social Butterfly" }
    ]
  },
  {
    id: 6,
    question: "What's your preferred travel pace?",
    options: [
      { text: "Fast-paced with adrenaline-pumping activities", archetype: "Thrill Seeker" },
      { text: "Moderate pace with deep cultural exploration", archetype: "Culture Connoisseur" },
      { text: "Slow and relaxed - no rushing allowed", archetype: "Chill Escapist" },
      { text: "Luxurious pace with plenty of comfort breaks", archetype: "Luxe Nomad" },
      { text: "Social pace - time for meeting people", archetype: "Social Butterfly" },
      { text: "Efficient pace - maximizing every moment", archetype: "Master Planner" },
      { text: "Whatever feels right in the moment", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 7,
    question: "What's your ideal travel companion?",
    options: [
      { text: "Adventure buddy who shares my thrill-seeking spirit", archetype: "Thrill Seeker" },
      { text: "Fellow culture enthusiast who loves museums", archetype: "Culture Connoisseur" },
      { text: "Someone who enjoys peaceful, relaxing activities", archetype: "Chill Escapist" },
      { text: "Travel partner who appreciates the finer things", archetype: "Luxe Nomad" },
      { text: "Outgoing friend who loves meeting new people", archetype: "Social Butterfly" },
      { text: "Organized traveler who helps with planning", archetype: "Master Planner" },
      { text: "Free spirit who's up for anything", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 8,
    question: "How do you choose restaurants while traveling?",
    options: [
      { text: "Michelin-starred establishments only", archetype: "Luxe Nomad" },
      { text: "Local favorites recommended by residents", archetype: "Culture Connoisseur" },
      { text: "Beachside cafes with a relaxed atmosphere", archetype: "Chill Escapist" },
      { text: "Places where I can fuel up for adventures", archetype: "Thrill Seeker" },
      { text: "Lively restaurants with great social scenes", archetype: "Social Butterfly" },
      { text: "Pre-researched spots with confirmed reservations", archetype: "Master Planner" },
      { text: "Whatever looks interesting as I walk by", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 9,
    question: "What's your approach to travel photography?",
    options: [
      { text: "Action shots of extreme activities", archetype: "Thrill Seeker" },
      { text: "Artistic photos of architecture and culture", archetype: "Culture Connoisseur" },
      { text: "Peaceful sunset and nature shots", archetype: "Chill Escapist" },
      { text: "Glamorous shots at luxury locations", archetype: "Luxe Nomad" },
      { text: "Group photos with all the people I meet", archetype: "Social Butterfly" },
      { text: "Organized albums documenting every planned stop", archetype: "Master Planner" },
      { text: "Candid moments that capture the unexpected", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 10,
    question: "What's your ideal souvenir?",
    options: [
      { text: "Equipment or gear from adventure activities", archetype: "Thrill Seeker" },
      { text: "Handcrafted items from local artisans", archetype: "Culture Connoisseur" },
      { text: "Something that reminds me of peaceful moments", archetype: "Chill Escapist" },
      { text: "High-end luxury items from exclusive shops", archetype: "Luxe Nomad" },
      { text: "Group photos and contact info from new friends", archetype: "Social Butterfly" },
      { text: "Items from my planned must-visit shops", archetype: "Master Planner" },
      { text: "Unexpected finds from random discoveries", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 11,
    question: "How do you handle language barriers?",
    options: [
      { text: "Use gestures and adrenaline - adventure transcends language!", archetype: "Thrill Seeker" },
      { text: "Learn key phrases and use cultural context", archetype: "Culture Connoisseur" },
      { text: "Smile and point - keep it simple and stress-free", archetype: "Chill Escapist" },
      { text: "Hire a translator or use premium services", archetype: "Luxe Nomad" },
      { text: "Find other travelers or locals who speak English", archetype: "Social Butterfly" },
      { text: "Download translation apps and prepare phrases in advance", archetype: "Master Planner" },
      { text: "Wing it and see what happens - it's part of the adventure!", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 12,
    question: "What's your preferred transportation method?",
    options: [
      { text: "Whatever gets me to the adventure fastest", archetype: "Thrill Seeker" },
      { text: "Local transport to experience authentic culture", archetype: "Culture Connoisseur" },
      { text: "Comfortable options that don't stress me out", archetype: "Chill Escapist" },
      { text: "First-class flights and luxury transfers", archetype: "Luxe Nomad" },
      { text: "Group tours or shared transportation", archetype: "Social Butterfly" },
      { text: "Pre-booked, reliable options with confirmed schedules", archetype: "Master Planner" },
      { text: "Whatever's available - I'm flexible!", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 13,
    question: "What motivates you to travel?",
    options: [
      { text: "Pushing my limits and conquering fears", archetype: "Thrill Seeker" },
      { text: "Learning about different cultures and histories", archetype: "Culture Connoisseur" },
      { text: "Escaping stress and finding inner peace", archetype: "Chill Escapist" },
      { text: "Experiencing the finest things life has to offer", archetype: "Luxe Nomad" },
      { text: "Meeting new people and making connections", archetype: "Social Butterfly" },
      { text: "Efficiently exploring and checking off bucket list items", archetype: "Master Planner" },
      { text: "Following my wanderlust wherever it leads", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 14,
    question: "How do you spend your last day in a destination?",
    options: [
      { text: "One final extreme activity or adventure", archetype: "Thrill Seeker" },
      { text: "Visiting that one museum I haven't seen yet", archetype: "Culture Connoisseur" },
      { text: "Relaxing and reflecting on the peaceful moments", archetype: "Chill Escapist" },
      { text: "Luxury shopping and a farewell fine dining experience", archetype: "Luxe Nomad" },
      { text: "Saying goodbye to all the friends I've made", archetype: "Social Butterfly" },
      { text: "Completing my planned itinerary checklist", archetype: "Master Planner" },
      { text: "Wandering and letting the day unfold naturally", archetype: "Wanderlust Free Spirit" }
    ]
  },
  {
    id: 15,
    question: "What's your travel philosophy?",
    options: [
      { text: "Life is short - seek thrills and push boundaries!", archetype: "Thrill Seeker" },
      { text: "Travel is the best education - immerse and learn", archetype: "Culture Connoisseur" },
      { text: "Travel should restore your soul and bring peace", archetype: "Chill Escapist" },
      { text: "You deserve the best - travel in style and comfort", archetype: "Luxe Nomad" },
      { text: "The best journeys are shared with others", archetype: "Social Butterfly" },
      { text: "Proper planning prevents poor performance", archetype: "Master Planner" },
      { text: "The magic happens when you least expect it", archetype: "Wanderlust Free Spirit" }
    ]
  }
];

export default function TravelStyleQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    'Thrill Seeker': 0,
    'Culture Connoisseur': 0,
    'Chill Escapist': 0,
    'Luxe Nomad': 0,
    'Social Butterfly': 0,
    'Master Planner': 0,
    'Wanderlust Free Spirit': 0
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<{
    primary: TravelArchetype;
    secondary?: TravelArchetype;
    isBlended: boolean;
  } | null>(null);
  const [questionKey, setQuestionKey] = useState(0);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const { data: logoUrl } = useFileUrl('assets/travel-butts-logo.png');

  // Call hooks unconditionally at the top level
  const { destinations } = useIdealDestinations(
    results?.primary || archetypes['Thrill Seeker'],
    results?.secondary
  );

  const handleAnswerSelect = (archetype: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(archetype);
    setShowResult(true);
    
    const newScores = { ...scores };
    newScores[archetype] += 1;
    setScores(newScores);
    
    setTimeout(() => {
      if (currentQuestion >= questions.length - 1) {
        calculateResults(newScores);
        setQuizCompleted(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuestionKey(prev => prev + 1);
      }
    }, 1500);
  };

  const calculateResults = (finalScores: Record<string, number>) => {
    const sortedArchetypes = Object.entries(finalScores)
      .sort(([,a], [,b]) => b - a)
      .map(([name, score]) => ({ name, score }));

    const topScore = sortedArchetypes[0].score;
    const secondScore = sortedArchetypes[1].score;
    
    const primary = archetypes[sortedArchetypes[0].name];
    
    const isBlended = topScore === secondScore || (topScore - secondScore <= 1 && secondScore >= 3);
    const secondary = isBlended ? archetypes[sortedArchetypes[1].name] : undefined;
    
    setResults({
      primary,
      secondary,
      isBlended
    });
  };

  const shareResult = () => {
    if (!results) return;

    const shareText = results.isBlended && results.secondary
      ? `I just discovered my travel style! I'm a ${results.primary.name} ${results.primary.emoji} with ${results.secondary.name} ${results.secondary.emoji} tendencies!\n\nDiscover your travel style at ${window.location.origin}#travel-style-quiz`
      : `I just discovered my travel style! I'm a ${results.primary.name} ${results.primary.emoji}\n\n${results.primary.description}\n\nDiscover your travel style at ${window.location.origin}#travel-style-quiz`;

    if (navigator.share) {
      navigator.share({
        title: 'My Travel Style',
        text: shareText,
      }).catch(() => {
        navigator.clipboard.writeText(shareText);
        showToast('Result copied to clipboard!', 'success');
      });
    } else {
      navigator.clipboard.writeText(shareText);
      showToast('Result copied to clipboard!', 'success');
    }
  };

  const generateStory = async () => {
    if (!results) return;
    
    setIsGeneratingStory(true);
    try {
      const storyDataUrl = await generateTravelStyleQuizStory(
        results.primary,
        results.isBlended,
        results.secondary,
        logoUrl || undefined
      );
      await downloadInstagramStory(storyDataUrl, 'travel-style-quiz');
      showToast('Instagram story downloaded!', 'success');
    } catch (error) {
      console.error('Error generating story:', error);
      showToast('Failed to generate story', 'error');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScores({
      'Thrill Seeker': 0,
      'Culture Connoisseur': 0,
      'Chill Escapist': 0,
      'Luxe Nomad': 0,
      'Social Butterfly': 0,
      'Master Planner': 0,
      'Wanderlust Free Spirit': 0
    });
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setResults(null);
    setQuestionKey(0);
  };

  const goHome = () => {
    window.location.hash = '';
  };

  if (quizCompleted && results) {
    const personalityProfile = getPersonalityProfile(results.primary, results.secondary);
    const packingListTeaser = getPackingListTeaser(results.primary, results.secondary);

    return (
      <QuizPage>
        <div className="space-y-0">
          {/* Section 1: Your Travel Style */}
          <QuizResultSection variant="brand">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-4 animate-bounce">
                <span className="text-6xl">{results.primary.emoji}</span>
              </div>
              
              <div>
                <h2 className="text-4xl font-bold text-secondary mb-2">
                  {results.isBlended && results.secondary ? (
                    <>
                      {results.primary.name} <span className="text-accent">×</span> {results.secondary.name}
                    </>
                  ) : (
                    results.primary.name
                  )}
                </h2>
                <p className="text-lg text-secondary-light">
                  {results.primary.description}
                </p>
                {results.isBlended && results.secondary && (
                  <p className="text-md text-secondary-light mt-3 italic">
                    With a touch of {results.secondary.name} {results.secondary.emoji}
                  </p>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <User className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h3 className="font-semibold text-secondary text-lg mb-2">
                      This is you when you travel
                    </h3>
                    <ul className="space-y-2">
                      {personalityProfile.bullets.map((bullet, index) => (
                        <li key={index} className="text-secondary-light flex items-start gap-2">
                          <span className="text-accent mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-neutral-light rounded-lg p-4 mt-4">
                  <p className="text-secondary font-medium italic">
                    "{personalityProfile.callout}"
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-4">
                <QuizActionButton
                  onClick={shareResult}
                  icon={Share2}
                  text="Share Result"
                  variant="secondary"
                />
                <QuizActionButton
                  onClick={generateStory}
                  icon={Instagram}
                  text={isGeneratingStory ? 'Generating...' : 'Instagram Story'}
                  variant="gradient"
                  disabled={isGeneratingStory}
                />
              </div>
            </div>
          </QuizResultSection>

          {/* Section 2: Your Ideal Destinations */}
          <QuizResultSection variant="brand">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                  <MapPin className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-3xl font-bold text-secondary mb-2">
                  Your Ideal Destinations
                </h3>
                <p className="text-secondary-light">
                  Based on your travel style, these destinations are calling your name
                </p>
              </div>

              <div className="grid gap-4">
                {destinations.map((destination, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">🌍</div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-secondary mb-1">
                          {destination.name}
                        </h4>
                        <p className="text-secondary-light mb-3">
                          {destination.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {destination.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-neutral-light text-secondary text-sm rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </QuizResultSection>

          {/* Section 3: Your Personal Packing List */}
          <QuizResultSection variant="brand">
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-4">
                  <Luggage className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-3xl font-bold text-secondary mb-2">
                  Your Personal Packing List
                </h3>
                <p className="text-secondary-light">
                  Essential items tailored to your travel style
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-5 shadow-md">
                  <h4 className="font-semibold text-secondary text-lg mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-accent" />
                    Top Essentials
                  </h4>
                  <ul className="space-y-2">
                    {packingListTeaser.essentials.map((item, index) => (
                      <li key={index} className="text-secondary-light flex items-start gap-2">
                        <span className="text-accent mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-5 shadow-md">
                  <h4 className="font-semibold text-secondary text-lg mb-3">
                    What You Truly Need
                  </h4>
                  <ul className="space-y-2">
                    {packingListTeaser.whatYouNeed.map((item, index) => (
                      <li key={index} className="text-secondary-light flex items-start gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-neutral-light rounded-xl p-5">
                  <h4 className="font-semibold text-secondary text-lg mb-3">
                    Don't Forget!
                  </h4>
                  <ul className="space-y-2">
                    {packingListTeaser.oftenForgotten.map((item, index) => (
                      <li key={index} className="text-secondary-light flex items-start gap-2">
                        <span className="text-accent mt-1">⚠️</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-4">
                <QuizActionButton
                  onClick={restartQuiz}
                  icon={RotateCcw}
                  text="Retake Quiz"
                  variant="secondary"
                />
                <QuizActionButton
                  onClick={goHome}
                  icon={Home}
                  text="Back to Home"
                  variant="primary"
                />
              </div>
            </div>
          </QuizResultSection>
        </div>
      </QuizPage>
    );
  }

  return (
    <QuizPage>
      <QuizCard>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-secondary">Travel Style Quiz</h1>
                <p className="text-secondary-light text-sm">Discover your travel personality</p>
              </div>
            </div>
          </div>
          
          <QuizProgress 
            current={currentQuestion + 1} 
            total={questions.length}
          />
        </div>

        <div key={questionKey} className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-semibold text-secondary mb-6">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => (
              <QuizOptionButton
                key={index}
                text={option.text}
                onClick={() => handleAnswerSelect(option.archetype)}
                isSelected={selectedAnswer === option.archetype}
                isCorrect={showResult && selectedAnswer === option.archetype}
                disabled={!!selectedAnswer}
              />
            ))}
          </div>
        </div>
      </QuizCard>
    </QuizPage>
  );
}
