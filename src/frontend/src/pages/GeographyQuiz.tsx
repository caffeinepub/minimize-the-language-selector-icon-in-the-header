import React, { useState, useEffect } from 'react';
import { MapPin, Flag, RotateCcw, Home, Trophy, Target, CheckCircle, XCircle, Share2, Instagram } from 'lucide-react';
import { useFileUrl } from '../blob-storage/FileStorage';
import { generateGeographyQuizStory, downloadInstagramStory } from '../utils/instagramStoryGenerator';
import { showToast } from '../utils/toast';

interface Country {
  name: string;
  capital: string;
  code: string; // ISO country code for flag API
}

interface Question {
  type: 'flag' | 'capital';
  country: Country;
  options: string[];
  correctAnswer: string;
}

// Expanded quiz data with challenging countries from all continents
const countries: Country[] = [
  // Europe
  { name: 'France', capital: 'Paris', code: 'fr' },
  { name: 'Germany', capital: 'Berlin', code: 'de' },
  { name: 'Italy', capital: 'Rome', code: 'it' },
  { name: 'Spain', capital: 'Madrid', code: 'es' },
  { name: 'United Kingdom', capital: 'London', code: 'gb' },
  { name: 'Netherlands', capital: 'Amsterdam', code: 'nl' },
  { name: 'Sweden', capital: 'Stockholm', code: 'se' },
  { name: 'Norway', capital: 'Oslo', code: 'no' },
  { name: 'Switzerland', capital: 'Bern', code: 'ch' },
  { name: 'Portugal', capital: 'Lisbon', code: 'pt' },
  { name: 'Greece', capital: 'Athens', code: 'gr' },
  { name: 'Turkey', capital: 'Ankara', code: 'tr' },
  { name: 'Poland', capital: 'Warsaw', code: 'pl' },
  { name: 'Czech Republic', capital: 'Prague', code: 'cz' },
  { name: 'Austria', capital: 'Vienna', code: 'at' },
  { name: 'Belgium', capital: 'Brussels', code: 'be' },
  { name: 'Denmark', capital: 'Copenhagen', code: 'dk' },
  { name: 'Finland', capital: 'Helsinki', code: 'fi' },
  { name: 'Ireland', capital: 'Dublin', code: 'ie' },
  { name: 'Iceland', capital: 'Reykjavik', code: 'is' },
  { name: 'Luxembourg', capital: 'Luxembourg City', code: 'lu' },
  { name: 'Malta', capital: 'Valletta', code: 'mt' },
  { name: 'Estonia', capital: 'Tallinn', code: 'ee' },
  { name: 'Latvia', capital: 'Riga', code: 'lv' },
  { name: 'Lithuania', capital: 'Vilnius', code: 'lt' },
  { name: 'Slovenia', capital: 'Ljubljana', code: 'si' },
  { name: 'Slovakia', capital: 'Bratislava', code: 'sk' },
  { name: 'Croatia', capital: 'Zagreb', code: 'hr' },
  { name: 'Serbia', capital: 'Belgrade', code: 'rs' },
  { name: 'Montenegro', capital: 'Podgorica', code: 'me' },
  { name: 'North Macedonia', capital: 'Skopje', code: 'mk' },
  { name: 'Albania', capital: 'Tirana', code: 'al' },
  { name: 'Bosnia and Herzegovina', capital: 'Sarajevo', code: 'ba' },
  { name: 'Moldova', capital: 'Chisinau', code: 'md' },
  { name: 'Belarus', capital: 'Minsk', code: 'by' },
  { name: 'Ukraine', capital: 'Kyiv', code: 'ua' },
  { name: 'Romania', capital: 'Bucharest', code: 'ro' },
  { name: 'Bulgaria', capital: 'Sofia', code: 'bg' },
  { name: 'Hungary', capital: 'Budapest', code: 'hu' },

  // Asia
  { name: 'Japan', capital: 'Tokyo', code: 'jp' },
  { name: 'China', capital: 'Beijing', code: 'cn' },
  { name: 'India', capital: 'New Delhi', code: 'in' },
  { name: 'South Korea', capital: 'Seoul', code: 'kr' },
  { name: 'Thailand', capital: 'Bangkok', code: 'th' },
  { name: 'Vietnam', capital: 'Hanoi', code: 'vn' },
  { name: 'Indonesia', capital: 'Jakarta', code: 'id' },
  { name: 'Malaysia', capital: 'Kuala Lumpur', code: 'my' },
  { name: 'Singapore', capital: 'Singapore', code: 'sg' },
  { name: 'Philippines', capital: 'Manila', code: 'ph' },
  { name: 'Cambodia', capital: 'Phnom Penh', code: 'kh' },
  { name: 'Laos', capital: 'Vientiane', code: 'la' },
  { name: 'Myanmar', capital: 'Naypyidaw', code: 'mm' },
  { name: 'Bangladesh', capital: 'Dhaka', code: 'bd' },
  { name: 'Sri Lanka', capital: 'Sri Jayawardenepura Kotte', code: 'lk' },
  { name: 'Nepal', capital: 'Kathmandu', code: 'np' },
  { name: 'Bhutan', capital: 'Thimphu', code: 'bt' },
  { name: 'Maldives', capital: 'Malé', code: 'mv' },
  { name: 'Pakistan', capital: 'Islamabad', code: 'pk' },
  { name: 'Afghanistan', capital: 'Kabul', code: 'af' },
  { name: 'Iran', capital: 'Tehran', code: 'ir' },
  { name: 'Iraq', capital: 'Baghdad', code: 'iq' },
  { name: 'Saudi Arabia', capital: 'Riyadh', code: 'sa' },
  { name: 'United Arab Emirates', capital: 'Abu Dhabi', code: 'ae' },
  { name: 'Qatar', capital: 'Doha', code: 'qa' },
  { name: 'Kuwait', capital: 'Kuwait City', code: 'kw' },
  { name: 'Bahrain', capital: 'Manama', code: 'bh' },
  { name: 'Oman', capital: 'Muscat', code: 'om' },
  { name: 'Yemen', capital: 'Sanaa', code: 'ye' },
  { name: 'Jordan', capital: 'Amman', code: 'jo' },
  { name: 'Lebanon', capital: 'Beirut', code: 'lb' },
  { name: 'Syria', capital: 'Damascus', code: 'sy' },
  { name: 'Israel', capital: 'Jerusalem', code: 'il' },
  { name: 'Cyprus', capital: 'Nicosia', code: 'cy' },
  { name: 'Georgia', capital: 'Tbilisi', code: 'ge' },
  { name: 'Armenia', capital: 'Yerevan', code: 'am' },
  { name: 'Azerbaijan', capital: 'Baku', code: 'az' },
  { name: 'Kazakhstan', capital: 'Nur-Sultan', code: 'kz' },
  { name: 'Uzbekistan', capital: 'Tashkent', code: 'uz' },
  { name: 'Turkmenistan', capital: 'Ashgabat', code: 'tm' },
  { name: 'Kyrgyzstan', capital: 'Bishkek', code: 'kg' },
  { name: 'Tajikistan', capital: 'Dushanbe', code: 'tj' },
  { name: 'Mongolia', capital: 'Ulaanbaatar', code: 'mn' },
  { name: 'North Korea', capital: 'Pyongyang', code: 'kp' },

  // Africa
  { name: 'South Africa', capital: 'Cape Town', code: 'za' },
  { name: 'Egypt', capital: 'Cairo', code: 'eg' },
  { name: 'Nigeria', capital: 'Abuja', code: 'ng' },
  { name: 'Kenya', capital: 'Nairobi', code: 'ke' },
  { name: 'Morocco', capital: 'Rabat', code: 'ma' },
  { name: 'Ethiopia', capital: 'Addis Ababa', code: 'et' },
  { name: 'Ghana', capital: 'Accra', code: 'gh' },
  { name: 'Tanzania', capital: 'Dodoma', code: 'tz' },
  { name: 'Uganda', capital: 'Kampala', code: 'ug' },
  { name: 'Rwanda', capital: 'Kigali', code: 'rw' },
  { name: 'Senegal', capital: 'Dakar', code: 'sn' },
  { name: 'Mali', capital: 'Bamako', code: 'ml' },
  { name: 'Burkina Faso', capital: 'Ouagadougou', code: 'bf' },
  { name: 'Niger', capital: 'Niamey', code: 'ne' },
  { name: 'Chad', capital: 'N\'Djamena', code: 'td' },
  { name: 'Sudan', capital: 'Khartoum', code: 'sd' },
  { name: 'Libya', capital: 'Tripoli', code: 'ly' },
  { name: 'Tunisia', capital: 'Tunis', code: 'tn' },
  { name: 'Algeria', capital: 'Algiers', code: 'dz' },
  { name: 'Cameroon', capital: 'Yaoundé', code: 'cm' },
  { name: 'Democratic Republic of the Congo', capital: 'Kinshasa', code: 'cd' },
  { name: 'Republic of the Congo', capital: 'Brazzaville', code: 'cg' },
  { name: 'Central African Republic', capital: 'Bangui', code: 'cf' },
  { name: 'Gabon', capital: 'Libreville', code: 'ga' },
  { name: 'Equatorial Guinea', capital: 'Malabo', code: 'gq' },
  { name: 'São Tomé and Príncipe', capital: 'São Tomé', code: 'st' },
  { name: 'Angola', capital: 'Luanda', code: 'ao' },
  { name: 'Zambia', capital: 'Lusaka', code: 'zm' },
  { name: 'Zimbabwe', capital: 'Harare', code: 'zw' },
  { name: 'Botswana', capital: 'Gaborone', code: 'bw' },
  { name: 'Namibia', capital: 'Windhoek', code: 'na' },
  { name: 'Lesotho', capital: 'Maseru', code: 'ls' },
  { name: 'Eswatini', capital: 'Mbabane', code: 'sz' },
  { name: 'Mozambique', capital: 'Maputo', code: 'mz' },
  { name: 'Madagascar', capital: 'Antananarivo', code: 'mg' },
  { name: 'Mauritius', capital: 'Port Louis', code: 'mu' },
  { name: 'Seychelles', capital: 'Victoria', code: 'sc' },
  { name: 'Comoros', capital: 'Moroni', code: 'km' },
  { name: 'Djibouti', capital: 'Djibouti City', code: 'dj' },
  { name: 'Eritrea', capital: 'Asmara', code: 'er' },
  { name: 'Somalia', capital: 'Mogadishu', code: 'so' },

  // North America
  { name: 'United States', capital: 'Washington, D.C.', code: 'us' },
  { name: 'Canada', capital: 'Ottawa', code: 'ca' },
  { name: 'Mexico', capital: 'Mexico City', code: 'mx' },
  { name: 'Guatemala', capital: 'Guatemala City', code: 'gt' },
  { name: 'Belize', capital: 'Belmopan', code: 'bz' },
  { name: 'El Salvador', capital: 'San Salvador', code: 'sv' },
  { name: 'Honduras', capital: 'Tegucigalpa', code: 'hn' },
  { name: 'Nicaragua', capital: 'Managua', code: 'ni' },
  { name: 'Costa Rica', capital: 'San José', code: 'cr' },
  { name: 'Panama', capital: 'Panama City', code: 'pa' },
  { name: 'Cuba', capital: 'Havana', code: 'cu' },
  { name: 'Jamaica', capital: 'Kingston', code: 'jm' },
  { name: 'Haiti', capital: 'Port-au-Prince', code: 'ht' },
  { name: 'Dominican Republic', capital: 'Santo Domingo', code: 'do' },
  { name: 'Bahamas', capital: 'Nassau', code: 'bs' },
  { name: 'Barbados', capital: 'Bridgetown', code: 'bb' },
  { name: 'Trinidad and Tobago', capital: 'Port of Spain', code: 'tt' },

  // South America
  { name: 'Brazil', capital: 'Brasília', code: 'br' },
  { name: 'Argentina', capital: 'Buenos Aires', code: 'ar' },
  { name: 'Chile', capital: 'Santiago', code: 'cl' },
  { name: 'Peru', capital: 'Lima', code: 'pe' },
  { name: 'Colombia', capital: 'Bogotá', code: 'co' },
  { name: 'Venezuela', capital: 'Caracas', code: 've' },
  { name: 'Ecuador', capital: 'Quito', code: 'ec' },
  { name: 'Bolivia', capital: 'Sucre', code: 'bo' },
  { name: 'Paraguay', capital: 'Asunción', code: 'py' },
  { name: 'Uruguay', capital: 'Montevideo', code: 'uy' },
  { name: 'Guyana', capital: 'Georgetown', code: 'gy' },
  { name: 'Suriname', capital: 'Paramaribo', code: 'sr' },

  // Oceania
  { name: 'Australia', capital: 'Canberra', code: 'au' },
  { name: 'New Zealand', capital: 'Wellington', code: 'nz' },
  { name: 'Papua New Guinea', capital: 'Port Moresby', code: 'pg' },
  { name: 'Fiji', capital: 'Suva', code: 'fj' },
  { name: 'Solomon Islands', capital: 'Honiara', code: 'sb' },
  { name: 'Vanuatu', capital: 'Port Vila', code: 'vu' },
  { name: 'Samoa', capital: 'Apia', code: 'ws' },
  { name: 'Tonga', capital: 'Nuku\'alofa', code: 'to' },
  { name: 'Palau', capital: 'Ngerulmud', code: 'pw' },
  { name: 'Micronesia', capital: 'Palikir', code: 'fm' },
  { name: 'Marshall Islands', capital: 'Majuro', code: 'mh' },
  { name: 'Kiribati', capital: 'Tarawa', code: 'ki' },
  { name: 'Nauru', capital: 'Yaren', code: 'nr' },
  { name: 'Tuvalu', capital: 'Funafuti', code: 'tv' },

  // Additional challenging countries and territories
  { name: 'Vatican City', capital: 'Vatican City', code: 'va' },
  { name: 'San Marino', capital: 'San Marino', code: 'sm' },
  { name: 'Monaco', capital: 'Monaco', code: 'mc' },
  { name: 'Liechtenstein', capital: 'Vaduz', code: 'li' },
  { name: 'Andorra', capital: 'Andorra la Vella', code: 'ad' },
];

export default function GeographyQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [totalQuestions] = useState(15); // Increased from 10 to 15 for more challenge
  const [flagImageError, setFlagImageError] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const { data: logoUrl } = useFileUrl('assets/travel-butts-logo.png');

  const generateRandomOptions = (correctAnswer: string, type: 'flag' | 'capital'): string[] => {
    const options = [correctAnswer];
    const availableOptions = type === 'flag' 
      ? countries.map(c => c.name).filter(name => name !== correctAnswer)
      : countries.map(c => c.capital).filter(capital => capital !== correctAnswer);
    
    // Add 2 random wrong options
    while (options.length < 3) {
      const randomOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };

  const generateQuestion = (): Question => {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const questionType = Math.random() > 0.5 ? 'flag' : 'capital';
    
    if (questionType === 'flag') {
      return {
        type: 'flag',
        country: randomCountry,
        options: generateRandomOptions(randomCountry.name, 'flag'),
        correctAnswer: randomCountry.name
      };
    } else {
      return {
        type: 'capital',
        country: randomCountry,
        options: generateRandomOptions(randomCountry.capital, 'capital'),
        correctAnswer: randomCountry.capital
      };
    }
  };

  const startQuiz = () => {
    setCurrentQuestion(generateQuestion());
    setQuestionNumber(1);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setFlagImageError(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    // Auto-advance after 2.5 seconds (slightly longer for harder questions)
    setTimeout(() => {
      if (questionNumber >= totalQuestions) {
        setQuizCompleted(true);
      } else {
        setQuestionNumber(questionNumber + 1);
        setCurrentQuestion(generateQuestion());
        setSelectedAnswer(null);
        setShowResult(false);
        setFlagImageError(false);
      }
    }, 2500);
  };

  const shareResult = () => {
    const percentage = Math.round((score / totalQuestions) * 100);
    let emoji = '';
    
    if (percentage >= 90) {
      emoji = '🌟';
    } else if (percentage >= 80) {
      emoji = '🎉';
    } else if (percentage >= 70) {
      emoji = '👏';
    } else if (percentage >= 60) {
      emoji = '👍';
    } else if (percentage >= 50) {
      emoji = '🗺️';
    } else {
      emoji = '✈️';
    }

    const shareText = `I just scored ${score}/${totalQuestions} (${percentage}%) on the Travel Butts Geography Quiz! ${emoji}\n\nTest your world knowledge at ${window.location.origin}#geography-quiz`;

    if (navigator.share) {
      navigator.share({
        title: 'My Geography Quiz Result',
        text: shareText,
        url: `${window.location.origin}#geography-quiz`
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
    if (isGeneratingStory) return;
    
    setIsGeneratingStory(true);
    
    try {
      const storyImageUrl = await generateGeographyQuizStory(score, totalQuestions, logoUrl);
      const filename = `geography-quiz-result-${score}-${totalQuestions}.png`;
      
      downloadInstagramStory(storyImageUrl, filename);
      showToast('Instagram Story image downloaded! Upload it to your Instagram Story.', 'success');
    } catch (error) {
      console.error('Error generating Instagram Story:', error);
      showToast('Failed to generate Instagram Story image. Please try again.', 'error');
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const goHome = () => {
    window.location.hash = '';
    window.location.reload();
  };

  const getFlagImageUrl = (countryCode: string): string => {
    // Using HTTPS flagcdn.com as the primary source for flag images with higher resolution
    return `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
  };

  const handleFlagImageError = () => {
    setFlagImageError(true);
  };

  useEffect(() => {
    startQuiz();
  }, []);

  if (quizCompleted) {
    const percentage = Math.round((score / totalQuestions) * 100);
    let message = '';
    let emoji = '';
    
    if (percentage >= 90) {
      message = 'Outstanding! You\'re a true geography master!';
      emoji = '🌟';
    } else if (percentage >= 80) {
      message = 'Excellent! You have impressive world knowledge!';
      emoji = '🎉';
    } else if (percentage >= 70) {
      message = 'Great job! You know your geography well!';
      emoji = '👏';
    } else if (percentage >= 60) {
      message = 'Good effort! Keep exploring the world!';
      emoji = '👍';
    } else if (percentage >= 50) {
      message = 'Not bad! There\'s always more to discover!';
      emoji = '🗺️';
    } else {
      message = 'Time to plan more trips and learn about the world!';
      emoji = '✈️';
    }

    return (
      <div className="min-h-screen bg-neutral-light py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold text-secondary mb-4">Quiz Complete!</h1>
            
            <div className="text-6xl mb-4">{emoji}</div>
            
            <div className="bg-neutral-light rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-accent mb-2">
                {score}/{totalQuestions}
              </div>
              <div className="text-lg text-secondary-light">
                {percentage}% Correct
              </div>
            </div>
            
            <p className="text-lg text-secondary mb-8">{message}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={shareResult}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Your Result</span>
              </button>

              <button
                onClick={shareToInstagramStory}
                disabled={isGeneratingStory}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {isGeneratingStory ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Instagram className="w-5 h-5" />
                )}
                <span>{isGeneratingStory ? 'Generating...' : 'Share to Instagram Story'}</span>
              </button>
              
              <button
                onClick={startQuiz}
                className="flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={goHome}
                className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-secondary border border-neutral-light px-6 py-3 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-secondary-light">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-2xl mx-auto px-4">
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
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary">Geography Quiz Challenge</h1>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-secondary-light">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Question {questionNumber}/{totalQuestions}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Score: {score}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white rounded-full h-2 mb-8">
          <div 
            className="bg-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentQuestion.type === 'flag' ? (
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Flag className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-semibold text-secondary">Guess the Country</h2>
              </div>
              
              <div className="mb-6 flex justify-center">
                <div className="relative w-80 h-48 bg-gray-100 rounded-lg overflow-hidden shadow-md border border-neutral-light">
                  {!flagImageError ? (
                    <img
                      src={getFlagImageUrl(currentQuestion.country.code)}
                      alt={`Flag of ${currentQuestion.country.name}`}
                      className="w-full h-full object-cover"
                      onError={handleFlagImageError}
                      onLoad={() => setFlagImageError(false)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <Flag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Flag Image</p>
                        <p className="text-gray-400 text-xs">Loading...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-secondary-light mb-8">Which country does this flag represent?</p>
            </div>
          ) : (
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <MapPin className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-semibold text-secondary">What's the Capital?</h2>
              </div>
              
              <div className="text-4xl font-bold text-accent mb-6">
                {currentQuestion.country.name}
              </div>
              
              <p className="text-secondary-light mb-8">What is the capital city of this country?</p>
            </div>
          )}

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.options.map((option, index) => {
              let buttonClass = "w-full p-4 text-left border-2 rounded-xl transition-all duration-200 ";
              
              if (showResult) {
                if (option === currentQuestion.correctAnswer) {
                  buttonClass += "border-green-500 bg-green-50 text-green-800";
                } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                  buttonClass += "border-red-500 bg-red-50 text-red-800";
                } else {
                  buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                }
              } else {
                buttonClass += "border-neutral-light hover:border-accent hover:bg-accent hover:bg-opacity-5 text-secondary";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-left">{option}</span>
                    {showResult && (
                      <div>
                        {option === currentQuestion.correctAnswer ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : option === selectedAnswer ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result Feedback */}
          {showResult && (
            <div className="mt-6 p-4 rounded-xl text-center">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <div className="text-green-600">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Correct! Well done!</p>
                </div>
              ) : (
                <div className="text-red-600">
                  <XCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">
                    Incorrect. The correct answer is {currentQuestion.correctAnswer}.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
