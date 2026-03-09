import React, { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useIsAdmin, useGetCallerUserProfile } from './hooks/useQueries';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import GeographyQuiz from './pages/GeographyQuiz';
import TravelStyleQuiz from './pages/TravelStyleQuiz';
import PackingList from './pages/PackingList';
import TripRandomizer from './pages/TripRandomizer';
import TrainVsFlightPrices from './pages/TrainVsFlightPrices';
import ShopPage from './pages/ShopPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import ProfileSetupModal from './components/ProfileSetupModal';

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const [currentBlogId, setCurrentBlogId] = useState<string | null>(null);
  const { t } = useLanguage();

  const isAuthenticated = !!identity;

  // Check current route
  const currentHash = window.location.hash;
  const showAdminDashboard = currentHash === '#admin' && isAdmin && isAuthenticated;
  const showGeographyQuiz = currentHash === '#geography-quiz';
  const showTravelStyleQuiz = currentHash === '#travel-style-quiz';
  const showPackingList = currentHash === '#packing-list';
  const showTripRandomizer = currentHash === '#trip-randomizer';
  const showTrainVsFlightPrices = currentHash === '#train-vs-flight-prices';
  const showShopPage = currentHash === '#shop';
  const showBlogPage = currentHash === '#blog';
  const showBlogDetail = currentBlogId !== null;

  // Show profile setup modal if user is authenticated but has no profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleBlogClick = (blogId: string) => {
    setCurrentBlogId(blogId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBlog = () => {
    setCurrentBlogId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-secondary-light">{t('loading.text')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        {showBlogDetail ? (
          <BlogDetailPage blogId={currentBlogId!} onBack={handleBackToBlog} />
        ) : showAdminDashboard ? (
          <AdminDashboard />
        ) : showGeographyQuiz ? (
          <GeographyQuiz />
        ) : showTravelStyleQuiz ? (
          <TravelStyleQuiz />
        ) : showPackingList ? (
          <PackingList />
        ) : showTripRandomizer ? (
          <TripRandomizer />
        ) : showTrainVsFlightPrices ? (
          <TrainVsFlightPrices />
        ) : showShopPage ? (
          <ShopPage />
        ) : showBlogPage ? (
          <BlogPage onBlogClick={handleBlogClick} />
        ) : (
          <HomePage onBlogClick={handleBlogClick} />
        )}
      </main>
      <Footer />
      
      <ToastContainer />
      
      {showProfileSetup && (
        <ProfileSetupModal />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
