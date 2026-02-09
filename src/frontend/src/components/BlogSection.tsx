import React, { useState, useEffect, useRef } from 'react';
import { Calendar, User, ArrowRight, Plus, Instagram, Play, Pause, Video, Image as ImageIcon, ExternalLink, Eye } from 'lucide-react';
import { useGetPublishedBlogPosts, useIsAdmin, useGetInstagramFeedItems, useGetAllBlogViewCounts } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useLanguage } from '../contexts/LanguageContext';
import BlogPostModal from './BlogPostModal';
import { InstagramFeedItem } from '../backend';

interface BlogSectionProps {
  onBlogClick?: (blogId: string) => void;
}

export default function BlogSection({ onBlogClick }: BlogSectionProps) {
  const [activeTab, setActiveTab] = useState<'blog' | 'instagram'>('blog');
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const { data: blogPosts, isLoading: blogLoading } = useGetPublishedBlogPosts();
  const { data: instagramItems, isLoading: instagramLoading } = useGetInstagramFeedItems();
  const { data: viewCounts, isLoading: viewCountsLoading } = useGetAllBlogViewCounts();
  const { data: isAdmin } = useIsAdmin();
  const { identity } = useInternetIdentity();
  const { t, language } = useLanguage();
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

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

  // Auto-play videos when they come into view
  useEffect(() => {
    if (!instagramItems || activeTab !== 'instagram') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoElement = entry.target as HTMLVideoElement;
          const videoId = videoElement.dataset.videoId;
          
          if (entry.isIntersecting && videoId) {
            videoElement.play().catch((error) => {
              console.log('Auto-play failed:', error);
            });
            setPlayingVideos(prev => new Set(prev).add(videoId));
          } else if (videoId) {
            videoElement.pause();
            setPlayingVideos(prev => {
              const newSet = new Set(prev);
              newSet.delete(videoId);
              return newSet;
            });
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: '0px'
      }
    );

    videoRefs.current.forEach((video) => {
      if (video) {
        observer.observe(video);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [instagramItems, activeTab]);

  const toggleVideoPlay = (videoId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const video = videoRefs.current.get(videoId);
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingVideos(prev => new Set(prev).add(videoId));
      } else {
        video.pause();
        setPlayingVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
      }
    }
  };

  const handleInstagramItemClick = (item: InstagramFeedItem) => {
    if (item.link) {
      window.open(item.link, '_blank', 'noopener,noreferrer');
    }
  };

  const setVideoRef = (videoId: string, element: HTMLVideoElement | null) => {
    if (element) {
      videoRefs.current.set(videoId, element);
    } else {
      videoRefs.current.delete(videoId);
    }
  };

  const handleBlogPostClick = (blogId: string) => {
    if (onBlogClick) {
      onBlogClick(blogId);
    }
  };

  const getViewCountDisplay = (blogId: string): string => {
    if (viewCountsLoading || !viewCounts) return '—';
    const count = viewCounts.get(blogId);
    return count !== undefined ? count.toString() : '—';
  };

  // Sort blog posts by publishedAt (or timestamp if publishedAt is null), newest first, and limit to 6
  const displayedBlogPosts = blogPosts 
    ? [...blogPosts]
        .sort((a, b) => {
          const aTime = a.publishedAt || a.timestamp;
          const bTime = b.publishedAt || b.timestamp;
          return Number(bTime - aTime);
        })
        .slice(0, 6)
    : [];

  return (
    <section id="blog" className="py-20 bg-neutral-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-secondary font-gotham">
              {t('blog.title')}
            </h2>
            {isAdmin && identity && (
              <button
                onClick={() => setShowBlogModal(true)}
                className="bg-accent hover:bg-accent-dark text-white p-2 rounded-full transition-colors"
                title={t('blog.addPost')}
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
          <p className="text-xl text-secondary-light max-w-3xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-1 shadow-sm border border-neutral-light">
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'blog'
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-secondary-light hover:text-accent'
              }`}
            >
              {t('blog.tab')}
            </button>
            <button
              onClick={() => setActiveTab('instagram')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                activeTab === 'instagram'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm'
                  : 'text-secondary-light hover:text-accent'
              }`}
            >
              {t('blog.instagramTab')}
            </button>
          </div>
        </div>

        {/* Content with smooth transitions */}
        <div className="relative">
          {/* Blog Posts Tab */}
          <div 
            className={`transition-all duration-500 ${
              activeTab === 'blog' 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-48 bg-neutral-light"></div>
                    <div className="p-6">
                      <div className="h-4 bg-neutral-light rounded mb-2"></div>
                      <div className="h-6 bg-neutral-light rounded mb-3"></div>
                      <div className="h-4 bg-neutral-light rounded mb-2"></div>
                      <div className="h-4 bg-neutral-light rounded w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : displayedBlogPosts && displayedBlogPosts.length > 0 ? (
                displayedBlogPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {post.coverImage && (
                      <div className="h-48 bg-neutral-light overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center text-sm text-secondary-light mb-3 flex-wrap gap-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{formatDate(post.publishedAt || post.timestamp)}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          <span>{getViewCountDisplay(post.id)} {t('blog.viewCount')}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-secondary mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-secondary-light text-sm mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <button 
                        onClick={() => handleBlogPostClick(post.id)}
                        className="inline-flex items-center text-accent hover:text-accent-dark font-medium text-sm"
                      >
                        {t('blog.readMore')}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-secondary-light text-lg">{t('blog.noPosts')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Instagram Feed Tab */}
          <div 
            className={`transition-all duration-500 ${
              activeTab === 'instagram' 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-4 absolute inset-0 pointer-events-none'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {instagramLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                    <div className="h-64 bg-neutral-light"></div>
                    <div className="p-4">
                      <div className="h-4 bg-neutral-light rounded mb-2"></div>
                      <div className="h-4 bg-neutral-light rounded w-3/4"></div>
                    </div>
                  </div>
                ))
              ) : instagramItems && instagramItems.filter(item => item.published && !item.story).length > 0 ? (
                instagramItems
                  .filter(item => item.published && !item.story)
                  .slice(0, 6)
                  .map((item) => (
                    <article 
                      key={item.id} 
                      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => handleInstagramItemClick(item)}
                    >
                      <div className="relative h-64 bg-neutral-light overflow-hidden">
                        {item.mediaType === 'video' ? (
                          <>
                            <video
                              ref={(el) => setVideoRef(item.id, el)}
                              data-video-id={item.id}
                              src={item.mediaUrl}
                              className="w-full h-full object-cover"
                              loop
                              muted
                              playsInline
                            />
                            <button
                              onClick={(e) => toggleVideoPlay(item.id, e)}
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {playingVideos.has(item.id) ? (
                                <Pause className="w-12 h-12 text-white" />
                              ) : (
                                <Play className="w-12 h-12 text-white" />
                              )}
                            </button>
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
                              <Video className="w-4 h-4 text-white" />
                            </div>
                          </>
                        ) : (
                          <>
                            <img
                              src={item.mediaUrl}
                              alt={item.caption}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
                              <ImageIcon className="w-4 h-4 text-white" />
                            </div>
                          </>
                        )}
                        {item.link && (
                          <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ExternalLink className="w-4 h-4 text-secondary" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-secondary-light text-sm line-clamp-3">
                          {item.caption}
                        </p>
                      </div>
                    </article>
                  ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <Instagram className="w-16 h-16 mx-auto mb-4 text-secondary-light" />
                  <p className="text-secondary-light text-lg">{t('blog.noInstagramPosts')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Post Modal */}
      {showBlogModal && (
        <BlogPostModal
          onClose={() => setShowBlogModal(false)}
        />
      )}
    </section>
  );
}
