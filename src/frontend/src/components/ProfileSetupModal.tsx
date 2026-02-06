import React, { useState } from 'react';
import { User, Mail, X, Save, AlertCircle, Heart, Globe } from 'lucide-react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { UserProfile } from '../backend';
import { showToast } from '../utils/toast';
import { useLanguage, Language } from '../contexts/LanguageContext';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export default function ProfileSetupModal() {
  const { t, language, setLanguage } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newsletter: false,
    language: language,
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
  });

  const saveProfile = useSaveCallerUserProfile();

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
    };

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = t('profile.usernameRequired');
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t('profile.usernameMinLength');
    } else if (formData.name.trim().length > 50) {
      newErrors.name = t('profile.usernameMaxLength');
    } else if (!/^[a-zA-Z0-9_\-\s]+$/.test(formData.name.trim())) {
      newErrors.name = t('profile.usernameInvalid');
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = t('profile.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('profile.emailInvalid');
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const profile: UserProfile = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        newsletter: formData.newsletter,
        language: formData.language,
      };

      await saveProfile.mutateAsync(profile);
      setLanguage(formData.language);
      showToast('Welcome to Travel Butts! Your profile has been created successfully.', 'success');
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast('Failed to create profile. Please try again.', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-accent text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{t('profile.welcome')}</h2>
          </div>
          <p className="text-center text-white/90">
            {t('profile.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center mb-6">
            <p className="text-secondary-light text-sm">
              {t('profile.description')}
            </p>
          </div>

          {/* Username Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
              {t('profile.username')} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-secondary-light" />
              </div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-neutral-light'
                }`}
                placeholder="Choose a username"
                required
              />
            </div>
            {errors.name && (
              <div className="mt-2 flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.name}</span>
              </div>
            )}
            <p className="mt-1 text-xs text-secondary-light">
              {t('profile.usernameHelp')}
            </p>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
              {t('profile.email')} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-secondary-light" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-neutral-light'
                }`}
                placeholder="your.email@example.com"
                required
              />
            </div>
            {errors.email && (
              <div className="mt-2 flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{errors.email}</span>
              </div>
            )}
            <p className="mt-1 text-xs text-secondary-light">
              {t('profile.emailHelp')}
            </p>
          </div>

          {/* Language Selection */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-secondary mb-2">
              {t('profile.language')} *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-secondary-light" />
              </div>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors appearance-none bg-white"
                required
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs text-secondary-light">
              {t('profile.languageHelp')}
            </p>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-neutral-light rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="h-4 w-4 text-accent focus:ring-accent border-neutral-light rounded mt-1"
              />
              <div className="flex-1">
                <label htmlFor="newsletter" className="block text-sm font-medium text-secondary">
                  {t('profile.newsletter')}
                </label>
                <p className="text-xs text-secondary-light mt-1 leading-relaxed">
                  {t('profile.newsletterDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-neutral-light rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3 h-3 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-secondary text-sm mb-1">{t('profile.privacyTitle')}</h4>
                <p className="text-xs text-secondary-light leading-relaxed">
                  {t('profile.privacyDescription')}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saveProfile.isPending || !formData.name.trim() || !formData.email.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveProfile.isPending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>
              {saveProfile.isPending ? t('profile.submitting') : t('profile.submit')}
            </span>
          </button>

          {/* Required Fields Notice */}
          <p className="text-center text-xs text-secondary-light">
            * {t('profile.required')}
          </p>
        </form>
      </div>
    </div>
  );
}
