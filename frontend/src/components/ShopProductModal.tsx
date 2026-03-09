import React, { useState, useRef } from 'react';
import { X, Save, Upload, Image as ImageIcon, DollarSign, ExternalLink, Eye, Trash2, Star } from 'lucide-react';
import { useCreateShopProduct } from '../hooks/useQueries';
import { useFileUpload } from '../blob-storage/FileStorage';
import { ShopProduct } from '../backend';
import { showToast } from '../utils/toast';

interface ShopProductModalProps {
  onClose: () => void;
  product?: ShopProduct;
}

export default function ShopProductModal({ onClose, product }: ShopProductModalProps) {
  const [formData, setFormData] = useState({
    title: product?.title || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    affiliateLink: product?.affiliateLink || '',
    published: product?.published ?? true,
    popular: product?.popular ?? false,
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>(product?.images || []);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createProduct = useCreateShopProduct();
  const { uploadFile } = useFileUpload();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      showToast('Please enter a product title', 'error');
      return;
    }

    if (!formData.description.trim()) {
      showToast('Please enter a product description', 'error');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      showToast('Please enter a valid price', 'error');
      return;
    }

    if (!formData.affiliateLink.trim()) {
      showToast('Please enter an affiliate link', 'error');
      return;
    }

    if (uploadedImages.length === 0) {
      showToast('Please upload at least one product image', 'error');
      return;
    }

    const productData: ShopProduct = {
      id: product?.id || `product-${Date.now()}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      affiliateLink: formData.affiliateLink.trim(),
      images: uploadedImages,
      timestamp: product?.timestamp || BigInt(Date.now() * 1000000),
      published: formData.published,
      popular: formData.popular,
      category: 'default', // Add required category field
      inventory: BigInt(0), // Add required inventory field
      featured: false, // Add required featured field
    };

    createProduct.mutate(productData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);

    try {
      const newImageUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          showToast(`File ${file.name} is not an image`, 'error');
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          showToast(`Image ${file.name} is too large (max 10MB)`, 'error');
          continue;
        }

        const imagePath = `shop-products/${Date.now()}-${i}-${file.name}`;
        const result = await uploadFile(imagePath, file);
        newImageUrls.push(result.url);
      }

      if (newImageUrls.length > 0) {
        setUploadedImages(prev => [...prev, ...newImageUrls]);
        showToast(`${newImageUrls.length} image(s) uploaded successfully!`, 'success');
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      showToast('Failed to upload images. Please try again.', 'error');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= uploadedImages.length) return;
    
    const newImages = [...uploadedImages];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setUploadedImages(newImages);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-neutral-light">
          <h2 className="text-xl font-bold text-secondary">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-light hover:text-secondary"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Images */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Product Images * (Multiple images supported)
              </label>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImages}
                className="w-full flex items-center justify-center space-x-2 bg-neutral-light hover:bg-gray-200 text-secondary px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 transition-colors disabled:opacity-50"
              >
                {isUploadingImages ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
                ) : (
                  <Upload className="w-5 h-5" />
                )}
                <span>{isUploadingImages ? 'Uploading...' : 'Upload Product Images'}</span>
              </button>

              {/* Uploaded Images Preview */}
              {uploadedImages.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-secondary-light">
                    {uploadedImages.length} image(s) uploaded. First image will be the main product image.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-24 bg-neutral-light rounded-lg overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-accent text-white text-xs px-2 py-1 rounded">
                              Main
                            </div>
                          )}
                        </div>
                        <div className="absolute top-1 right-1 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index - 1)}
                              className="bg-black bg-opacity-70 text-white p-1 rounded text-xs"
                              title="Move left"
                            >
                              ←
                            </button>
                          )}
                          {index < uploadedImages.length - 1 && (
                            <button
                              type="button"
                              onClick={() => moveImage(index, index + 1)}
                              className="bg-black bg-opacity-70 text-white p-1 rounded text-xs"
                              title="Move right"
                            >
                              →
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white p-1 rounded text-xs"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2 text-xs text-secondary-light">
                <p>• Supported formats: JPG, PNG, WebP (max 10MB each)</p>
                <p>• Upload multiple images to create a product gallery</p>
                <p>• First image will be used as the main product image</p>
                <p>• Drag and drop or click to reorder images</p>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-secondary mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="e.g., Premium Travel Backpack"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-secondary mb-2">
                  Price (USD) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-secondary-light" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="29.99"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-secondary mb-2">
                Product Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                placeholder="Describe the product features, benefits, and why travelers will love it..."
                required
              />
            </div>

            <div>
              <label htmlFor="affiliateLink" className="block text-sm font-medium text-secondary mb-2">
                Affiliate/Purchase Link *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ExternalLink className="h-5 w-5 text-secondary-light" />
                </div>
                <input
                  type="url"
                  id="affiliateLink"
                  name="affiliateLink"
                  value={formData.affiliateLink}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="https://example.com/product-link"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-secondary-light">
                This link will open when customers click the "BUY" button
              </p>
            </div>

            {/* Visibility Settings */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-secondary">Visibility Settings</h4>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-neutral-light rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-secondary">
                  Published (visible on shop page)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="popular"
                  name="popular"
                  checked={formData.popular}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-accent focus:ring-accent border-neutral-light rounded"
                />
                <label htmlFor="popular" className="ml-2 block text-sm text-secondary">
                  <div className="flex items-center space-x-2">
                    <span>Popular (featured on homepage)</span>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                </label>
              </div>
              
              <p className="text-xs text-secondary-light">
                Popular products appear in the homepage shop section (limited to 6 products). 
                All published products appear on the dedicated shop page.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-neutral-light">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-neutral-light text-secondary rounded-lg hover:bg-neutral-light transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createProduct.isPending || isUploadingImages}
                className="flex items-center px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {createProduct.isPending ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
