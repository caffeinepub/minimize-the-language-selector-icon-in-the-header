import React, { useState } from 'react';
import { Shuffle, Home, Plane, Hotel, Calendar, MapPin, Users, DollarSign, ChevronLeft, ChevronRight, Star, Clock, Wifi, Car, Coffee, Utensils, Camera, RotateCcw } from 'lucide-react';
import { showToast } from '../utils/toast';

interface FlightData {
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  destinationImage: string;
  destination: string;
}

interface HotelData {
  name: string;
  starRating: number;
  distanceFromAirport: string;
  amenities: string[];
  pricePerNight: number;
  nights: number;
  totalPrice: number;
  images: string[];
}

interface TripData {
  flight: FlightData;
  hotel: HotelData;
  totalPrice: number;
  highlights: string[];
}

// Mock destination images
const destinationImages = [
  'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=800&h=600&fit=crop'
];

// Mock hotel images
const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop'
];

// Mock data for demo purposes - structured for easy API integration
const mockFlights: Omit<FlightData, 'destinationImage' | 'destination'>[] = [
  {
    airline: 'SkyWings Airlines',
    flightNumber: 'SW 1234',
    departureAirport: 'JFK',
    arrivalAirport: 'CDG',
    departureTime: '14:30',
    arrivalTime: '03:45+1',
    duration: '7h 15m',
    price: 650
  },
  {
    airline: 'Global Airways',
    flightNumber: 'GA 5678',
    departureAirport: 'LAX',
    arrivalAirport: 'NRT',
    departureTime: '11:20',
    arrivalTime: '15:40+1',
    duration: '11h 20m',
    price: 890
  },
  {
    airline: 'Euro Express',
    flightNumber: 'EE 9012',
    departureAirport: 'LHR',
    arrivalAirport: 'FCO',
    departureTime: '09:15',
    arrivalTime: '12:30',
    duration: '2h 15m',
    price: 320
  },
  {
    airline: 'Pacific Air',
    flightNumber: 'PA 3456',
    departureAirport: 'SFO',
    arrivalAirport: 'SYD',
    departureTime: '22:45',
    arrivalTime: '06:30+2',
    duration: '15h 45m',
    price: 1200
  },
  {
    airline: 'Nordic Wings',
    flightNumber: 'NW 7890',
    departureAirport: 'CPH',
    arrivalAirport: 'ARN',
    departureTime: '16:00',
    arrivalTime: '17:15',
    duration: '1h 15m',
    price: 180
  }
];

const destinations = [
  { name: 'Paris, France', highlights: ['Iconic Eiffel Tower and romantic atmosphere', 'World-class museums like the Louvre', 'Charming cafés and exquisite cuisine', 'Beautiful architecture and historic landmarks'] },
  { name: 'Tokyo, Japan', highlights: ['Vibrant blend of traditional and modern culture', 'Incredible sushi and ramen experiences', 'Cherry blossoms and beautiful gardens', 'Unique shopping and entertainment districts'] },
  { name: 'Rome, Italy', highlights: ['Ancient history with the Colosseum and Roman Forum', 'Vatican City and stunning art', 'Delicious pasta and gelato', 'Charming cobblestone streets and piazzas'] },
  { name: 'Sydney, Australia', highlights: ['Iconic Opera House and Harbour Bridge', 'Beautiful beaches like Bondi and Manly', 'Great Barrier Reef nearby', 'Friendly locals and outdoor lifestyle'] },
  { name: 'Stockholm, Sweden', highlights: ['Stunning archipelago with thousands of islands', 'Rich Viking history and museums', 'Beautiful old town (Gamla Stan)', 'Northern lights viewing opportunities'] }
];

const mockHotels: Omit<HotelData, 'nights' | 'totalPrice' | 'images'>[] = [
  {
    name: 'Grand Palace Hotel',
    starRating: 5,
    distanceFromAirport: '12 km',
    amenities: ['Free WiFi', 'Spa', 'Pool', 'Restaurant', 'Gym'],
    pricePerNight: 280
  },
  {
    name: 'City Center Inn',
    starRating: 4,
    distanceFromAirport: '8 km',
    amenities: ['Free WiFi', 'Restaurant', 'Bar', 'Parking'],
    pricePerNight: 150
  },
  {
    name: 'Airport Lodge',
    starRating: 3,
    distanceFromAirport: '2 km',
    amenities: ['Free WiFi', 'Shuttle', 'Restaurant'],
    pricePerNight: 95
  },
  {
    name: 'Luxury Resort & Spa',
    starRating: 5,
    distanceFromAirport: '25 km',
    amenities: ['Free WiFi', 'Spa', 'Pool', 'Beach Access', 'Multiple Restaurants', 'Gym', 'Golf'],
    pricePerNight: 450
  },
  {
    name: 'Boutique Downtown Hotel',
    starRating: 4,
    distanceFromAirport: '15 km',
    amenities: ['Free WiFi', 'Rooftop Bar', 'Restaurant', 'Concierge'],
    pricePerNight: 220
  },
  {
    name: 'Cozy Garden Hotel',
    starRating: 3,
    distanceFromAirport: '10 km',
    amenities: ['Free WiFi', 'Garden', 'Restaurant', 'Pet Friendly'],
    pricePerNight: 120
  },
  {
    name: 'Business Executive Hotel',
    starRating: 4,
    distanceFromAirport: '6 km',
    amenities: ['Free WiFi', 'Business Center', 'Restaurant', 'Meeting Rooms'],
    pricePerNight: 180
  },
  {
    name: 'Historic Charm Inn',
    starRating: 3,
    distanceFromAirport: '18 km',
    amenities: ['Free WiFi', 'Historic Building', 'Restaurant', 'Library'],
    pricePerNight: 140
  },
  {
    name: 'Modern Suites Hotel',
    starRating: 4,
    distanceFromAirport: '14 km',
    amenities: ['Free WiFi', 'Kitchenette', 'Pool', 'Gym', 'Restaurant'],
    pricePerNight: 200
  },
  {
    name: 'Riverside Retreat',
    starRating: 4,
    distanceFromAirport: '20 km',
    amenities: ['Free WiFi', 'River View', 'Restaurant', 'Spa', 'Boat Tours'],
    pricePerNight: 250
  }
];

export default function TripRandomizer() {
  const [formData, setFormData] = useState({
    travelDate: '',
    duration: '3',
    departureLocation: '',
    budget: '',
    travelers: '1'
  });
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingHotel, setIsGeneratingHotel] = useState(false);
  const [currentHotelImageIndex, setCurrentHotelImageIndex] = useState(0);

  const goHome = () => {
    window.location.hash = '';
    window.location.reload();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateRandomHotel = (budget: number, flightPrice: number, duration: number): HotelData | null => {
    // Filter hotels that fit within budget considering duration
    const maxHotelBudget = (budget - flightPrice) / duration;
    const affordableHotels = mockHotels.filter(hotel => hotel.pricePerNight <= maxHotelBudget);

    if (affordableHotels.length === 0) {
      return null;
    }

    // Select random hotel
    const randomHotel = affordableHotels[Math.floor(Math.random() * affordableHotels.length)];
    
    // Create hotel with duration-based pricing and images
    return {
      ...randomHotel,
      nights: duration,
      totalPrice: randomHotel.pricePerNight * duration,
      images: hotelImages.slice(0, 4) // Use first 4 images for gallery
    };
  };

  const generateRandomTrip = () => {
    if (!formData.travelDate || !formData.duration || !formData.departureLocation || !formData.budget || !formData.travelers) {
      showToast('Please fill in all fields to generate your trip', 'warning');
      return;
    }

    const budget = parseFloat(formData.budget);
    const duration = parseInt(formData.duration);
    
    if (budget < 200) {
      showToast('Please enter a budget of at least $200 for a meaningful trip', 'warning');
      return;
    }

    if (duration < 1) {
      showToast('Please enter a trip duration of at least 1 day', 'warning');
      return;
    }

    setIsGenerating(true);

    // Simulate API call delay
    setTimeout(() => {
      // Select random flight and destination
      const randomFlightIndex = Math.floor(Math.random() * mockFlights.length);
      const randomFlight = mockFlights[randomFlightIndex];
      const randomDestination = destinations[randomFlightIndex];
      const randomDestinationImage = destinationImages[randomFlightIndex];

      // Create flight with destination info
      const flightWithDestination: FlightData = {
        ...randomFlight,
        destination: randomDestination.name,
        destinationImage: randomDestinationImage
      };

      const hotelWithDuration = generateRandomHotel(budget, randomFlight.price, duration);

      if (!hotelWithDuration) {
        showToast('No trips found within your budget. Try increasing your budget or reducing trip duration.', 'error');
        setIsGenerating(false);
        return;
      }

      // Calculate total price
      const totalPrice = flightWithDestination.price + hotelWithDuration.totalPrice;

      // Ensure total is within budget
      if (totalPrice <= budget) {
        setTripData({
          flight: flightWithDestination,
          hotel: hotelWithDuration,
          totalPrice,
          highlights: randomDestination.highlights
        });
        setCurrentHotelImageIndex(0);
        showToast('Your random trip has been generated! Explore your destination.', 'success');
      } else {
        // Fallback: try again with different selections
        generateRandomTrip();
        return;
      }

      setIsGenerating(false);
    }, 1500);
  };

  const generateNewHotel = () => {
    if (!tripData) return;

    const budget = parseFloat(formData.budget);
    const duration = parseInt(formData.duration);

    setIsGeneratingHotel(true);

    // Simulate API call delay
    setTimeout(() => {
      const newHotel = generateRandomHotel(budget, tripData.flight.price, duration);

      if (!newHotel) {
        showToast('No other hotels found within your budget for this destination.', 'warning');
        setIsGeneratingHotel(false);
        return;
      }

      // Calculate new total price
      const newTotalPrice = tripData.flight.price + newHotel.totalPrice;

      // Ensure new total is within budget
      if (newTotalPrice <= budget) {
        setTripData({
          ...tripData,
          hotel: newHotel,
          totalPrice: newTotalPrice
        });
        setCurrentHotelImageIndex(0);
        showToast('New hotel found! Check out your updated accommodation.', 'success');
      } else {
        showToast('No other hotels found within your budget for this destination.', 'warning');
      }

      setIsGeneratingHotel(false);
    }, 1000);
  };

  const nextHotelImage = () => {
    if (tripData && tripData.hotel.images.length > 0) {
      setCurrentHotelImageIndex((prev) => 
        prev === tripData.hotel.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevHotelImage = () => {
    if (tripData && tripData.hotel.images.length > 0) {
      setCurrentHotelImageIndex((prev) => 
        prev === 0 ? tripData.hotel.images.length - 1 : prev - 1
      );
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'restaurant':
      case 'multiple restaurants':
        return <Utensils className="w-4 h-4" />;
      case 'bar':
      case 'rooftop bar':
        return <Coffee className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
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
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary font-gotham">Trip Randomizer</h1>
          </div>
          
          <p className="text-lg text-secondary-light mb-6">
            Let us surprise you with your next perfect destination based on your preferences
          </p>
        </div>

        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-secondary mb-6 font-gotham">Tell us your preferences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <label htmlFor="duration" className="block text-sm font-medium text-secondary mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Trip Duration (Days)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="3"
                min="1"
                max="30"
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
              <label htmlFor="budget" className="block text-sm font-medium text-secondary mb-2">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Budget (USD)
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="1000"
                min="200"
                required
              />
            </div>

            <div>
              <label htmlFor="travelers" className="block text-sm font-medium text-secondary mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Number of Travelers
              </label>
              <select
                id="travelers"
                name="travelers"
                value={formData.travelers}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                required
              >
                <option value="1">1 Traveler</option>
                <option value="2">2 Travelers</option>
                <option value="3">3 Travelers</option>
                <option value="4">4 Travelers</option>
                <option value="5">5+ Travelers</option>
              </select>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={generateRandomTrip}
              disabled={isGenerating}
              className="bg-accent hover:bg-accent-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {isGenerating ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Shuffle className="w-5 h-5" />
              )}
              <span>{isGenerating ? 'Generating...' : 'Generate Random Trip'}</span>
            </button>
          </div>
        </div>

        {/* Trip Results */}
        {tripData && (
          <div className="space-y-6">
            {/* Side-by-side Tiles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Flight Tile (Left) */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={tripData.flight.destinationImage}
                    alt={tripData.flight.destination}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-secondary">Roundtrip Flight</span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{tripData.flight.destination}</h3>
                    <p className="text-white text-opacity-90 text-sm">Your amazing destination awaits</p>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-light rounded-lg">
                    <div>
                      <p className="font-semibold text-secondary">{tripData.flight.airline}</p>
                      <p className="text-sm text-secondary-light">{tripData.flight.flightNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">${tripData.flight.price}</p>
                      <p className="text-sm text-secondary-light">per person</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 border border-neutral-light rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-secondary-light" />
                        <span className="text-sm font-medium text-secondary">Departure</span>
                      </div>
                      <p className="font-semibold text-secondary">{tripData.flight.departureAirport}</p>
                      <p className="text-sm text-secondary-light">{tripData.flight.departureTime}</p>
                    </div>

                    <div className="p-3 border border-neutral-light rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-secondary-light" />
                        <span className="text-sm font-medium text-secondary">Arrival</span>
                      </div>
                      <p className="font-semibold text-secondary">{tripData.flight.arrivalAirport}</p>
                      <p className="text-sm text-secondary-light">{tripData.flight.arrivalTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-secondary-light mr-2" />
                    <span className="text-sm text-secondary">Flight Duration: {tripData.flight.duration}</span>
                  </div>
                </div>
              </div>

              {/* Hotel Tile (Right) */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <div className="relative w-full h-full">
                    <img
                      src={tripData.hotel.images[currentHotelImageIndex]}
                      alt={`${tripData.hotel.name} - Image ${currentHotelImageIndex + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    
                    {/* Image Gallery Navigation */}
                    {tripData.hotel.images.length > 1 && (
                      <>
                        <button
                          onClick={prevHotelImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextHotelImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {tripData.hotel.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentHotelImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentHotelImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="absolute top-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Hotel className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-secondary">Hotel Stay</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-2">
                    <div className="flex items-center space-x-1">
                      <Camera className="w-4 h-4 text-secondary-light" />
                      <span className="text-xs text-secondary">{currentHotelImageIndex + 1}/{tripData.hotel.images.length}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-light rounded-lg">
                    <div>
                      <p className="font-semibold text-secondary">{tripData.hotel.name}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {renderStars(tripData.hotel.starRating)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">${tripData.hotel.totalPrice}</p>
                      <p className="text-sm text-secondary-light">{tripData.hotel.nights} nights</p>
                    </div>
                  </div>

                  <div className="p-3 border border-neutral-light rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-secondary-light" />
                      <span className="text-sm font-medium text-secondary">Distance from Airport</span>
                    </div>
                    <p className="text-secondary">{tripData.hotel.distanceFromAirport}</p>
                  </div>

                  <div className="p-3 border border-neutral-light rounded-lg">
                    <h4 className="text-sm font-medium text-secondary mb-3">Hotel Amenities</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {tripData.hotel.amenities.slice(0, 6).map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-secondary-light">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Find Another Hotel Button */}
                  <button
                    onClick={generateNewHotel}
                    disabled={isGeneratingHotel}
                    className="w-full bg-secondary hover:bg-secondary text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isGeneratingHotel ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                    <span>{isGeneratingHotel ? 'Finding...' : 'Find Another Hotel'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-secondary mb-2 font-gotham">Total Trip Cost</h3>
                <div className="text-3xl font-bold text-accent mb-2">${tripData.totalPrice}</div>
                <p className="text-secondary-light text-sm mb-4">
                  Within your budget of ${formData.budget} • Savings: ${parseFloat(formData.budget) - tripData.totalPrice} • {formData.duration} days
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-neutral-light rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Plane className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-secondary">Flight</span>
                    </div>
                    <p className="text-accent font-semibold">${tripData.flight.price}</p>
                  </div>
                  
                  <div className="p-3 bg-neutral-light rounded-lg">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <Hotel className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-secondary">Hotel ({tripData.hotel.nights} nights)</span>
                    </div>
                    <p className="text-accent font-semibold">${tripData.hotel.totalPrice}</p>
                  </div>
                </div>

                <button
                  onClick={generateRandomTrip}
                  className="mt-6 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Generate Another Trip</span>
                </button>
              </div>
            </div>

            {/* Destination Highlights */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-secondary mb-2 font-gotham">
                  Why {tripData.flight.destination} is Amazing
                </h3>
                <p className="text-secondary-light">
                  Discover what makes this destination special
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tripData.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-neutral-light rounded-lg">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-secondary text-sm leading-relaxed">{highlight}</p>
                  </div>
                ))}
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
                    This is a fully functional demo with mock data and destination images. The interface is structured and documented for easy integration with real travel and hotel APIs. 
                    All components are ready for backend integration with services like Amadeus, Booking.com, or Expedia APIs. Trip duration is factored into hotel pricing calculations, 
                    and you can now generate new hotels for the same destination while keeping flight details unchanged.
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
