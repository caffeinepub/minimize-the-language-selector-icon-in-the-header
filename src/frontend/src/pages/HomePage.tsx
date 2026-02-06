import React from 'react';
import HeroSection from '../components/HeroSection';
import BlogSection from '../components/BlogSection';
import ShopSection from '../components/ShopSection';
import ContactSection from '../components/ContactSection';

interface HomePageProps {
  onBlogClick?: (blogId: string) => void;
}

export default function HomePage({ onBlogClick }: HomePageProps) {
  return (
    <>
      <HeroSection />
      <BlogSection onBlogClick={onBlogClick} />
      <ShopSection />
      <ContactSection />
    </>
  );
}
