import React, { useState } from 'react';
import { Calendar, User, ArrowRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useActor } from '../hooks/useActor';
import { useQuery } from '@tanstack/react-query';
import { useGetAllBlogViewCounts } from '../hooks/useQueries';
import { useLanguage } from '../contexts/LanguageContext';
import { BlogPost } from '../backend';

interface BlogPageProps {
  onBlogClick?: (blogId: string) => void;
}

const POSTS_PER_PAGE = 12;

export default function BlogPage({ onBlogClick }: BlogPageProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const { actor, isFetching: actorFetching } = useActor();
  const { data: viewCounts } = useGetAllBlogViewCounts();
  const { t, language } = useLanguage();

  // Fetch paginated blog posts
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['paginatedBlogPosts', currentPage],
    queryFn: async () => {
      if (!actor) return [];
      const offset = currentPage * POSTS_PER_PAGE;
      return actor.getPublishedBlogsPaginated(BigInt(offset), BigInt(POSTS_PER_PAGE));
    },
    enabled: !!actor && !actorFetching,
    placeholderData: (previousData) => previousData,
  });

  // Fetch total count to determine if there are more pages
  const { data: allPosts } = useQuery<BlogPost[]>({
    queryKey: ['allPublishedBlogPosts'],
    queryFn: async () => {
      if (!actor) return [];
      // Fetch a large number to get total count
      return actor.getPublishedBlogsPaginated(BigInt(0), BigInt(1000));
    },
    enabled: !!actor && !actorFetching,
  });

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

  const getViewCount = (blogId: string): number => {
    if (!viewCounts) return 0;
    return viewCounts.get(blogId) || 0;
  };

  const handleBlogPostClick = (blogId: string) => {
    if (onBlogClick) {
      onBlogClick(blogId);
    }
  };

  const totalPosts = allPosts?.length || 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
  const hasNextPage = currentPage < totalPages - 1;
  const hasPrevPage = currentPage > 0;

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-neutral-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary font-gotham mb-4">
            {t('nav.blog')}
          </h1>
          <p className="text-xl text-secondary-light max-w-3xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {isLoading ? (
            Array.from({ length: POSTS_PER_PAGE }).map((_, index) => (
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
          ) : blogPosts && blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <article 
                key={post.id} 
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleBlogPostClick(post.id)}
              >
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
                      <span>{getViewCount(post.id)} {t('blog.viewCount')}</span>
                    </div>
                  </div>
                  <h2 className="text-lg font-semibold text-secondary mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-secondary-light text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="inline-flex items-center text-accent hover:text-accent-dark font-medium text-sm">
                    {t('blog.readMore')}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-secondary-light text-lg">{t('blog.noPosts')}</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={handlePrevPage}
              disabled={!hasPrevPage}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                hasPrevPage
                  ? 'bg-white text-secondary hover:bg-accent hover:text-white shadow-sm'
                  : 'bg-neutral-light text-secondary-light cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              {t('pagination.previous')}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-secondary-light">
                {t('pagination.page')} {currentPage + 1} {t('pagination.of')} {totalPages}
              </span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                hasNextPage
                  ? 'bg-white text-secondary hover:bg-accent hover:text-white shadow-sm'
                  : 'bg-neutral-light text-secondary-light cursor-not-allowed'
              }`}
            >
              {t('pagination.next')}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
