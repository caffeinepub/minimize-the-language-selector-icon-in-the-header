import React from 'react';
import { X, Eye } from 'lucide-react';
import { BlogPost } from '../backend';
import { useGetBlogViewCount } from '../hooks/useQueries';

interface BlogViewModalProps {
  post: BlogPost;
  onClose: () => void;
}

export default function BlogViewModal({ post, onClose }: BlogViewModalProps) {
  const { data: viewCount } = useGetBlogViewCount(post.id);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('nl-NL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderContent = (content: string) => {
    // Convert markdown images to HTML with responsive styling
    return content.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g, 
      '<img src="$2" alt="$1" class="max-w-full h-auto my-4 rounded-lg" loading="lazy" />'
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-light">
          <h2 className="text-xl font-bold text-secondary">Bekijk Blogpost</h2>
          <button
            onClick={onClose}
            className="text-secondary-light hover:text-secondary"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="prose max-w-none">
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <h1 className="text-3xl font-bold mb-4 text-secondary">{post.title}</h1>
            <div className="flex items-center space-x-4 text-secondary-light mb-6 flex-wrap">
              <span>Door {post.author}</span>
              <span>•</span>
              <span>Aangemaakt: {formatDate(post.timestamp)}</span>
              {post.publishedAt && (
                <>
                  <span>•</span>
                  <span>Gepubliceerd: {formatDate(post.publishedAt)}</span>
                </>
              )}
              <span>•</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                post.published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {post.published ? 'Gepubliceerd' : 'Concept'}
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{viewCount || 0} weergaven</span>
              </span>
            </div>
            <div className="mb-6 p-4 bg-neutral-light rounded-lg">
              <p className="text-secondary italic">{post.excerpt}</p>
            </div>
            <div 
              className="whitespace-pre-wrap text-secondary leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
            />
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-neutral-light">
                <h3 className="text-sm font-semibold text-secondary-light mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-neutral-light text-accent text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {post.categories && post.categories.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-secondary-light mb-3">Categorieën:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-accent bg-opacity-10 text-accent text-sm rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-neutral-light">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}
