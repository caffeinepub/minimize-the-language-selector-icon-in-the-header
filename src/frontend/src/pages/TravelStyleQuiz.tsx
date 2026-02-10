import React, { useState, useEffect } from 'react';
import { Compass, RotateCcw, Home, Trophy, Target, CheckCircle, Share2, Instagram, Star, Award, Package } from 'lucide-react';
import { useFileUrl } from '../blob-storage/FileStorage';
import { generateTravelStyleQuizStory, downloadInstagramStory } from '../utils/instagramStoryGenerator';
import { showToast } from '../utils/toast';

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
  const [questionKey, setQuestionKey] = useState(0); // Force re-render of options
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const { data: logoUrl } = useFileUrl('assets/travel-butts-logo.png');

  const handleAnswerSelect = (archetype: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(archetype);
    setShowResult(true);
    
    // Update scores
    const newScores = { ...scores };
    newScores[archetype] += 1;
    setScores(newScores);
    
    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      if (currentQuestion >= questions.length - 1) {
        calculateResults(newScores);
        setQuizCompleted(true);
      } else {
        setCurrentQuestion(currentQuestion + 1);
        // Reset states for next question and force re-render
        setSelectedAnswer(null);
        setShowResult(false);
        setQuestionKey(prev => prev + 1); // Force complete re-render of options
      }
    }, 1500);
  };

  const calculateResults = (finalScores: Record<string, number>) => {
    // Sort archetypes by score
    const sortedArchetypes = Object.entries(finalScores)
      .sort(([,a], [,b]) => b - a)
      .map(([name, score]) => ({ name, score }));

    const topScore = sortedArchetypes[0].score;
    const secondScore = sortedArchetypes[1].score;
    
    const primary = archetypes[sortedArchetypes[0].name];
    
    // Check if there's a tie for the top spot or close second
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
        title: 'My Travel Style Result',
        text: shareText,
        url: `${window.location.origin}#travel-style-quiz`
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('Quiz result copied to clipboard! You can now paste it anywhere to share.', 'success');
      }).catch(() => {
        // Final fallback: show share text in alert
        alert(`Share your result:\n\n${shareText}`);
      });
    }
  };

  const shareToInstagramStory = async () => {
    if (!results || isGeneratingStory) return;
    
    setIsGeneratingStory(true);
    
    try {
      const storyImageUrl = await generateTravelStyleQuizStory(
        results.primary,
        results.isBlended,
        results.secondary,
        logoUrl
      );
      
      const filename = `travel-style-${results.primary.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      
      downloadInstagramStory(storyImageUrl, filename);
      showToast('Instagram Story image downloaded! Upload it to your Instagram Story to share your result.', 'success');
    } catch (error) {
      console.error('Error generating Instagram story:', error);
      showToast('Failed to generate Instagram story. Please try again.', 'error');
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPackingList = () => {
    window.location.hash = '#packing-list';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Quiz completed - show results
  if (quizCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-6 shadow-lg">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Your Travel Style Revealed!
            </h1>
            <p className="text-lg text-secondary-light">
              Discover what makes your travel adventures unique
            </p>
          </div>

          {/* Primary Result */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8 border-2 border-primary/10">
            <div className="text-center mb-8">
              <div className="text-7xl mb-4">{results.primary.emoji}</div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                {results.primary.name}
              </h2>
              <p className="text-lg text-secondary-light leading-relaxed">
                {results.primary.description}
              </p>
            </div>

            {/* Traits */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center justify-center gap-2">
                <Star className="w-5 h-5" />
                Your Travel Traits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.primary.traits.map((trait, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-primary/5 rounded-xl p-4"
                  >
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-secondary">{trait}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Secondary archetype if blended */}
            {results.isBlended && results.secondary && (
              <div className="border-t-2 border-primary/10 pt-8">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-accent/10 rounded-full px-6 py-2 mb-4">
                    <Award className="w-5 h-5 text-accent" />
                    <span className="text-accent font-semibold">Bonus Trait</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {results.secondary.emoji} {results.secondary.name}
                  </h3>
                  <p className="text-secondary-light">
                    You also have strong {results.secondary.name} tendencies!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Packing List CTA */}
          <div className="bg-gradient-to-r from-accent to-accent/80 rounded-3xl shadow-xl p-8 md:p-10 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Ready to Pack?</h3>
                <p className="text-white/90 text-lg">
                  Now that you know your travel style, create a personalized packing list tailored to your next adventure!
                </p>
              </div>
              <button
                onClick={goToPackingList}
                className="flex-shrink-0 bg-white text-accent px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
              >
                Personalize Your Packing List
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <button
              onClick={shareResult}
              className="flex items-center justify-center gap-3 bg-white border-2 border-primary/20 text-primary px-6 py-4 rounded-2xl font-semibold hover:bg-primary/5 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Share2 className="w-5 h-5" />
              Share Result
            </button>
            <button
              onClick={shareToInstagramStory}
              disabled={isGeneratingStory}
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Instagram className="w-5 h-5" />
              {isGeneratingStory ? 'Generating...' : 'Instagram Story'}
            </button>
            <button
              onClick={restartQuiz}
              className="flex items-center justify-center gap-3 bg-white border-2 border-accent/20 text-accent px-6 py-4 rounded-2xl font-semibold hover:bg-accent/5 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </button>
          </div>

          {/* Home Button */}
          <div className="text-center">
            <button
              onClick={goHome}
              className="inline-flex items-center gap-2 text-secondary-light hover:text-primary transition-colors duration-300"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full mb-4 shadow-lg">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            Travel Style Quiz
          </h1>
          <p className="text-secondary-light">
            Discover your unique travel personality
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-secondary">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary leading-tight">
                {questions[currentQuestion].question}
              </h2>
            </div>
          </div>

          {/* Options */}
          <div key={questionKey} className="space-y-3">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === option.archetype;
              const showFeedback = showResult && isSelected;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option.archetype)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                    showFeedback
                      ? 'bg-primary border-primary text-white shadow-lg scale-[1.02]'
                      : isSelected
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-white border-gray-200 hover:border-primary/30 hover:bg-primary/5'
                  } ${
                    selectedAnswer !== null && !isSelected
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        showFeedback
                          ? 'bg-white border-white'
                          : isSelected
                          ? 'bg-primary/10 border-primary'
                          : 'border-gray-300'
                      }`}
                    >
                      {showFeedback && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <span
                      className={`text-lg font-medium ${
                        showFeedback ? 'text-white' : 'text-secondary'
                      }`}
                    >
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Home Button */}
        <div className="text-center">
          <button
            onClick={goHome}
            className="inline-flex items-center gap-2 text-secondary-light hover:text-primary transition-colors duration-300"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
