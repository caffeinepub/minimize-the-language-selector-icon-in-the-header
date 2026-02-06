import React, { useState, useEffect } from 'react';
import { Compass, RotateCcw, Home, Trophy, Target, CheckCircle, Share2, Instagram, Star, Award } from 'lucide-react';
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
      showToast('Instagram Story image downloaded! Upload it to your Instagram Story.', 'success');
    } catch (error) {
      console.error('Error generating Instagram Story:', error);
      showToast('Failed to generate Instagram Story image. Please try again.', 'error');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const startQuiz = () => {
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
    window.location.reload();
  };

  useEffect(() => {
    startQuiz();
  }, []);

  if (quizCompleted && results) {
    return (
      <div className="min-h-screen bg-neutral-light py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={goHome}
              className="inline-flex items-center space-x-2 text-secondary-light hover:text-secondary mb-4 transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-secondary font-gotham">
                Your Travel Style Revealed!
              </h1>
            </div>
            
            <p className="text-secondary-light text-lg">
              Get ready to explore the world in your unique way
            </p>
          </div>

          {/* Main Result Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            {/* Primary Archetype Section */}
            <div className="bg-accent text-white p-8 text-center">
              <div className="text-6xl mb-4">
                {results.primary.emoji}
              </div>
              
              <h2 className="text-2xl font-bold mb-3 font-gotham">
                {results.primary.name}
              </h2>
              
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Award className="w-4 h-4" />
                <span className="font-medium text-sm">Your Primary Travel Style</span>
              </div>
              
              <p className="text-lg leading-relaxed max-w-2xl mx-auto">
                {results.primary.description}
              </p>
            </div>

            {/* Blended Result Section */}
            {results.isBlended && results.secondary && (
              <div className="bg-neutral-light p-6 border-t border-white">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-3 mb-3">
                    <span className="text-2xl">{results.primary.emoji}</span>
                    <span className="text-accent font-bold">+</span>
                    <span className="text-2xl">{results.secondary.emoji}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-secondary mb-3 font-gotham">
                    You're also a {results.secondary.name}!
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-secondary-light leading-relaxed">
                      {results.secondary.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Traits Section */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-secondary mb-4 text-center font-gotham">
                Your Travel Superpowers
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {/* Primary traits */}
                {results.primary.traits.map((trait, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 bg-neutral-light rounded-lg p-3 border border-neutral-light"
                  >
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-secondary text-sm">{trait}</span>
                  </div>
                ))}
                
                {/* Secondary traits if blended */}
                {results.isBlended && results.secondary && results.secondary.traits.slice(0, 2).map((trait, index) => (
                  <div
                    key={`secondary-${index}`}
                    className="flex items-center space-x-3 bg-white rounded-lg p-3 border border-secondary/20"
                  >
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-secondary text-sm">{trait}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="p-6 bg-neutral-light border-t border-white">
              <h3 className="text-lg font-bold text-secondary mb-4 text-center font-gotham">
                Your Complete Score Breakdown
              </h3>
              
              <div className="max-w-2xl mx-auto space-y-3">
                {Object.entries(scores)
                  .sort(([,a], [,b]) => b - a)
                  .map(([archetype, score], index) => (
                    <div key={archetype} className="relative">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{archetypes[archetype].emoji}</span>
                          <span className="font-medium text-secondary text-sm">
                            {archetype}
                          </span>
                          {index === 0 && (
                            <div className="bg-accent text-white text-xs px-2 py-1 rounded-full font-bold">
                              #1
                            </div>
                          )}
                          {index === 1 && results.isBlended && (
                            <div className="bg-secondary text-white text-xs px-2 py-1 rounded-full font-bold">
                              #2
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-secondary text-sm">
                          {score}/15
                        </span>
                      </div>
                      
                      <div className="w-full bg-white rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ease-out ${
                            index === 0 
                              ? 'bg-accent' 
                              : index === 1 && results.isBlended
                              ? 'bg-secondary'
                              : 'bg-gray-300'
                          }`}
                          style={{ 
                            width: `${(score / 15) * 100}%`,
                            animationDelay: `${index * 100}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-secondary mb-2 font-gotham">
                Ready to Share Your Travel Style?
              </h3>
              <p className="text-secondary-light">
                Let the world know how you love to explore!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <button
                onClick={shareResult}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-sm"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Your Result</span>
              </button>

              <button
                onClick={shareToInstagramStory}
                disabled={isGeneratingStory}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 font-medium shadow-sm"
              >
                {isGeneratingStory ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Instagram className="w-5 h-5" />
                )}
                <span>{isGeneratingStory ? 'Generating...' : 'Instagram Story'}</span>
              </button>
              
              <button
                onClick={startQuiz}
                className="flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg transition-colors font-medium shadow-sm"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Take Again</span>
              </button>
              
              <button
                onClick={goHome}
                className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-secondary border border-neutral-light hover:border-accent px-6 py-3 rounded-lg transition-colors font-medium shadow-sm"
              >
                <Home className="w-5 h-5" />
                <span>Back Home</span>
              </button>
            </div>
          </div>

          {/* Travel Butts Branding Footer */}
          <div className="text-center mt-8 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center justify-center space-x-2 mb-2">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Travel Butts logo"
                  className="h-6 w-auto"
                />
              )}
              <span className="text-lg font-bold text-secondary font-gotham">Travel Butts</span>
            </div>
            <p className="text-secondary-light text-sm">
              Pack smart, travel light, explore more.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!questions[currentQuestion]) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-secondary-light">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-neutral-light py-4 sm:py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <button
            onClick={goHome}
            className="inline-flex items-center space-x-2 text-secondary-light hover:text-secondary mb-4 transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-secondary">Travel Style Quiz</h1>
          </div>
          
          <div className="flex items-center justify-center space-x-4 sm:space-x-6 text-sm text-secondary-light">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Question {currentQuestion + 1}/15</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white rounded-full h-2 mb-6 sm:mb-8">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / 15) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4 sm:mb-6">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              <h2 className="text-lg sm:text-xl font-semibold text-secondary">Discover Your Travel Style</h2>
            </div>
            
            <div className="text-xl sm:text-2xl font-bold text-secondary mb-4 sm:mb-6 leading-tight">
              {question.question}
            </div>
          </div>

          {/* Answer Options */}
          <div key={questionKey} className="space-y-3">
            {question.options.map((option, index) => {
              let buttonClass = "w-full p-3 sm:p-4 text-left border-2 rounded-xl transition-all duration-200 touch-manipulation quiz-option-button ";
              
              if (showResult) {
                if (option.archetype === selectedAnswer) {
                  buttonClass += "border-accent bg-accent bg-opacity-10 text-accent";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                }
              } else {
                // Always start with clean white background for new questions
                buttonClass += "border-neutral-light bg-white text-secondary quiz-option-clean";
              }

              return (
                <button
                  key={`${questionKey}-${index}`} // Force complete re-render
                  onClick={() => handleAnswerSelect(option.archetype)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-left pr-4 text-sm sm:text-base leading-relaxed">
                      {option.text}
                    </span>
                    {showResult && option.archetype === selectedAnswer && (
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result Feedback */}
          {showResult && selectedAnswer && (
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-accent bg-opacity-10 rounded-xl text-center">
              <div className="text-accent">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                <p className="font-semibold text-sm sm:text-base">
                  That's very {selectedAnswer}!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
