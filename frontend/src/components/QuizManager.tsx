import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown, 
  MapPin, 
  Compass,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { useGetAllTravelStyles, useUpdateTravelStyle } from '../hooks/useQueries';
import { useFileUpload, useFileUrl } from '../blob-storage/FileStorage';
import { showToast } from '../utils/toast';

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
  
  // Fetch travel styles from backend
  const { data: travelStyles } = useGetAllTravelStyles();
  const { mutate: updateTravelStyle } = useUpdateTravelStyle();
  const { uploadFile, isUploading } = useFileUpload();

  const handleImageUpload = async (file: File, travelStyleName: string, travelStyleDescription: string) => {
    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        showToast('Please upload a JPG, PNG, or WebP image', 'error');
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showToast('Image must be smaller than 10MB', 'error');
        return;
      }

      // Upload the file
      const imagePath = `travel-styles/${travelStyleName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.${file.type.split('/')[1]}`;
      const { path } = await uploadFile(imagePath, file);

      // Update the travel style with the new image path
      updateTravelStyle({
        name: travelStyleName,
        description: travelStyleDescription,
        baseImage: path
      });

      showToast('Image uploaded successfully!', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      showToast('Failed to upload image', 'error');
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
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <MapPin className="w-12 h-12 text-secondary-light mx-auto mb-4" />
            <p className="text-secondary-light">Geography quiz management coming soon.</p>
          </div>
        </div>
      )}

      {/* Travel Style Quiz Management */}
      {activeTab === 'travel-style' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-secondary">Travel Style Instagram Images</h4>
            <p className="text-sm text-secondary-light">Upload custom background images for Instagram stories</p>
          </div>

          <div className="space-y-4">
            {travelStyles && travelStyles.length > 0 ? (
              travelStyles.map((style) => (
                <TravelStyleImageUploader
                  key={style.id}
                  travelStyle={style}
                  onUpload={handleImageUpload}
                  isUploading={isUploading}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Compass className="w-12 h-12 text-secondary-light mx-auto mb-4" />
                <p className="text-secondary-light">No travel styles found. They will be created automatically when users take the quiz.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Component for uploading images for each travel style
function TravelStyleImageUploader({ 
  travelStyle, 
  onUpload, 
  isUploading 
}: { 
  travelStyle: { id: string; name: string; description: string; baseImage?: string };
  onUpload: (file: File, name: string, description: string) => Promise<void>;
  isUploading: boolean;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: imageUrl } = useFileUrl(travelStyle.baseImage || '');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile, travelStyle.name, travelStyle.description);
      setSelectedFile(null);
    }
  };

  return (
    <div className="bg-white border border-neutral-light rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{travelStyle.name.includes('Thrill') ? '🏔️' : travelStyle.name.includes('Culture') ? '🏛️' : travelStyle.name.includes('Chill') ? '🏖️' : travelStyle.name.includes('Luxe') ? '✨' : travelStyle.name.includes('Social') ? '🦋' : travelStyle.name.includes('Master') ? '📋' : '🌟'}</span>
            <div>
              <h5 className="font-medium text-secondary">{travelStyle.name}</h5>
              <p className="text-xs text-secondary-light">{travelStyle.description}</p>
            </div>
          </div>

          {/* Current Image Preview */}
          {imageUrl && (
            <div className="mt-3 mb-3">
              <p className="text-xs text-secondary-light mb-2">Current Image:</p>
              <img 
                src={imageUrl} 
                alt={`${travelStyle.name} background`}
                className="w-32 h-32 object-cover rounded-lg border border-neutral-light"
              />
            </div>
          )}

          {/* File Upload */}
          <div className="mt-3 space-y-2">
            <label className="block">
              <span className="text-sm text-secondary-light">Upload Instagram Story Background:</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="mt-1 block w-full text-sm text-secondary-light
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-accent file:text-white
                  hover:file:bg-accent-dark
                  file:cursor-pointer cursor-pointer"
              />
            </label>
            {selectedFile && (
              <div className="flex items-center space-x-2">
                <p className="text-xs text-secondary-light">Selected: {selectedFile.name}</p>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="text-xs bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-xs text-secondary-light hover:text-secondary"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0">
          {travelStyle.baseImage ? (
            <div className="flex items-center space-x-2 text-green-600">
              <ImageIcon className="w-5 h-5" />
              <span className="text-xs">Image uploaded</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-secondary-light">
              <Upload className="w-5 h-5" />
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
