import React, { useEffect } from 'react';
import TravelToolsGrid from './TravelToolsGrid';
import HeroImageUploader from './HeroImageUploader';
import { useFileUrl } from '../blob-storage/FileStorage';
import { useIsAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function HeroSection() {
  const { data: heroImageUrl, refetch: refetchHeroImage } = useFileUrl('assets/hero-image.jpg');
  const { data: isAdmin } = useIsAdmin();
  const { identity } = useInternetIdentity();

  // Periodically check for hero image updates for all users
  useEffect(() => {
    const interval = setInterval(() => {
      refetchHeroImage();
    }, 10000); // Check every 10 seconds for all users

    return () => clearInterval(interval);
  }, [refetchHeroImage]);

  return (
    <section className="relative bg-white">
      {/* Admin Upload Interface */}
      {isAdmin && identity && (
        <div className="absolute top-4 left-4 z-10">
          <HeroImageUploader />
        </div>
      )}

      {/* Desktop Layout (lg and above) */}
      <div className="hidden lg:block">
        <div className="h-screen flex">
          {/* Left Half - Hero Image */}
          <div className="w-1/2 relative overflow-hidden bg-neutral-light">
            {heroImageUrl ? (
              <img
                key={heroImageUrl} // Force re-render when heroImageUrl changes
                src={heroImageUrl}
                alt="Travel destination"
                className="w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: '1' }}
                onLoad={() => {
                  // Ensure smooth transition when image loads
                  const img = document.querySelector('img[alt="Travel destination"]') as HTMLImageElement;
                  if (img) {
                    img.style.opacity = '1';
                  }
                }}
              />
            ) : (
              <div className="w-full h-full bg-neutral-light"></div>
            )}
            {heroImageUrl && <div className="absolute inset-0 bg-black bg-opacity-10"></div>}
          </div>

          {/* Right Half - Travel Tools */}
          <div className="w-1/2 bg-white flex items-center justify-center p-8 xl:p-12">
            <div className="w-full max-w-2xl">
              <TravelToolsGrid />
            </div>
          </div>
        </div>
      </div>

      {/* Tablet Layout (md to lg) */}
      <div className="hidden md:block lg:hidden">
        <div className="min-h-screen flex flex-col">
          {/* Hero Image - Takes 60% of screen height with proper mobile display */}
          <div className="hero-image-tablet relative overflow-hidden bg-neutral-light">
            {heroImageUrl ? (
              <img
                key={heroImageUrl}
                src={heroImageUrl}
                alt="Travel destination"
                className="w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: '1' }}
              />
            ) : (
              <div className="w-full h-full bg-neutral-light"></div>
            )}
            {heroImageUrl && <div className="absolute inset-0 bg-black bg-opacity-10"></div>}
          </div>

          {/* Content - Takes remaining space */}
          <div className="flex-1 bg-white flex items-center justify-center p-8">
            <div className="w-full max-w-4xl text-center">
              <TravelToolsGrid />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout (below md) - Enhanced for guaranteed visibility and proper display */}
      <div className="block md:hidden">
        <div className="min-h-screen flex flex-col">
          {/* Hero Image - Enhanced mobile display with guaranteed visibility */}
          <div className="hero-image-mobile relative overflow-hidden bg-neutral-light w-full">
            {heroImageUrl ? (
              <div className="w-full relative">
                <img
                  key={heroImageUrl}
                  src={heroImageUrl}
                  alt="Travel destination"
                  className="w-full h-full object-cover transition-opacity duration-500 block"
                  style={{ 
                    opacity: '1',
                    minHeight: '300px',
                    maxHeight: '50vh',
                    height: '40vh'
                  }}
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.opacity = '1';
                  }}
                />
                {/* Subtle overlay for better text readability if needed */}
                <div className="absolute inset-0 bg-black bg-opacity-5"></div>
              </div>
            ) : (
              <div 
                className="w-full bg-neutral-light" 
                style={{ 
                  minHeight: '300px',
                  maxHeight: '50vh',
                  height: '40vh'
                }}
              ></div>
            )}
          </div>

          {/* Content - Enhanced mobile layout with proper spacing */}
          <div className="flex-1 bg-white hero-content-mobile">
            <div className="w-full max-w-lg mx-auto text-center px-4 py-8">
              <TravelToolsGrid />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
