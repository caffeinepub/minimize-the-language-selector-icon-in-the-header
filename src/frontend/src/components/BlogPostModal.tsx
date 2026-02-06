import React, { useState, useRef } from 'react';
import { X, Save, Eye, Image as ImageIcon, AlertCircle, Upload, Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { useCreateBlogPost, useUpdateBlogPost } from '../hooks/useQueries';
import { useFileUpload } from '../blob-storage/FileStorage';
import { BlogPost } from '../backend';

interface BlogPostModalProps {
  onClose: () => void;
  editPost?: BlogPost;
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB

// Helper function to convert UTC timestamp to Amsterdam local datetime string
const utcToAmsterdamDatetime = (utcTimestamp: bigint | undefined): string => {
  if (!utcTimestamp) return '';
  
  const date = new Date(Number(utcTimestamp) / 1000000);
  
  // Format for datetime-local input (YYYY-MM-DDTHH:mm) in Amsterdam timezone
  const amsterdamFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const parts = amsterdamFormatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const hour = parts.find(p => p.type === 'hour')?.value;
  const minute = parts.find(p => p.type === 'minute')?.value;
  
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

// Helper function to convert Amsterdam local datetime string to UTC timestamp
const amsterdamDatetimeToUtc = (datetimeString: string): bigint | undefined => {
  if (!datetimeString) return undefined;
  
  // Parse the datetime string
  const [datePart, timePart] = datetimeString.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  
  // Create a date string in ISO format
  const isoString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
  
  // Parse as Amsterdam time by creating a formatter
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  // Create a date object representing the Amsterdam time
  // We need to find the UTC equivalent of this Amsterdam time
  const testDate = new Date(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`);
  
  // Get the Amsterdam time as a string
  const amsterdamTimeStr = formatter.format(testDate);
  
  // Parse back to get UTC offset
  // Create date assuming UTC, then adjust
  const utcDate = Date.UTC(year, month - 1, day, hour, minute, 0);
  
  // Get the offset by comparing with a known Amsterdam time
  const tempDate = new Date(year, month - 1, day, hour, minute, 0);
  const amsterdamDate = new Date(tempDate.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }));
  const utcDateObj = new Date(tempDate.toLocaleString('en-US', { timeZone: 'UTC' }));
  
  // Calculate offset in milliseconds
  const offset = amsterdamDate.getTime() - utcDateObj.getTime();
  
  // Subtract offset to get UTC time
  const utcTimestamp = tempDate.getTime() - offset;
  
  return BigInt(utcTimestamp * 1000000);
};

export default function BlogPostModal({ onClose, editPost }: BlogPostModalProps) {
  const [formData, setFormData] = useState({
    title: editPost?.title || '',
    content: editPost?.content || '',
    excerpt: editPost?.excerpt || '',
    author: editPost?.author || '',
    coverImage: editPost?.coverImage || '',
    tags: editPost?.tags.join(' ') || '',
    directPublish: editPost?.directPublish ?? true,
    scheduledAt: utcToAmsterdamDatetime(editPost?.scheduledAt),
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>(editPost?.images || []);
  const [isPreview, setIsPreview] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(editPost?.coverImage || null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();
  const { uploadFile } = useFileUpload();

  const isEditMode = !!editPost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert scheduled datetime to UTC timestamp if provided and not direct publish
    const scheduledAtUtc = (!formData.directPublish && formData.scheduledAt) 
      ? amsterdamDatetimeToUtc(formData.scheduledAt) 
      : undefined;
    
    // Determine published status: only true if directPublish is true
    // If scheduled, published should be false until the scheduled time arrives
    const published = formData.directPublish;
    
    const post: BlogPost = {
      id: editPost?.id || `post-${Date.now()}`,
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt,
      author: formData.author,
      coverImage: formData.coverImage || undefined,
      tags: formData.tags.split(' ').map(tag => tag.trim()).filter(Boolean),
      published: published,
      directPublish: formData.directPublish,
      timestamp: editPost?.timestamp || BigInt(Date.now() * 1000000),
      categories: editPost?.categories || [],
      images: uploadedImages,
      scheduledAt: scheduledAtUtc,
    };

    if (isEditMode) {
      updateBlogPost.mutate(post, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      createBlogPost.mutate(post, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCursorPosition(e.target.selectionStart);
    handleInputChange(e);
  };

  const validateImageFile = (file: File): string | null => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `Ongeldig bestandstype. Toegestane formaten: JPG, PNG, WebP, GIF, SVG`;
    }
    
    if (file.size > MAX_IMAGE_SIZE) {
      return `Bestand is te groot. Maximale grootte: 10 MB`;
    }
    
    return null;
  };

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadError(validationError);
      if (coverInputRef.current) {
        coverInputRef.current.value = '';
      }
      return;
    }

    setIsUploadingCover(true);

    try {
      const imagePath = `blog-covers/${Date.now()}-${file.name}`;
      const result = await uploadFile(imagePath, file);
      
      // Ensure HTTPS URL
      let imageUrl = result.url;
      if (imageUrl.startsWith('http://')) {
        imageUrl = imageUrl.replace('http://', 'https://');
      }
      
      // Update cover image in form data
      setFormData(prev => ({ ...prev, coverImage: imageUrl }));
      setCoverPreviewUrl(imageUrl);
      
      if (coverInputRef.current) {
        coverInputRef.current.value = '';
      }
      
      setUploadError(null);
    } catch (error) {
      console.error('Error uploading cover image:', error);
      setUploadError('Cover afbeelding uploaden mislukt. Probeer het opnieuw.');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      setUploadError(validationError);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsUploadingImage(true);

    try {
      const imagePath = `blog-images/${Date.now()}-${file.name}`;
      const result = await uploadFile(imagePath, file);
      
      // Ensure HTTPS URL
      let imageUrl = result.url;
      if (imageUrl.startsWith('http://')) {
        imageUrl = imageUrl.replace('http://', 'https://');
      }
      
      // Add to uploaded images list
      setUploadedImages(prev => [...prev, imageUrl]);
      
      // Insert image markdown at cursor position
      const imageMarkdown = `![${file.name}](${imageUrl})`;
      const currentContent = formData.content;
      const newContent = 
        currentContent.slice(0, cursorPosition) + 
        imageMarkdown + 
        currentContent.slice(cursorPosition);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      setUploadError(null);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Afbeelding uploaden mislukt. Probeer het opnieuw.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const triggerImageUpload = () => {
    if (contentTextareaRef.current) {
      setCursorPosition(contentTextareaRef.current.selectionStart);
    }
    fileInputRef.current?.click();
  };

  const triggerCoverUpload = () => {
    coverInputRef.current?.click();
  };

  const renderPreviewContent = (content: string) => {
    return content.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g, 
      '<img src="$2" alt="$1" class="max-w-full h-auto my-4 rounded-lg" loading="lazy" />'
    );
  };

  const formatScheduledDate = (datetimeString: string) => {
    if (!datetimeString) return '';
    
    const [datePart, timePart] = datetimeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour, minute] = timePart.split(':');
    
    return `${day}-${month}-${year} om ${hour}:${minute} (Amsterdam tijd)`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-light">
          <h2 className="text-xl font-bold text-secondary">
            {isPreview ? 'Voorbeeld Blogpost' : (isEditMode ? 'Blogpost Bewerken' : 'Nieuwe Blogpost Maken')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center px-3 py-1 text-sm text-secondary-light hover:text-secondary border border-neutral-light rounded-md"
            >
              <Eye className="w-4 h-4 mr-1" />
              {isPreview ? 'Bewerken' : 'Voorbeeld'}
            </button>
            <button
              onClick={onClose}
              className="text-secondary-light hover:text-secondary"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isPreview ? (
            <div className="prose max-w-none">
              {formData.coverImage && (
                <img
                  src={formData.coverImage}
                  alt={formData.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <h1 className="text-3xl font-bold mb-4 text-secondary">{formData.title || 'Naamloze Post'}</h1>
              <div className="text-secondary-light mb-4">
                Door {formData.author || 'Onbekende Auteur'}
                {!formData.directPublish && formData.scheduledAt && (
                  <span className="ml-4 text-sm">
                    • Gepland voor: {formatScheduledDate(formData.scheduledAt)}
                  </span>
                )}
                {formData.directPublish && (
                  <span className="ml-4 text-sm">
                    • Direct publiceren
                  </span>
                )}
              </div>
              <div 
                className="whitespace-pre-wrap text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderPreviewContent(formData.content) }}
              />
              {formData.tags && (
                <div className="mt-6">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(' ').filter(Boolean).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-neutral-light text-accent text-sm rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                ref={coverInputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(',')}
                onChange={handleCoverImageUpload}
                className="hidden"
              />

              {uploadError && (
                <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">Upload fout</p>
                    <p className="text-sm text-red-700 mt-1">{uploadError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadError(null)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-secondary mb-2">
                    Titel *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-secondary mb-2">
                    Auteur *
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-secondary mb-2">
                  Samenvatting *
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Korte beschrijving van de post..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Cover Afbeelding
                </label>
                <div className="space-y-3">
                  {coverPreviewUrl && (
                    <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={coverPreviewUrl}
                        alt="Cover voorvertoning"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={triggerCoverUpload}
                    disabled={isUploadingCover}
                    className="flex items-center space-x-2 px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isUploadingCover ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploaden...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>{coverPreviewUrl ? 'Cover Wijzigen' : 'Cover Uploaden'}</span>
                      </>
                    )}
                  </button>
                  <p className="text-xs text-secondary-light">
                    Upload een cover afbeelding (JPG, PNG, WebP, GIF, SVG - max 10 MB)
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="content" className="block text-sm font-medium text-secondary">
                    Inhoud *
                  </label>
                  <button
                    type="button"
                    onClick={triggerImageUpload}
                    disabled={isUploadingImage}
                    className="flex items-center space-x-1 text-sm text-accent hover:text-accent-dark disabled:opacity-50"
                  >
                    {isUploadingImage ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                        <span>Uploaden...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4" />
                        <span>Afbeelding Invoegen</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  ref={contentTextareaRef}
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleContentChange}
                  rows={12}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Schrijf hier je blogpost inhoud... Gebruik de 'Afbeelding Invoegen' knop om afbeeldingen toe te voegen."
                  required
                />
                <p className="text-xs text-secondary-light mt-1">
                  Tip: Klik op "Afbeelding Invoegen" om afbeeldingen te uploaden (JPG, PNG, WebP, GIF, SVG - max 10 MB). Afbeeldingen worden ingevoegd op de cursorpositie.
                </p>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-secondary mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="reizen avontuur tips (spatie gescheiden)"
                />
                <p className="text-xs text-secondary-light mt-1">
                  Gebruik spaties om tags te scheiden (bijv. "reizen avontuur tips")
                </p>
              </div>

              <div className="border border-neutral-light rounded-lg p-4 bg-blue-50 space-y-4">
                <h3 className="text-sm font-semibold text-secondary mb-3">Publicatie Opties</h3>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="directPublish"
                    name="directPublish"
                    checked={formData.directPublish}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-accent focus:ring-accent border-neutral-light rounded"
                  />
                  <label htmlFor="directPublish" className="block text-sm font-medium text-secondary">
                    Direct publiceren
                  </label>
                </div>

                {!formData.directPublish && (
                  <div className="flex items-start space-x-3 pt-2 border-t border-neutral-light">
                    <CalendarIcon className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <label htmlFor="scheduledAt" className="block text-sm font-medium text-secondary mb-2">
                        Plan publicatie (Amsterdam tijd)
                      </label>
                      <input
                        type="datetime-local"
                        id="scheduledAt"
                        name="scheduledAt"
                        value={formData.scheduledAt}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white"
                      />
                      <p className="text-xs text-secondary-light mt-2">
                        Stel een datum en tijd in (Amsterdam tijdzone) om deze post automatisch te publiceren. De post blijft verborgen tot het geplande moment.
                      </p>
                    </div>
                  </div>
                )}

                {formData.directPublish && (
                  <p className="text-xs text-secondary-light">
                    Deze post wordt direct gepubliceerd wanneer je opslaat.
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-light">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-neutral-light text-secondary rounded-lg hover:bg-neutral-light transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={createBlogPost.isPending || updateBlogPost.isPending}
                  className="flex items-center px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {(createBlogPost.isPending || updateBlogPost.isPending) ? 'Opslaan...' : (isEditMode ? 'Bijwerken' : 'Opslaan')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
