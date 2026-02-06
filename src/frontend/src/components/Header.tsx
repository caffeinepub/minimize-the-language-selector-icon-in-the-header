import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Shield } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { useLanguage } from '../contexts/LanguageContext';
import LoginButton from './LoginButton';
import LanguageSelector from './LanguageSelector';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const { data: logoUrl, refetch: refetchLogo } = useFileUrl('assets/travel-butts-logo.png');
  const { t } = useLanguage();

  const isAuthenticated = !!identity;

  // Periodically check for logo updates for all users
  useEffect(() => {
    const interval = setInterval(() => {
      refetchLogo();
    }, 10000); // Check every 10 seconds for all users

    return () => clearInterval(interval);
  }, [refetchLogo]);

  const handleAdminClick = () => {
    if (isAdmin) {
      window.location.hash = '#admin';
      window.location.reload();
    }
  };

  const handleHomeClick = () => {
    window.location.hash = '';
    window.location.reload();
  };

  const handleBlogClick = () => {
    window.location.hash = '#blog';
    window.location.reload();
  };

  const handleShopClick = () => {
    window.location.hash = '#shop';
    window.location.reload();
  };

  const handleToolClick = (href: string) => {
    if (href.startsWith('#')) {
      window.location.hash = href;
      window.location.reload();
    } else {
      window.location.href = href;
    }
    setIsToolsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-light shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Enhanced mobile visibility with proper sizing */}
          <div className="flex-shrink-0 logo-container min-w-0">
            {logoUrl ? (
              <button onClick={handleHomeClick} className="flex items-center">
                <img
                  key={logoUrl} // Force re-render when logoUrl changes
                  src={logoUrl}
                  alt="Travel Butts logo"
                  className="logo-image h-8 sm:h-10 w-auto max-w-[120px] sm:max-w-[150px] object-contain transition-opacity duration-300"
                  style={{ opacity: '1' }}
                  onLoad={() => {
                    // Ensure the image is visible after loading
                    const img = document.querySelector('img[alt="Travel Butts logo"]') as HTMLImageElement;
                    if (img) {
                      img.style.opacity = '1';
                    }
                  }}
                />
              </button>
            ) : (
              <div className="logo-placeholder h-8 sm:h-10 w-8 sm:w-10">
                {/* Invisible placeholder to maintain layout */}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={handleHomeClick}
              className="text-secondary-light hover:text-accent font-medium transition-colors"
            >
              {t('nav.home')}
            </button>
            
            {/* Travel Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center text-secondary-light hover:text-accent font-medium transition-colors"
              >
                {t('nav.travelTools')}
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              
              {isToolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-light py-2 z-50">
                  <button 
                    onClick={() => handleToolClick('#trip-randomizer')}
                    className="block w-full text-left px-4 py-2 text-secondary-light hover:bg-neutral-light transition-colors"
                  >
                    {t('tools.tripRandomizer')}
                  </button>
                  <button 
                    onClick={() => handleToolClick('/coming-soon')}
                    className="block w-full text-left px-4 py-2 text-secondary-light hover:bg-neutral-light transition-colors"
                  >
                    {t('tools.printOnDemand')}
                  </button>
                  <button 
                    onClick={() => handleToolClick('#train-vs-flight-prices')}
                    className="block w-full text-left px-4 py-2 text-secondary-light hover:bg-neutral-light transition-colors"
                  >
                    {t('tools.trainVsFlight')}
                  </button>
                  <button 
                    onClick={() => handleToolClick('#packing-list')}
                    className="block w-full text-left px-4 py-2 text-secondary-light hover:bg-neutral-light transition-colors"
                  >
                    {t('tools.packingList')}
                  </button>
                  <button 
                    onClick={() => handleToolClick('#geography-quiz')}
                    className="block w-full text-left px-4 py-2 text-secondary-light hover:bg-neutral-light transition-colors"
                  >
                    {t('tools.geographyQuiz')}
                  </button>
                  <button 
                    onClick={() => handleToolClick('#travel-style-quiz')}
                    className="block w-full text-left px-4 py-2 text-secondary-light hover:bg-neutral-light transition-colors"
                  >
                    {t('tools.travelStyleQuiz')}
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={handleBlogClick}
              className="text-secondary-light hover:text-accent font-medium transition-colors"
            >
              {t('nav.blog')}
            </button>

            <button 
              onClick={handleShopClick}
              className="text-secondary-light hover:text-accent font-medium transition-colors"
            >
              {t('nav.shop')}
            </button>

            {isAdmin && (
              <button
                onClick={handleAdminClick}
                className="flex items-center text-secondary-light hover:text-accent font-medium transition-colors"
              >
                <Shield className="w-4 h-4 mr-1" />
                {t('nav.admin')}
              </button>
            )}
          </nav>

          {/* Right side - Language Selector, Social Icons and Login (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Social Icons */}
            <a
              href="https://instagram.com/travelbuttsofficial"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="text-secondary-light hover:text-pink-500 transition-colors p-2 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
              </svg>
            </a>
            
            <a
              href="https://tiktok.com/@travelbutts"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on TikTok"
              className="text-secondary-light hover:text-black transition-colors p-2 flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>

            <LoginButton />
          </div>

          {/* Mobile Header Right Side - Enhanced layout with guaranteed login button visibility and admin shortcut */}
          <div className="md:hidden flex items-center space-x-2 mobile-header-right flex-shrink-0">
            {/* Language Selector for Mobile */}
            <LanguageSelector />
            
            {/* Admin Shortcut for Mobile - Always visible when admin is logged in */}
            {isAdmin && isAuthenticated && (
              <button
                onClick={handleAdminClick}
                className="mobile-admin-button p-2 text-accent hover:text-accent-dark hover:bg-accent hover:bg-opacity-10 rounded-lg transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Admin Dashboard"
                aria-label="Admin Dashboard"
              >
                <Shield className="w-5 h-5" />
              </button>
            )}
            
            {/* Login Button - Always visible on mobile with enhanced styling and guaranteed visibility */}
            <div className="mobile-login-button-container flex-shrink-0">
              <LoginButton />
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-button text-secondary-light hover:text-secondary focus:outline-none p-2 flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-light py-4 bg-white mobile-menu">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={handleHomeClick}
                className="text-secondary-light hover:text-accent font-medium text-left"
              >
                {t('nav.home')}
              </button>
              
              {/* Mobile Travel Tools */}
              <div className="space-y-2">
                <p className="text-secondary-light font-medium">{t('nav.travelTools')}:</p>
                <button 
                  onClick={() => handleToolClick('#trip-randomizer')}
                  className="block text-secondary-light hover:text-accent text-sm pl-4"
                >
                  {t('tools.tripRandomizer')}
                </button>
                <button 
                  onClick={() => handleToolClick('/coming-soon')}
                  className="block text-secondary-light hover:text-accent text-sm pl-4"
                >
                  {t('tools.printOnDemand')}
                </button>
                <button 
                  onClick={() => handleToolClick('#train-vs-flight-prices')}
                  className="block text-secondary-light hover:text-accent text-sm pl-4"
                >
                  {t('tools.trainVsFlight')}
                </button>
                <button 
                  onClick={() => handleToolClick('#packing-list')}
                  className="block text-secondary-light hover:text-accent text-sm pl-4"
                >
                  {t('tools.packingList')}
                </button>
                <button 
                  onClick={() => handleToolClick('#geography-quiz')}
                  className="block text-secondary-light hover:text-accent text-sm pl-4"
                >
                  {t('tools.geographyQuiz')}
                </button>
                <button 
                  onClick={() => handleToolClick('#travel-style-quiz')}
                  className="block text-secondary-light hover:text-accent text-sm pl-4"
                >
                  {t('tools.travelStyleQuiz')}
                </button>
              </div>
              
              <button 
                onClick={handleBlogClick}
                className="text-secondary-light hover:text-accent font-medium text-left"
              >
                {t('nav.blog')}
              </button>
              
              <button 
                onClick={handleShopClick}
                className="text-secondary-light hover:text-accent font-medium text-left"
              >
                {t('nav.shop')}
              </button>
              
              {isAdmin && (
                <button
                  onClick={handleAdminClick}
                  className="flex items-center text-secondary-light hover:text-accent font-medium"
                >
                  <Shield className="w-4 h-4 mr-1" />
                  {t('nav.admin')}
                </button>
              )}
              
              {/* Mobile Social Icons */}
              <div className="flex items-center space-x-4 pt-4 border-t border-neutral-light">
                <span className="text-sm text-secondary-light font-medium">{t('footer.followUs')}:</span>
                <a
                  href="https://instagram.com/travelbuttsofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-light hover:text-pink-500"
                  aria-label="Follow us on Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
                  </svg>
                </a>
                <a
                  href="https://tiktok.com/@travelbutts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary-light hover:text-black"
                  aria-label="Follow us on TikTok"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
