import React, { useEffect } from 'react';
import { Calendar, User, ArrowLeft, Tag, Share2, Eye } from 'lucide-react';
import { useGetBlogPost, useGetBlogViewCount, useIncrementBlogViewCount } from '../hooks/useQueries';

interface BlogDetailPageProps {
  blogId: string;
  onBack: () => void;
}

export default function BlogDetailPage({ blogId, onBack }: BlogDetailPageProps) {
  const { data: blogPost, isLoading, error } = useGetBlogPost(blogId);
  const { data: viewCount } = useGetBlogViewCount(blogId);
  const incrementViewCount = useIncrementBlogViewCount();

  // Increment view count when page loads or refreshes
  useEffect(() => {
    if (blogId) {
      incrementViewCount.mutate(blogId);
    }
  }, [blogId]);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('nl-NL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = () => {
    if (navigator.share && blogPost) {
      navigator.share({
        title: blogPost.title,
        text: blogPost.excerpt,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link gekopieerd naar klembord!');
    }
  };

  const renderContent = (content: string) => {
    // Convert markdown images to HTML with responsive styling
    return content.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g, 
      '<img src="$2" alt="$1" class="w-full max-w-full h-auto my-6 rounded-lg shadow-sm" loading="lazy" style="display: block; margin-left: auto; margin-right: auto;" />'
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-light py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white rounded w-32 mb-8"></div>
            <div className="h-96 bg-white rounded-xl mb-8"></div>
            <div className="h-12 bg-white rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-white rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-white rounded"></div>
              <div className="h-4 bg-white rounded"></div>
              <div className="h-4 bg-white rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen bg-neutral-light py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center text-accent hover:text-accent-dark font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Terug naar blog
          </button>
          <div className="bg-white rounded-xl p-12 text-center">
            <h2 className="text-2xl font-bold text-secondary mb-4">Blogpost niet gevonden</h2>
            <p className="text-secondary-light mb-6">
              De blogpost die je zoekt bestaat niet of is verwijderd.
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              Terug naar blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center text-accent hover:text-accent-dark font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Terug naar blog
        </button>

        {/* Blog Post Content */}
        <article className="bg-white rounded-xl overflow-hidden shadow-sm">
          {/* Cover Image */}
          {blogPost.coverImage && (
            <div className="w-full h-96 bg-neutral-light overflow-hidden">
              <img
                src={blogPost.coverImage}
                alt={blogPost.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8 sm:p-12">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-secondary mb-6 font-gotham leading-tight">
              {blogPost.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-light mb-8 pb-8 border-b border-neutral-light">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{formatDate(blogPost.publishedAt || blogPost.timestamp)}</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                <span>{viewCount || 0} weergaven</span>
              </div>
              <button
                onClick={handleShare}
                className="flex items-center text-accent hover:text-accent-dark transition-colors ml-auto"
              >
                <Share2 className="w-4 h-4 mr-2" />
                <span>Delen</span>
              </button>
            </div>

            {/* Blog Content with embedded images */}
            <div 
              className="prose prose-lg max-w-none text-secondary-light leading-relaxed mb-8"
              dangerouslySetInnerHTML={{ __html: renderContent(blogPost.content) }}
            />

            {/* Tags */}
            {blogPost.tags && blogPost.tags.length > 0 && (
              <div className="pt-8 border-t border-neutral-light">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-secondary-light" />
                  {blogPost.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-neutral-light text-secondary text-sm px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Share Section */}
        <div className="mt-8 bg-white rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-secondary mb-4">Vond je dit artikel leuk?</h3>
          <p className="text-secondary-light mb-6">
            Deel het met je vrienden en familie!
          </p>
          <button
            onClick={handleShare}
            className="inline-flex items-center bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Deel dit artikel
          </button>
        </div>
      </div>
    </div>
  );
}
