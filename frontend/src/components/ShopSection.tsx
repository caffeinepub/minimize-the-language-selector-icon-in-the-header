import React, { useState } from 'react';
import { ShoppingBag, ExternalLink, X, DollarSign, Star, Plus, Calendar } from 'lucide-react';
import { useGetPopularShopProducts, useIsAdmin } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from '../contexts/LanguageContext';
import { ShopProduct } from '../backend';
import ShopProductModal from './ShopProductModal';

export default function ShopSection() {
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showProductModal, setShowProductModal] = useState(false);
  const { data: shopProducts, isLoading } = useGetPopularShopProducts();
  const { data: isAdmin } = useIsAdmin();
  const { identity } = useInternetIdentity();
  const { t, language } = useLanguage();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    const locales: Record<string, string> = {
      en: 'en-US',
      nl: 'nl-NL',
      de: 'de-DE',
      fr: 'fr-FR',
      es: 'es-ES',
    };
    return date.toLocaleDateString(locales[language] || 'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleProductClick = (product: ShopProduct, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.product-buy-button')) {
      return;
    }
    
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  const handleBuyClick = (e: React.MouseEvent, affiliateLink: string) => {
    e.stopPropagation();
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  const nextImage = () => {
    if (selectedProduct && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === selectedProduct.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProduct && selectedProduct.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProduct.images.length - 1 : prev - 1
      );
    }
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0);
  };

  return (
    <section id="shop" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary font-gotham">
              {t('shop.title')}
            </h2>
            {isAdmin && identity && (
              <button
                onClick={() => setShowProductModal(true)}
                className="bg-accent hover:bg-accent-dark text-white p-2 rounded-full transition-colors"
                title={t('shop.addProduct')}
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse h-[420px] sm:h-[450px]">
                <div className="h-48 sm:h-56 bg-neutral-light"></div>
                <div className="p-3 sm:p-4 h-[168px] sm:h-[178px] flex flex-col">
                  <div className="h-4 bg-neutral-light rounded mb-2"></div>
                  <div className="h-4 bg-neutral-light rounded w-3/4 mb-3"></div>
                  <div className="flex-1"></div>
                  <div className="h-10 bg-neutral-light rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : shopProducts && shopProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {shopProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group h-[420px] sm:h-[450px] flex flex-col"
                onClick={(e) => handleProductClick(product, e)}
              >
                <div className="relative h-48 sm:h-56 bg-neutral-light overflow-hidden flex-shrink-0">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-light flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 sm:w-12 sm:h-12 text-secondary-light" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-accent text-white px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm">
                    {formatPrice(product.price)}
                  </div>
                  
                  {product.images && product.images.length > 1 && (
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span className="hidden sm:inline">{product.images.length} {t('shop.photos')}</span>
                      <span className="sm:hidden">{product.images.length}</span>
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1 h-[168px] sm:h-[178px]">
                  <h3 className="text-sm sm:text-lg font-semibold text-secondary mb-2 line-clamp-2 group-hover:text-accent transition-colors h-8 sm:h-12 flex items-start">
                    <span className="line-clamp-2">{product.title}</span>
                  </h3>
                  
                  <p className="text-secondary-light text-xs sm:text-sm mb-3 line-clamp-3 leading-relaxed h-12 sm:h-16 flex items-start">
                    <span className="line-clamp-3">{product.description}</span>
                  </p>
                  
                  <div className="flex-1"></div>
                  
                  <div className="flex flex-col space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-between text-xs text-secondary-light">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span className="hidden sm:inline">{formatDate(product.timestamp)}</span>
                        <span className="sm:hidden">{new Date(Number(product.timestamp) / 1000000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </span>
                      <div className="text-sm sm:text-lg font-bold text-accent">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => handleBuyClick(e, product.affiliateLink)}
                      className="product-buy-button w-full bg-accent hover:bg-accent-dark text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm h-10 flex-shrink-0"
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{t('shop.buy')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">{t('shop.comingSoon')}</h3>
              <p className="text-secondary-light mb-6 leading-relaxed">
                {t('shop.comingSoonDescription')}
              </p>
            </div>
          </div>
        )}

        {selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-neutral-light">
                <h2 className="text-xl font-bold text-secondary">{t('shop.productDetails')}</h2>
                <button
                  onClick={closeProductDetails}
                  className="text-secondary-light hover:text-secondary"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {selectedProduct.images && selectedProduct.images.length > 0 ? (
                      <div className="relative">
                        <div className="relative h-96 bg-neutral-light rounded-lg overflow-hidden">
                          <img
                            src={selectedProduct.images[currentImageIndex]}
                            alt={`${selectedProduct.title} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover"
                          />
                          
                          {selectedProduct.images.length > 1 && (
                            <>
                              <button
                                onClick={prevImage}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={nextImage}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-colors"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              
                              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                {selectedProduct.images.map((_, index) => (
                                  <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${
                                      index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                                    }`}
                                  />
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                        
                        {selectedProduct.images.length > 1 && (
                          <div className="flex space-x-2 overflow-x-auto">
                            {selectedProduct.images.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                  index === currentImageIndex ? 'border-accent' : 'border-neutral-light'
                                }`}
                              >
                                <img
                                  src={image}
                                  alt={`${selectedProduct.title} thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-96 bg-neutral-light rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-secondary-light" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h1 className="text-2xl font-bold text-secondary mb-4">{selectedProduct.title}</h1>
                      <div className="text-3xl font-bold text-accent mb-6">
                        {formatPrice(selectedProduct.price)}
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <p className="text-secondary-light leading-relaxed whitespace-pre-wrap">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={(e) => handleBuyClick(e, selectedProduct.affiliateLink)}
                        className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 text-lg shadow-sm"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        <span>{t('shop.buyNow')} - {formatPrice(selectedProduct.price)}</span>
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      
                      <p className="text-xs text-secondary-light text-center">
                        {t('shop.redirectMessage')}
                      </p>
                    </div>

                    <div className="bg-neutral-light rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-secondary mb-1">{t('shop.whyWeLove')}</h4>
                          <p className="text-sm text-secondary-light leading-relaxed">
                            {t('shop.whyWeLoveDescription')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showProductModal && (
          <ShopProductModal onClose={() => setShowProductModal(false)} />
        )}
      </div>
    </section>
  );
}
