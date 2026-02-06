import React, { useState } from 'react';
import { Train, Plane, Home, Calendar, MapPin, Clock, DollarSign, Shuffle, ArrowRight } from 'lucide-react';
import { showToast } from '../utils/toast';

interface FlightOption {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  airlineImage: string;
}

interface TrainOption {
  trainCompany: string;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  trainCompanyImage: string;
}

interface ComparisonData {
  flight: FlightOption;
  train: TrainOption;
  savings: number;
  fasterOption: 'flight' | 'train';
  timeDifference: string;
}

// Mock airline images
const airlineImages = [
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1583604748347-f8b9d4e0b2b1?w=200&h=100&fit=crop'
];

// Mock train company images
const trainCompanyImages = [
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=200&h=100&fit=crop',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=200&h=100&fit=crop'
];

// Mock flight data
const mockFlights: FlightOption[] = [
  {
    airline: 'SkyWings Airlines',
    flightNumber: 'SW 1234',
    departureAirport: 'JFK',
    arrivalAirport: 'CDG',
    departureTime: '14:30',
    arrivalTime: '03:45+1',
    duration: '7h 15m',
    price: 650,
    airlineImage: airlineImages[0]
  },
  {
    airline: 'Global Airways',
    flightNumber: 'GA 5678',
    departureAirport: 'LAX',
    arrivalAirport: 'NRT',
    departureTime: '11:20',
    arrivalTime: '15:40+1',
    duration: '11h 20m',
    price: 890,
    airlineImage: airlineImages[1]
  },
  {
    airline: 'Euro Express',
    flightNumber: 'EE 9012',
    departureAirport: 'LHR',
    arrivalAirport: 'FCO',
    departureTime: '09:15',
    arrivalTime: '12:30',
    duration: '2h 15m',
    price: 320,
    airlineImage: airlineImages[2]
  },
  {
    airline: 'Pacific Air',
    flightNumber: 'PA 3456',
    departureAirport: 'SFO',
    arrivalAirport: 'SYD',
    departureTime: '22:45',
    arrivalTime: '06:30+2',
    duration: '15h 45m',
    price: 1200,
    airlineImage: airlineImages[3]
  },
  {
    airline: 'Nordic Wings',
    flightNumber: 'NW 7890',
    departureAirport: 'CPH',
    arrivalAirport: 'ARN',
    departureTime: '16:00',
    arrivalTime: '17:15',
    duration: '1h 15m',
    price: 180,
    airlineImage: airlineImages[4]
  }
];

// Mock train data
const mockTrains: TrainOption[] = [
  {
    trainCompany: 'EuroRail Express',
    trainNumber: 'ER 4567',
    departureStation: 'London St Pancras',
    arrivalStation: 'Paris Gare du Nord',
    departureTime: '13:31',
    arrivalTime: '16:47',
    duration: '3h 16m',
    price: 180,
    trainCompanyImage: trainCompanyImages[0]
  },
  {
    trainCompany: 'High Speed Rail',
    trainNumber: 'HSR 8901',
    departureStation: 'Tokyo Station',
    arrivalStation: 'Osaka Station',
    departureTime: '08:00',
    arrivalTime: '10:45',
    duration: '2h 45m',
    price: 120,
    trainCompanyImage: trainCompanyImages[1]
  },
  {
    trainCompany: 'Continental Express',
    trainNumber: 'CE 2345',
    departureStation: 'Berlin Hauptbahnhof',
    arrivalStation: 'Rome Termini',
    departureTime: '07:30',
    arrivalTime: '19:45',
    duration: '12h 15m',
    price: 280,
    trainCompanyImage: trainCompanyImages[2]
  },
  {
    trainCompany: 'Intercity Rail',
    trainNumber: 'IC 6789',
    departureStation: 'New York Penn',
    arrivalStation: 'Washington Union',
    departureTime: '14:15',
    arrivalTime: '17:30',
    duration: '3h 15m',
    price: 95,
    trainCompanyImage: trainCompanyImages[3]
  },
  {
    trainCompany: 'Nordic Rail',
    trainNumber: 'NR 1234',
    departureStation: 'Copenhagen Central',
    arrivalStation: 'Stockholm Central',
    departureTime: '10:20',
    arrivalTime: '15:35',
    duration: '5h 15m',
    price: 85,
    trainCompanyImage: trainCompanyImages[4]
  }
];

export default function TrainVsFlightPrices() {
  const [formData, setFormData] = useState({
    travelDate: '',
    departureLocation: '',
    destination: ''
  });
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const goHome = () => {
    window.location.hash = '';
    window.location.reload();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTimeDifference = (flightDuration: string, trainDuration: string): { fasterOption: 'flight' | 'train', timeDifference: string } => {
    // Convert duration strings to minutes for comparison
    const parseTime = (duration: string): number => {
      const hours = parseInt(duration.match(/(\d+)h/)?.[1] || '0');
      const minutes = parseInt(duration.match(/(\d+)m/)?.[1] || '0');
      return hours * 60 + minutes;
    };

    const flightMinutes = parseTime(flightDuration);
    const trainMinutes = parseTime(trainDuration);
    
    const difference = Math.abs(flightMinutes - trainMinutes);
    const diffHours = Math.floor(difference / 60);
    const diffMins = difference % 60;
    
    const timeDifference = diffHours > 0 ? `${diffHours}h ${diffMins}m` : `${diffMins}m`;
    
    return {
      fasterOption: flightMinutes < trainMinutes ? 'flight' : 'train',
      timeDifference
    };
  };

  const generateComparison = () => {
    if (!formData.travelDate || !formData.departureLocation || !formData.destination) {
      showToast('Please fill in all fields to compare prices', 'warning');
      return;
    }

    setIsGenerating(true);

    // Simulate API call delay
    setTimeout(() => {
      // Select random flight and train options
      const randomFlight = mockFlights[Math.floor(Math.random() * mockFlights.length)];
      const randomTrain = mockTrains[Math.floor(Math.random() * mockTrains.length)];

      // Calculate savings and time difference
      const savings = Math.abs(randomFlight.price - randomTrain.price);
      const { fasterOption, timeDifference } = calculateTimeDifference(randomFlight.duration, randomTrain.duration);

      setComparisonData({
        flight: randomFlight,
        train: randomTrain,
        savings,
        fasterOption,
        timeDifference
      });

      showToast('Price comparison generated! Check out your options below.', 'success');
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-6xl mx-auto px-4">
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
              <Train className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary font-gotham">Train vs Flight Prices</h1>
          </div>
          
          <p className="text-lg text-secondary-light mb-6">
            Compare costs and travel times between train and flight options for your journey
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-secondary mb-6 font-gotham">Enter your travel details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="travelDate" className="block text-sm font-medium text-secondary mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Travel Date
              </label>
              <input
                type="date"
                id="travelDate"
                name="travelDate"
                value={formData.travelDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="departureLocation" className="block text-sm font-medium text-secondary mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Departure Location
              </label>
              <input
                type="text"
                id="departureLocation"
                name="departureLocation"
                value={formData.departureLocation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="e.g., New York, London"
                required
              />
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-secondary mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Travel Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="e.g., Paris, Tokyo"
                required
              />
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={generateComparison}
              disabled={isGenerating}
              className="bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Shuffle className="w-5 h-5" />
              )}
              <span>{isGenerating ? 'Comparing...' : 'Compare Prices'}</span>
            </button>
          </div>
        </div>

        {/* Comparison Results */}
        {comparisonData && (
          <div className="space-y-6">
            {/* Side-by-side Comparison Tiles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Flight Tile (Left) */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600">
                  <img
                    src={comparisonData.flight.airlineImage}
                    alt={comparisonData.flight.airline}
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-60"></div>
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-secondary">Flight Option</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{comparisonData.flight.airline}</h3>
                    <p className="text-white text-opacity-90 text-sm">{comparisonData.flight.flightNumber}</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-secondary">Flight Price</p>
                      <p className="text-sm text-secondary-light">Per person</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">${comparisonData.flight.price}</p>
                      {comparisonData.flight.price < comparisonData.train.price && (
                        <p className="text-sm text-green-600 font-medium">
                          ${comparisonData.savings} cheaper
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-neutral-light rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-secondary-light" />
                        <span className="text-sm font-medium text-secondary">Departure</span>
                      </div>
                      <p className="font-semibold text-secondary">{comparisonData.flight.departureAirport}</p>
                      <p className="text-sm text-secondary-light">{comparisonData.flight.departureTime}</p>
                    </div>

                    <div className="p-3 border border-neutral-light rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-secondary-light" />
                        <span className="text-sm font-medium text-secondary">Arrival</span>
                      </div>
                      <p className="font-semibold text-secondary">{comparisonData.flight.arrivalAirport}</p>
                      <p className="text-sm text-secondary-light">{comparisonData.flight.arrivalTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-secondary-light mr-2" />
                    <span className="text-sm text-secondary">Duration: {comparisonData.flight.duration}</span>
                    {comparisonData.fasterOption === 'flight' && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {comparisonData.timeDifference} faster
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Train Tile (Right) */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-green-500 to-green-600">
                  <img
                    src={comparisonData.train.trainCompanyImage}
                    alt={comparisonData.train.trainCompany}
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 bg-green-600 bg-opacity-60"></div>
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Train className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-secondary">Train Option</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{comparisonData.train.trainCompany}</h3>
                    <p className="text-white text-opacity-90 text-sm">{comparisonData.train.trainNumber}</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-secondary">Train Price</p>
                      <p className="text-sm text-secondary-light">Per person</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${comparisonData.train.price}</p>
                      {comparisonData.train.price < comparisonData.flight.price && (
                        <p className="text-sm text-green-600 font-medium">
                          ${comparisonData.savings} cheaper
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-neutral-light rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-secondary-light" />
                        <span className="text-sm font-medium text-secondary">Departure</span>
                      </div>
                      <p className="font-semibold text-secondary">{comparisonData.train.departureStation}</p>
                      <p className="text-sm text-secondary-light">{comparisonData.train.departureTime}</p>
                    </div>

                    <div className="p-3 border border-neutral-light rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-secondary-light" />
                        <span className="text-sm font-medium text-secondary">Arrival</span>
                      </div>
                      <p className="font-semibold text-secondary">{comparisonData.train.arrivalStation}</p>
                      <p className="text-sm text-secondary-light">{comparisonData.train.arrivalTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-secondary-light mr-2" />
                    <span className="text-sm text-secondary">Duration: {comparisonData.train.duration}</span>
                    {comparisonData.fasterOption === 'train' && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        {comparisonData.timeDifference} faster
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Comparison */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-secondary mb-2 font-gotham">
                  Comparison Summary
                </h3>
                <p className="text-secondary-light">
                  Here's how your options stack up
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Price Winner */}
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-secondary mb-1">Best Price</h4>
                  <p className="text-green-600 font-bold text-lg">
                    {comparisonData.flight.price < comparisonData.train.price ? 'Flight' : 'Train'}
                  </p>
                  <p className="text-sm text-secondary-light">
                    Save ${comparisonData.savings}
                  </p>
                </div>

                {/* Speed Winner */}
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-secondary mb-1">Fastest Option</h4>
                  <p className="text-blue-600 font-bold text-lg capitalize">
                    {comparisonData.fasterOption}
                  </p>
                  <p className="text-sm text-secondary-light">
                    {comparisonData.timeDifference} faster
                  </p>
                </div>

                {/* Environmental Impact */}
                <div className="text-center p-4 bg-neutral-light rounded-lg border border-neutral-light">
                  <Train className="w-8 h-8 text-accent mx-auto mb-2" />
                  <h4 className="font-semibold text-secondary mb-1">Eco-Friendly</h4>
                  <p className="text-accent font-bold text-lg">Train</p>
                  <p className="text-sm text-secondary-light">
                    Lower carbon footprint
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={generateComparison}
                  className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Compare Different Routes</span>
                </button>
              </div>
            </div>

            {/* Travel Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-secondary mb-2 font-gotham">
                  Travel Tips & Considerations
                </h3>
                <p className="text-secondary-light">
                  Make the best choice for your journey
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Flight Benefits */}
                <div className="p-4 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Plane className="w-4 h-4 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-secondary">Flight Benefits</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-secondary-light">
                    <li className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-blue-600 flex-shrink-0" />
                      <span>Fastest travel time for long distances</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-blue-600 flex-shrink-0" />
                      <span>More frequent departure times</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-blue-600 flex-shrink-0" />
                      <span>Access to remote destinations</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-blue-600 flex-shrink-0" />
                      <span>Loyalty program benefits</span>
                    </li>
                  </ul>
                </div>

                {/* Train Benefits */}
                <div className="p-4 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Train className="w-4 h-4 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-secondary">Train Benefits</h4>
                  </div>
                  <ul className="space-y-2 text-sm text-secondary-light">
                    <li className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-green-600 flex-shrink-0" />
                      <span>City center to city center travel</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-green-600 flex-shrink-0" />
                      <span>More comfortable seating and space</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-green-600 flex-shrink-0" />
                      <span>No baggage restrictions or security lines</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-green-600 flex-shrink-0" />
                      <span>Scenic views during the journey</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* API Integration Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div>
                  <h5 className="font-medium text-blue-900 mb-2">Demo Mode</h5>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    This is a fully functional demo with mock data for flights and trains. The interface is structured and documented for easy integration with real travel APIs. 
                    All components are ready for backend integration with services like Amadeus for flights, Trainline for trains, or other transportation booking APIs. 
                    The comparison logic, pricing calculations, and time difference analysis are all implemented and ready for real data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
