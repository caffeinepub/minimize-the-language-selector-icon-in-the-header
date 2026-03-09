import React, { useState, useRef } from 'react';
import { Plus, Upload, X, Edit, Trash2, Save, Image as ImageIcon, Link, Calendar, Video, Play, Pause, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { useFileUpload } from '../blob-storage/FileStorage';
import { useGetInstagramFeedItems, useCreateInstagramFeedItem, useUpdateInstagramFeedItem, useDeleteInstagramFeedItem } from '../hooks/useQueries';
import { InstagramFeedItem } from '../backend';
import { showToast } from '../utils/toast';

export default function InstagramFeedManager() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<InstagramFeedItem | null>(null);
  const [formData, setFormData] = useState({
    caption: '',
    link: '',
    mediaFile: null as File | null,
    mediaUrl: '',
    mediaType: 'image' as 'image' | 'video',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: instagramItems, refetch } = useGetInstagramFeedItems();
  const { uploadFile } = useFileUpload();
  const createItem = useCreateInstagramFeedItem();
  const updateItem = useUpdateInstagramFeedItem();
  const deleteItem = useDeleteInstagramFeedItem();

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const resetForm = () => {
    setFormData({
      caption: '',
      link: '',
      mediaFile: null,
      mediaUrl: '',
      mediaType: 'image',
    });
    setEditingItem(null);
    setPreviewUrl(null);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    
    if (!isVideo && !isImage) {
      showToast('Please select an image or video file', 'error');
      return;
    }

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast(`File size must be less than ${isVideo ? '50MB' : '10MB'}`, 'error');
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      mediaFile: file,
      mediaType: isVideo ? 'video' : 'image'
    }));
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setUploadStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.mediaFile && !editingItem) {
      showToast('Please select a media file', 'error');
      return;
    }

    if (!formData.caption.trim()) {
      showToast('Please add a caption', 'error');
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      let mediaUrl = '';
      let mediaType: 'image' | 'video' = formData.mediaType;

      // Upload new media if provided
      if (formData.mediaFile) {
        const mediaPath = `instagram/${Date.now()}-${formData.mediaFile.name}`;
        const result = await uploadFile(mediaPath, formData.mediaFile);
        mediaUrl = result.url;
        mediaType = formData.mediaFile.type.startsWith('video/') ? 'video' : 'image';
        
        showToast('Media uploaded successfully!', 'success');
      } else if (editingItem) {
        mediaUrl = editingItem.mediaUrl;
        mediaType = editingItem.mediaType as 'image' | 'video';
      }

      // Create the Instagram feed item with backend-compatible structure
      const itemData: InstagramFeedItem = {
        id: editingItem?.id || `instagram-${Date.now()}`,
        mediaType,
        mediaUrl,
        caption: formData.caption.trim(),
        link: formData.link.trim() || undefined,
        timestamp: editingItem?.timestamp || BigInt(Date.now() * 1000000),
        published: true,
        story: false, // Add required story field (default to false for regular posts)
      };

      if (editingItem) {
        await updateItem.mutateAsync(itemData);
      } else {
        await createItem.mutateAsync(itemData);
      }

      await refetch();
      setShowAddModal(false);
      resetForm();
      setUploadStatus('success');
    } catch (error) {
      console.error('Error saving Instagram item:', error);
      setUploadStatus('error');
      showToast('Failed to save Instagram item. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (item: InstagramFeedItem) => {
    setEditingItem(item);
    setFormData({
      caption: item.caption || '',
      link: item.link || '',
      mediaFile: null,
      mediaUrl: item.mediaUrl || '',
      mediaType: (item.mediaType as 'image' | 'video') || 'image',
    });
    setPreviewUrl(item.mediaUrl || null);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this Instagram item? This action cannot be undone.')) {
      try {
        await deleteItem.mutateAsync(id);
        await refetch();
      } catch (error) {
        console.error('Error deleting Instagram item:', error);
      }
    }
  };

  const toggleVideoPlay = (videoId: string) => {
    const video = document.getElementById(`video-${videoId}`) as HTMLVideoElement;
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

  const openModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-secondary">Instagram Feed Management</h3>
          <p className="text-sm text-secondary-light mt-1">Add, edit, and manage Instagram feed items with full upload functionality</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Instagram Item</span>
        </button>
      </div>

      {/* Instagram Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {instagramItems && Array.isArray(instagramItems) && instagramItems.length > 0 ? (
          instagramItems.map((item: InstagramFeedItem) => (
            <div key={item.id} className="bg-white border border-neutral-light rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-neutral-light overflow-hidden relative">
                {item.mediaType === 'video' && item.mediaUrl ? (
                  <div className="relative w-full h-full">
                    <video
                      id={`video-${item.id}`}
                      src={item.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      onEnded={() => {
                        setPlayingVideos(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(item.id);
                          return newSet;
                        });
                      }}
                    />
                    <button
                      onClick={() => toggleVideoPlay(item.id)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-colors"
                    >
                      {playingVideos.has(item.id) ? (
                        <Pause className="w-12 h-12 text-white" />
                      ) : (
                        <Play className="w-12 h-12 text-white" />
                      )}
                    </button>
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                      <Video className="w-3 h-3" />
                      <span>Video</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={item.mediaUrl || ''}
                      alt={item.caption || 'Instagram post'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                      <ImageIcon className="w-3 h-3" />
                      <span>Image</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                {item.caption && (
                  <p className="text-secondary text-sm mb-3 line-clamp-3">{item.caption}</p>
                )}
                <div className="flex items-center justify-between text-xs text-secondary-light mb-3">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(item.timestamp)}</span>
                  </span>
                  {item.link && (
                    <span className="flex items-center space-x-1">
                      <Link className="w-3 h-3" />
                      <span>Has Link</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center space-x-1 text-secondary-light hover:text-secondary text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex items-center space-x-1 text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-accent hover:text-accent-dark text-xs"
                    >
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white border border-neutral-light rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <ImageIcon className="w-8 h-8 text-secondary-light" />
              <Video className="w-8 h-8 text-secondary-light" />
            </div>
            <p className="text-secondary-light text-lg mb-2">No Instagram items yet.</p>
            <p className="text-secondary-light text-sm mb-4">
              Start building your Instagram feed by adding your first image or video.
            </p>
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-light">
              <h2 className="text-xl font-bold text-secondary">
                {editingItem ? 'Edit Instagram Item' : 'Add Instagram Item'}
              </h2>
              <button
                onClick={closeModal}
                className="text-secondary-light hover:text-secondary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">
                  Media (Image or Video) {!editingItem && '*'}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {previewUrl ? (
                  <div className="space-y-3">
                    <div className="relative bg-neutral-light rounded-lg overflow-hidden">
                      {formData.mediaType === 'video' ? (
                        <div className="relative">
                          <video
                            src={previewUrl}
                            className="w-full h-64 object-cover"
                            controls
                            muted
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                            <Video className="w-3 h-3" />
                            <span>Video Preview</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                            <ImageIcon className="w-3 h-3" />
                            <span>Image Preview</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-secondary px-4 py-2 rounded-lg transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Change Media</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center space-x-2 bg-neutral-light hover:bg-gray-200 text-secondary px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-5 h-5" />
                      <Video className="w-5 h-5" />
                    </div>
                    <span>Upload Image or Video</span>
                  </button>
                )}

                <div className="mt-2 text-xs text-secondary-light">
                  <p>• Images: JPG, PNG, WebP (max 10MB)</p>
                  <p>• Videos: MP4, WebM (max 50MB)</p>
                  <p>• Recommended: Square format (1:1 ratio) for best display</p>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label htmlFor="caption" className="block text-sm font-medium text-secondary mb-2">
                  Caption *
                </label>
                <textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Write a compelling caption for your Instagram post..."
                  required
                />
                <div className="mt-1 text-xs text-secondary-light">
                  {formData.caption.length}/500 characters
                </div>
              </div>

              {/* Link */}
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-secondary mb-2">
                  Link (Optional)
                </label>
                <input
                  type="url"
                  id="link"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="https://instagram.com/p/..."
                />
                <div className="mt-1 text-xs text-secondary-light">
                  Optional link to the original Instagram post or related content
                </div>
              </div>

              {/* Status Messages */}
              {uploadStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Instagram item saved successfully!</span>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Failed to save Instagram item. Please try again.</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-light">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-neutral-light text-secondary rounded-lg hover:bg-neutral-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || (!formData.mediaFile && !editingItem) || !formData.caption.trim()}
                  className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isUploading ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
        <div className="flex items-start space-x-3">
          <div className="flex items-center space-x-1">
            <ImageIcon className="w-5 h-5 text-pink-600" />
            <Video className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h5 className="font-medium text-secondary mb-2">Instagram Feed Management</h5>
            <ul className="text-sm text-secondary-light space-y-1">
              <li>• Upload images and videos directly to your Instagram feed</li>
              <li>• All uploaded content is stored in the backend and instantly visible to all users</li>
              <li>• Edit captions, links, and replace media files anytime</li>
              <li>• Items appear in the Instagram tab on your homepage for all visitors</li>
              <li>• Supports both images (JPG, PNG, WebP) and videos (MP4, WebM)</li>
              <li>• Changes take effect immediately across your entire website for all users</li>
              <li>• Content is synchronized across all devices and browsers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
