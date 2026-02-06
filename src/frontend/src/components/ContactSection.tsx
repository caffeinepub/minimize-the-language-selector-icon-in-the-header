import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useSubmitContactForm } from '../hooks/useQueries';
import { ContactSubmission } from '../backend';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false,
  });

  const submitContactForm = useSubmitContactForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submission: ContactSubmission = {
      id: `contact-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      consent: formData.consent,
      timestamp: BigInt(Date.now() * 1000000), // Convert to nanoseconds
    };

    submitContactForm.mutate(submission, {
      onSuccess: () => {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          consent: false,
        });
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-secondary mb-4 font-gotham">
            Get In Touch
          </h2>
          <p className="text-xl text-secondary-light max-w-3xl mx-auto">
            Got questions, ideas, or collab dreams? Let's chat!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-secondary mb-6">Let's Connect</h3>
              <p className="text-secondary-light mb-8">
                Whether you need travel advice, have partnership inquiries, or just want to share 
                your travel stories, we're here to help make your journey unforgettable.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neutral-light rounded-lg flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary">Email Us</h4>
                  <p className="text-secondary-light">travelbuttsofficial@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-neutral-light rounded-lg flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary">Follow Us</h4>
                  <p className="text-secondary-light">@travelbuttsofficial on Instagram</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-neutral-light rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary">Based In</h4>
                  <p className="text-secondary-light">Exploring the world, one destination at a time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-neutral-light rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-secondary mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Travel Advice">Travel Advice</option>
                  <option value="Partnership">Partnership Opportunity</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-white rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Tell us about your travel plans or how we can help..."
                  required
                />
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-white rounded mt-1"
                  required
                />
                <label htmlFor="consent" className="ml-3 block text-sm text-secondary">
                  I consent to Travel Butts storing my information and contacting me regarding my inquiry. *
                </label>
              </div>

              <button
                type="submit"
                disabled={submitContactForm.isPending}
                className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {submitContactForm.isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <Send className="w-5 h-5 mr-2" />
                )}
                {submitContactForm.isPending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
