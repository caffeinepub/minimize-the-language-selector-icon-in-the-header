import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  MapPin, 
  Flag, 
  Compass,
  Settings,
  Copy,
  RotateCcw
} from 'lucide-react';

// Geography Quiz Types
interface GeographyQuestion {
  id: string;
  type: 'flag' | 'capital';
  country: {
    name: string;
    capital: string;
    code: string;
  };
  options: string[];
  correctAnswer: string;
}

// Travel Style Quiz Types
interface TravelStyleQuestion {
  id: string;
  question: string;
  options: {
    text: string;
    archetype: string;
  }[];
}

interface TravelArchetype {
  name: string;
  description: string;
  emoji: string;
  traits: string[];
}

// Mock data for Geography Quiz (this would come from backend in real implementation)
const defaultGeographyQuestions: GeographyQuestion[] = [
  {
    id: 'geo-1',
    type: 'flag',
    country: { name: 'France', capital: 'Paris', code: 'fr' },
    options: ['France', 'Italy', 'Spain'],
    correctAnswer: 'France'
  },
  {
    id: 'geo-2',
    type: 'capital',
    country: { name: 'Japan', capital: 'Tokyo', code: 'jp' },
    options: ['Tokyo', 'Osaka', 'Kyoto'],
    correctAnswer: 'Tokyo'
  }
];

// Mock data for Travel Style Quiz (this would come from backend in real implementation)
const defaultTravelStyleQuestions: TravelStyleQuestion[] = [
  {
    id: 'travel-1',
    question: "What's your ideal vacation accommodation?",
    options: [
      { text: "A luxury resort with all amenities", archetype: "Luxe Nomad" },
      { text: "A cozy local guesthouse with character", archetype: "Culture Connoisseur" },
      { text: "A beachfront bungalow for ultimate relaxation", archetype: "Chill Escapist" }
    ]
  }
];

const defaultArchetypes: Record<string, TravelArchetype> = {
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

export default function QuizManager() {
  const [activeTab, setActiveTab] = useState<'geography' | 'travel-style'>('geography');
  const [geographyQuestions, setGeographyQuestions] = useState<GeographyQuestion[]>(defaultGeographyQuestions);
  const [travelStyleQuestions, setTravelStyleQuestions] = useState<TravelStyleQuestion[]>(defaultTravelStyleQuestions);
  const [archetypes, setArchetypes] = useState<Record<string, TravelArchetype>>(defaultArchetypes);
  
  // Modal states
  const [showGeographyModal, setShowGeographyModal] = useState(false);
  const [showTravelStyleModal, setShowTravelStyleModal] = useState(false);
  const [showArchetypeModal, setShowArchetypeModal] = useState(false);
  const [editingGeographyQuestion, setEditingGeographyQuestion] = useState<GeographyQuestion | null>(null);
  const [editingTravelStyleQuestion, setEditingTravelStyleQuestion] = useState<TravelStyleQuestion | null>(null);
  const [editingArchetype, setEditingArchetype] = useState<string | null>(null);

  // Geography Question Form
  const [geoForm, setGeoForm] = useState({
    type: 'flag' as 'flag' | 'capital',
    countryName: '',
    countryCapital: '',
    countryCode: '',
    option1: '',
    option2: '',
    option3: ''
  });

  // Travel Style Question Form
  const [travelForm, setTravelForm] = useState({
    question: '',
    options: [
      { text: '', archetype: 'Thrill Seeker' },
      { text: '', archetype: 'Culture Connoisseur' },
      { text: '', archetype: 'Chill Escapist' }
    ]
  });

  // Archetype Form
  const [archetypeForm, setArchetypeForm] = useState({
    name: '',
    description: '',
    emoji: '',
    traits: ['', '', '', '', '']
  });

  const resetGeographyForm = () => {
    setGeoForm({
      type: 'flag',
      countryName: '',
      countryCapital: '',
      countryCode: '',
      option1: '',
      option2: '',
      option3: ''
    });
    setEditingGeographyQuestion(null);
  };

  const resetTravelStyleForm = () => {
    setTravelForm({
      question: '',
      options: [
        { text: '', archetype: 'Thrill Seeker' },
        { text: '', archetype: 'Culture Connoisseur' },
        { text: '', archetype: 'Chill Escapist' }
      ]
    });
    setEditingTravelStyleQuestion(null);
  };

  const resetArchetypeForm = () => {
    setArchetypeForm({
      name: '',
      description: '',
      emoji: '',
      traits: ['', '', '', '', '']
    });
    setEditingArchetype(null);
  };

  const handleSaveGeographyQuestion = () => {
    const correctAnswer = geoForm.type === 'flag' ? geoForm.countryName : geoForm.countryCapital;
    const options = [correctAnswer, geoForm.option1, geoForm.option2].filter(Boolean);
    
    if (options.length < 3) {
      alert('Please provide at least 2 incorrect options');
      return;
    }

    const question: GeographyQuestion = {
      id: editingGeographyQuestion?.id || `geo-${Date.now()}`,
      type: geoForm.type,
      country: {
        name: geoForm.countryName,
        capital: geoForm.countryCapital,
        code: geoForm.countryCode.toLowerCase()
      },
      options: options.sort(() => Math.random() - 0.5), // Shuffle options
      correctAnswer
    };

    if (editingGeographyQuestion) {
      setGeographyQuestions(prev => prev.map(q => q.id === question.id ? question : q));
    } else {
      setGeographyQuestions(prev => [...prev, question]);
    }

    setShowGeographyModal(false);
    resetGeographyForm();
  };

  const handleSaveTravelStyleQuestion = () => {
    const validOptions = travelForm.options.filter(opt => opt.text.trim() !== '');
    
    if (validOptions.length < 3) {
      alert('Please provide at least 3 answer options');
      return;
    }

    const question: TravelStyleQuestion = {
      id: editingTravelStyleQuestion?.id || `travel-${Date.now()}`,
      question: travelForm.question,
      options: validOptions
    };

    if (editingTravelStyleQuestion) {
      setTravelStyleQuestions(prev => prev.map(q => q.id === question.id ? question : q));
    } else {
      setTravelStyleQuestions(prev => [...prev, question]);
    }

    setShowTravelStyleModal(false);
    resetTravelStyleForm();
  };

  const handleSaveArchetype = () => {
    const validTraits = archetypeForm.traits.filter(trait => trait.trim() !== '');
    
    if (!archetypeForm.name || !archetypeForm.description || validTraits.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    const archetype: TravelArchetype = {
      name: archetypeForm.name,
      description: archetypeForm.description,
      emoji: archetypeForm.emoji,
      traits: validTraits
    };

    const oldName = editingArchetype || archetypeForm.name;
    setArchetypes(prev => ({
      ...prev,
      [archetypeForm.name]: archetype
    }));

    // If name changed, remove old entry
    if (editingArchetype && editingArchetype !== archetypeForm.name) {
      setArchetypes(prev => {
        const newArchetypes = { ...prev };
        delete newArchetypes[editingArchetype];
        return newArchetypes;
      });
    }

    setShowArchetypeModal(false);
    resetArchetypeForm();
  };

  const handleEditGeographyQuestion = (question: GeographyQuestion) => {
    setEditingGeographyQuestion(question);
    setGeoForm({
      type: question.type,
      countryName: question.country.name,
      countryCapital: question.country.capital,
      countryCode: question.country.code,
      option1: question.options.find(opt => opt !== question.correctAnswer) || '',
      option2: question.options.filter(opt => opt !== question.correctAnswer)[1] || '',
      option3: ''
    });
    setShowGeographyModal(true);
  };

  const handleEditTravelStyleQuestion = (question: TravelStyleQuestion) => {
    setEditingTravelStyleQuestion(question);
    setTravelForm({
      question: question.question,
      options: [
        ...question.options,
        ...Array(Math.max(0, 7 - question.options.length)).fill({ text: '', archetype: 'Thrill Seeker' })
      ].slice(0, 7)
    });
    setShowTravelStyleModal(true);
  };

  const handleEditArchetype = (name: string) => {
    const archetype = archetypes[name];
    setEditingArchetype(name);
    setArchetypeForm({
      name: archetype.name,
      description: archetype.description,
      emoji: archetype.emoji,
      traits: [
        ...archetype.traits,
        ...Array(Math.max(0, 5 - archetype.traits.length)).fill('')
      ].slice(0, 5)
    });
    setShowArchetypeModal(true);
  };

  const handleDeleteGeographyQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setGeographyQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleDeleteTravelStyleQuestion = (id: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      setTravelStyleQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleDeleteArchetype = (name: string) => {
    if (confirm('Are you sure you want to delete this archetype?')) {
      setArchetypes(prev => {
        const newArchetypes = { ...prev };
        delete newArchetypes[name];
        return newArchetypes;
      });
    }
  };

  const moveQuestion = (index: number, direction: 'up' | 'down', type: 'geography' | 'travel-style') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (type === 'geography') {
      if (newIndex < 0 || newIndex >= geographyQuestions.length) return;
      const newQuestions = [...geographyQuestions];
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      setGeographyQuestions(newQuestions);
    } else {
      if (newIndex < 0 || newIndex >= travelStyleQuestions.length) return;
      const newQuestions = [...travelStyleQuestions];
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      setTravelStyleQuestions(newQuestions);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-secondary">Quiz Management</h3>
        <p className="text-sm text-secondary-light mt-1">Manage questions and content for both quizzes</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('geography')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            activeTab === 'geography'
              ? 'bg-white text-accent shadow-sm'
              : 'text-secondary-light hover:text-secondary'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Geography Quiz</span>
        </button>
        <button
          onClick={() => setActiveTab('travel-style')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            activeTab === 'travel-style'
              ? 'bg-white text-accent shadow-sm'
              : 'text-secondary-light hover:text-secondary'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Travel Style Quiz</span>
        </button>
      </div>

      {/* Geography Quiz Management */}
      {activeTab === 'geography' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-secondary">Geography Questions</h4>
            <button
              onClick={() => {
                resetGeographyForm();
                setShowGeographyModal(true);
              }}
              className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-3">
            {geographyQuestions.map((question, index) => (
              <div key={question.id} className="bg-white border border-neutral-light rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {question.type === 'flag' ? (
                          <Flag className="w-4 h-4 text-accent" />
                        ) : (
                          <MapPin className="w-4 h-4 text-accent" />
                        )}
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {question.type === 'flag' ? 'Flag Question' : 'Capital Question'}
                        </span>
                      </div>
                    </div>
                    <h5 className="font-medium text-secondary mb-1">
                      {question.type === 'flag' 
                        ? `Guess the country: ${question.country.name}` 
                        : `Capital of ${question.country.name}: ${question.country.capital}`
                      }
                    </h5>
                    <p className="text-sm text-secondary-light">
                      Options: {question.options.join(', ')}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Correct: {question.correctAnswer}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => moveQuestion(index, 'up', 'geography')}
                      disabled={index === 0}
                      className="p-1 text-secondary-light hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveQuestion(index, 'down', 'geography')}
                      disabled={index === geographyQuestions.length - 1}
                      className="p-1 text-secondary-light hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditGeographyQuestion(question)}
                      className="p-1 text-secondary-light hover:text-secondary"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGeographyQuestion(question.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {geographyQuestions.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <MapPin className="w-12 h-12 text-secondary-light mx-auto mb-4" />
                <p className="text-secondary-light">No geography questions yet.</p>
                <button
                  onClick={() => {
                    resetGeographyForm();
                    setShowGeographyModal(true);
                  }}
                  className="mt-4 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Your First Question
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Travel Style Quiz Management */}
      {activeTab === 'travel-style' && (
        <div className="space-y-6">
          {/* Questions Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-secondary">Travel Style Questions</h4>
              <button
                onClick={() => {
                  resetTravelStyleForm();
                  setShowTravelStyleModal(true);
                }}
                className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-3">
              {travelStyleQuestions.map((question, index) => (
                <div key={question.id} className="bg-white border border-neutral-light rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-secondary mb-2">{question.question}</h5>
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="text-sm text-secondary-light flex items-center space-x-2">
                            <span className="w-2 h-2 bg-accent rounded-full"></span>
                            <span>{option.text}</span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {option.archetype}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => moveQuestion(index, 'up', 'travel-style')}
                        disabled={index === 0}
                        className="p-1 text-secondary-light hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveQuestion(index, 'down', 'travel-style')}
                        disabled={index === travelStyleQuestions.length - 1}
                        className="p-1 text-secondary-light hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditTravelStyleQuestion(question)}
                        className="p-1 text-secondary-light hover:text-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTravelStyleQuestion(question.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {travelStyleQuestions.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Compass className="w-12 h-12 text-secondary-light mx-auto mb-4" />
                  <p className="text-secondary-light">No travel style questions yet.</p>
                  <button
                    onClick={() => {
                      resetTravelStyleForm();
                      setShowTravelStyleModal(true);
                    }}
                    className="mt-4 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Add Your First Question
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Archetypes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-secondary">Travel Archetypes</h4>
              <button
                onClick={() => {
                  resetArchetypeForm();
                  setShowArchetypeModal(true);
                }}
                className="flex items-center space-x-2 bg-secondary hover:bg-secondary text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Archetype</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(archetypes).map(([name, archetype]) => (
                <div key={name} className="bg-white border border-neutral-light rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{archetype.emoji}</span>
                      <h5 className="font-semibold text-secondary">{archetype.name}</h5>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditArchetype(name)}
                        className="p-1 text-secondary-light hover:text-secondary"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArchetype(name)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-secondary-light mb-3 line-clamp-2">
                    {archetype.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {archetype.traits.slice(0, 3).map((trait, index) => (
                      <span key={index} className="text-xs bg-accent bg-opacity-10 text-accent px-2 py-1 rounded">
                        {trait}
                      </span>
                    ))}
                    {archetype.traits.length > 3 && (
                      <span className="text-xs text-secondary-light">
                        +{archetype.traits.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Geography Question Modal */}
      {showGeographyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-neutral-light">
              <h2 className="text-xl font-bold text-secondary">
                {editingGeographyQuestion ? 'Edit Geography Question' : 'Add Geography Question'}
              </h2>
              <button
                onClick={() => {
                  setShowGeographyModal(false);
                  resetGeographyForm();
                }}
                className="text-secondary-light hover:text-secondary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Question Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="flag"
                      checked={geoForm.type === 'flag'}
                      onChange={(e) => setGeoForm(prev => ({ ...prev, type: e.target.value as 'flag' | 'capital' }))}
                      className="mr-2"
                    />
                    <Flag className="w-4 h-4 mr-1" />
                    Flag Question
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="capital"
                      checked={geoForm.type === 'capital'}
                      onChange={(e) => setGeoForm(prev => ({ ...prev, type: e.target.value as 'flag' | 'capital' }))}
                      className="mr-2"
                    />
                    <MapPin className="w-4 h-4 mr-1" />
                    Capital Question
                  </label>
                </div>
              </div>

              {/* Country Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Country Name *</label>
                  <input
                    type="text"
                    value={geoForm.countryName}
                    onChange={(e) => setGeoForm(prev => ({ ...prev, countryName: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="e.g., France"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Capital City *</label>
                  <input
                    type="text"
                    value={geoForm.countryCapital}
                    onChange={(e) => setGeoForm(prev => ({ ...prev, countryCapital: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="e.g., Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Country Code *</label>
                  <input
                    type="text"
                    value={geoForm.countryCode}
                    onChange={(e) => setGeoForm(prev => ({ ...prev, countryCode: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="e.g., FR"
                    maxLength={2}
                  />
                </div>
              </div>

              {/* Wrong Answer Options */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Wrong Answer Options (2 required)
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={geoForm.option1}
                    onChange={(e) => setGeoForm(prev => ({ ...prev, option1: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder={geoForm.type === 'flag' ? 'Wrong country name' : 'Wrong capital city'}
                  />
                  <input
                    type="text"
                    value={geoForm.option2}
                    onChange={(e) => setGeoForm(prev => ({ ...prev, option2: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder={geoForm.type === 'flag' ? 'Wrong country name' : 'Wrong capital city'}
                  />
                </div>
              </div>

              {/* Preview */}
              {geoForm.countryName && geoForm.countryCapital && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-secondary mb-2">Preview:</h4>
                  <p className="text-sm text-secondary-light">
                    {geoForm.type === 'flag' 
                      ? `Question: "Guess the country" (shows flag of ${geoForm.countryName})`
                      : `Question: "What's the capital of ${geoForm.countryName}?"`
                    }
                  </p>
                  <p className="text-sm text-secondary-light mt-1">
                    Correct Answer: {geoForm.type === 'flag' ? geoForm.countryName : geoForm.countryCapital}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-light">
                <button
                  onClick={() => {
                    setShowGeographyModal(false);
                    resetGeographyForm();
                  }}
                  className="px-6 py-2 border border-neutral-light text-secondary rounded-lg hover:bg-neutral-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveGeographyQuestion}
                  className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingGeographyQuestion ? 'Update' : 'Add'} Question</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Travel Style Question Modal */}
      {showTravelStyleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-light">
              <h2 className="text-xl font-bold text-secondary">
                {editingTravelStyleQuestion ? 'Edit Travel Style Question' : 'Add Travel Style Question'}
              </h2>
              <button
                onClick={() => {
                  setShowTravelStyleModal(false);
                  resetTravelStyleForm();
                }}
                className="text-secondary-light hover:text-secondary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Question *</label>
                <input
                  type="text"
                  value={travelForm.question}
                  onChange={(e) => setTravelForm(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="e.g., What's your ideal vacation accommodation?"
                />
              </div>

              {/* Answer Options */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Answer Options (at least 3 required)
                </label>
                <div className="space-y-3">
                  {travelForm.options.map((option, index) => (
                    <div key={index} className="flex space-x-3">
                      <input
                        type="text"
                        value={option.text}
                        onChange={(e) => {
                          const newOptions = [...travelForm.options];
                          newOptions[index] = { ...newOptions[index], text: e.target.value };
                          setTravelForm(prev => ({ ...prev, options: newOptions }));
                        }}
                        className="flex-1 px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder={`Answer option ${index + 1}`}
                      />
                      <select
                        value={option.archetype}
                        onChange={(e) => {
                          const newOptions = [...travelForm.options];
                          newOptions[index] = { ...newOptions[index], archetype: e.target.value };
                          setTravelForm(prev => ({ ...prev, options: newOptions }));
                        }}
                        className="px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      >
                        {Object.keys(archetypes).map(archetype => (
                          <option key={archetype} value={archetype}>{archetype}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    if (travelForm.options.length < 7) {
                      setTravelForm(prev => ({
                        ...prev,
                        options: [...prev.options, { text: '', archetype: 'Thrill Seeker' }]
                      }));
                    }
                  }}
                  disabled={travelForm.options.length >= 7}
                  className="mt-2 text-sm text-accent hover:text-accent-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add Another Option
                </button>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-light">
                <button
                  onClick={() => {
                    setShowTravelStyleModal(false);
                    resetTravelStyleForm();
                  }}
                  className="px-6 py-2 border border-neutral-light text-secondary rounded-lg hover:bg-neutral-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTravelStyleQuestion}
                  className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTravelStyleQuestion ? 'Update' : 'Add'} Question</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archetype Modal */}
      {showArchetypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-light">
              <h2 className="text-xl font-bold text-secondary">
                {editingArchetype ? 'Edit Travel Archetype' : 'Add Travel Archetype'}
              </h2>
              <button
                onClick={() => {
                  setShowArchetypeModal(false);
                  resetArchetypeForm();
                }}
                className="text-secondary-light hover:text-secondary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Archetype Name *</label>
                  <input
                    type="text"
                    value={archetypeForm.name}
                    onChange={(e) => setArchetypeForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="e.g., Thrill Seeker"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Emoji *</label>
                  <input
                    type="text"
                    value={archetypeForm.emoji}
                    onChange={(e) => setArchetypeForm(prev => ({ ...prev, emoji: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="🏔️"
                    maxLength={2}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Description *</label>
                <textarea
                  value={archetypeForm.description}
                  onChange={(e) => setArchetypeForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Describe this travel archetype..."
                />
              </div>

              {/* Traits */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Traits</label>
                <div className="space-y-2">
                  {archetypeForm.traits.map((trait, index) => (
                    <input
                      key={index}
                      type="text"
                      value={trait}
                      onChange={(e) => {
                        const newTraits = [...archetypeForm.traits];
                        newTraits[index] = e.target.value;
                        setArchetypeForm(prev => ({ ...prev, traits: newTraits }));
                      }}
                      className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder={`Trait ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              {archetypeForm.name && archetypeForm.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-secondary mb-2">Preview:</h4>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{archetypeForm.emoji}</span>
                    <span className="font-semibold text-secondary">{archetypeForm.name}</span>
                  </div>
                  <p className="text-sm text-secondary-light">{archetypeForm.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-light">
                <button
                  onClick={() => {
                    setShowArchetypeModal(false);
                    resetArchetypeForm();
                  }}
                  className="px-6 py-2 border border-neutral-light text-secondary rounded-lg hover:bg-neutral-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveArchetype}
                  className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingArchetype ? 'Update' : 'Add'} Archetype</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
