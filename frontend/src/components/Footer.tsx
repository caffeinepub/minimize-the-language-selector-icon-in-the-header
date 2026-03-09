import React from 'react';
import { SiInstagram, SiTiktok } from 'react-icons/si';
import { Coffee } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  
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

  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Description */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-gotham">{t('footer.brand')}</h3>
            <p className="text-white text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-gotham">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={handleHomeClick}
                  className="text-white hover:text-accent transition-colors text-sm"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleBlogClick}
                  className="text-white hover:text-accent transition-colors text-sm"
                >
                  {t('nav.blog')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleShopClick}
                  className="text-white hover:text-accent transition-colors text-sm"
                >
                  {t('nav.shop')}
                </button>
              </li>
              <li>
                <a href="#contact" className="text-white hover:text-accent transition-colors text-sm">
                  {t('contact.title')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4 font-gotham">{t('footer.followUs')}</h3>
            <div className="flex items-center space-x-4">
              <a
                href="https://instagram.com/travelbuttsofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-400 transition-colors"
                aria-label="Follow us on Instagram"
              >
                <SiInstagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@travelbutts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-pink-400 transition-colors"
                aria-label="Follow us on TikTok"
              >
                <SiTiktok className="w-6 h-6" />
              </a>
              <a
                href="https://buymeacoffee.com/travelbutts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-yellow-400 transition-colors"
                aria-label="Buy Me a Coffee"
              >
                <Coffee className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white border-opacity-20 pt-8 text-center">
          <p className="text-white text-sm">
            © 2023. TravelButts
          </p>
          <div className="mt-4 space-x-4">
            <a href="/privacy" className="text-white hover:text-accent transition-colors text-sm">
              {t('footer.privacy')}
            </a>
            <span className="text-white">•</span>
            <a href="/terms" className="text-white hover:text-accent transition-colors text-sm">
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
