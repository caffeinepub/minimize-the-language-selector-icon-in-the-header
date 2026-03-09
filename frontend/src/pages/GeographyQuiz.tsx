import React, { useState, useEffect } from 'react';
import { MapPin, Flag, RotateCcw, Home, Trophy, Target, Share2, Instagram } from 'lucide-react';
import { useFileUrl } from '../blob-storage/FileStorage';
import { generateGeographyQuizStory, downloadInstagramStory } from '../utils/instagramStoryGenerator';
import { showToast } from '../utils/toast';
import { QuizPage } from '../components/quiz/QuizPage';
import { QuizCard } from '../components/quiz/QuizCard';
import { QuizProgress } from '../components/quiz/QuizProgress';
import { QuizOptionButton } from '../components/quiz/QuizOptionButton';
import { QuizActionButton } from '../components/quiz/QuizActionButton';

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
  const [totalQuestions] = useState(15);
  const [flagImageError, setFlagImageError] = useState(false);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);
  const { data: logoUrl } = useFileUrl('assets/travel-butts-logo.png');

  const generateRandomOptions = (correctAnswer: string, type: 'flag' | 'capital'): string[] => {
    const options = [correctAnswer];
    const availableOptions = type === 'flag' 
      ? countries.map(c => c.name).filter(name => name !== correctAnswer)
      : countries.map(c => c.capital).filter(capital => capital !== correctAnswer);
    
    while (options.length < 3) {
      const randomOption = availableOptions[Math.floor(Math.random() * availableOptions.length)];
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    
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
    setQuestionKey(0);
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || !currentQuestion) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (questionNumber >= totalQuestions) {
        setQuizCompleted(true);
      } else {
        setQuestionNumber(questionNumber + 1);
        setCurrentQuestion(generateQuestion());
        setSelectedAnswer(null);
        setShowResult(false);
        setFlagImageError(false);
        setQuestionKey(prev => prev + 1);
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
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('Quiz result copied to clipboard! You can now paste it anywhere to share.', 'success');
      }).catch(() => {
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
      <QuizPage variant="brand">
        <QuizCard variant="white" animated className="text-center">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-secondary mb-4 animate-fade-in-up">Quiz Complete!</h1>
          
          <div className="text-6xl mb-4 animate-pulse">{emoji}</div>
          
          <div className="bg-neutral-light rounded-xl p-6 mb-6 animate-fade-in-up">
            <div className="text-4xl font-bold text-accent mb-2">
              {score}/{totalQuestions}
            </div>
            <div className="text-lg text-secondary-light">
              {percentage}% Correct
            </div>
          </div>
          
          <p className="text-lg text-secondary mb-8 animate-fade-in-up">{message}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <QuizActionButton
              onClick={shareResult}
              icon={Share2}
              text="Share Your Result"
              variant="brand-primary"
            />

            <QuizActionButton
              onClick={shareToInstagramStory}
              icon={Instagram}
              text={isGeneratingStory ? "Generating..." : "Instagram Story"}
              variant="gradient"
              disabled={isGeneratingStory}
            />

            <QuizActionButton
              onClick={startQuiz}
              icon={RotateCcw}
              text="Try Again"
              variant="brand-secondary"
            />

            <QuizActionButton
              onClick={goHome}
              icon={Home}
              text="Home"
              variant="brand-secondary"
            />
          </div>
        </QuizCard>
      </QuizPage>
    );
  }

  if (!currentQuestion) {
    return (
      <QuizPage variant="brand">
        <QuizCard variant="white" animated>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <p className="text-secondary">Loading quiz...</p>
          </div>
        </QuizCard>
      </QuizPage>
    );
  }

  return (
    <QuizPage variant="brand">
      <div key={questionKey}>
        <QuizCard variant="white" animated>
          <div className="flex items-center justify-between mb-6 animate-fade-in-up">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                {currentQuestion.type === 'flag' ? (
                  <Flag className="w-5 h-5 text-white" />
                ) : (
                  <MapPin className="w-5 h-5 text-white" />
                )}
              </div>
              <h2 className="text-xl font-bold text-secondary">Geography Quiz</h2>
            </div>
            <div className="flex items-center space-x-2 text-accent">
              <Target className="w-5 h-5" />
              <span className="font-bold">{score}/{questionNumber - 1}</span>
            </div>
          </div>

          <QuizProgress 
            current={questionNumber} 
            total={totalQuestions}
            variant="brand"
            animated
          />

          <div className="mb-8 animate-fade-in-up">
            {currentQuestion.type === 'flag' ? (
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-6 text-center">
                  Which country does this flag belong to?
                </h3>
                <div className="flex justify-center mb-8">
                  {!flagImageError ? (
                    <img
                      src={getFlagImageUrl(currentQuestion.country.code)}
                      alt="Country flag"
                      className="w-64 h-40 object-contain border-2 border-neutral rounded-lg shadow-md"
                      onError={handleFlagImageError}
                    />
                  ) : (
                    <div className="w-64 h-40 bg-neutral-light border-2 border-neutral rounded-lg shadow-md flex items-center justify-center">
                      <Flag className="w-16 h-16 text-accent" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-6 text-center">
                  What is the capital of {currentQuestion.country.name}?
                </h3>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <QuizOptionButton
                key={index}
                text={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={!!selectedAnswer}
                isSelected={selectedAnswer === option}
                isCorrect={showResult && option === currentQuestion.correctAnswer}
                isIncorrect={showResult && selectedAnswer === option && option !== currentQuestion.correctAnswer}
                showFeedback={showResult}
                variant="brand"
                animated
              />
            ))}
          </div>

          {showResult && (
            <div className="mt-6 p-4 bg-neutral-light rounded-lg text-center animate-fade-in-up">
              {selectedAnswer === currentQuestion.correctAnswer ? (
                <p className="text-accent font-semibold">
                  ✓ Correct! {currentQuestion.type === 'flag' 
                    ? `This is the flag of ${currentQuestion.country.name}.` 
                    : `The capital of ${currentQuestion.country.name} is ${currentQuestion.country.capital}.`}
                </p>
              ) : (
                <p className="text-red-600 font-semibold">
                  ✗ Incorrect. {currentQuestion.type === 'flag' 
                    ? `This is the flag of ${currentQuestion.country.name}.` 
                    : `The capital of ${currentQuestion.country.name} is ${currentQuestion.country.capital}.`}
                </p>
              )}
            </div>
          )}
        </QuizCard>
      </div>
    </QuizPage>
  );
}
