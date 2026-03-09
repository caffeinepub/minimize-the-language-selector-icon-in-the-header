import React, { useState, useRef } from 'react';
import { Plus, Upload, X, Edit, Trash2, Save, Image as ImageIcon, DollarSign, ExternalLink, Calendar, Eye, AlertCircle, CheckCircle, ShoppingBag, Star, Crown } from 'lucide-react';
import { useFileUpload } from '../blob-storage/FileStorage';
import { useGetAllShopProducts, useCreateShopProduct, useUpdateShopProduct, useDeleteShopProduct } from '../hooks/useQueries';
import { ShopProduct } from '../backend';
import { showToast } from '../utils/toast';

export default function ShopProductManager() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    affiliateLink: '',
    published: true,
    popular: false,
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: shopProducts, refetch } = useGetAllShopProducts();
  const { uploadFile } = useFileUpload();
  const createProduct = useCreateShopProduct();
  const updateProduct = useUpdateShopProduct();
  const deleteProduct = useDeleteShopProduct();

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      affiliateLink: '',
      published: true,
      popular: false,
    });
    setUploadedImages([]);
    setEditingProduct(null);
    setUploadStatus('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus('idle');

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
        setUploadStatus('success');
        showToast(`${newImageUrls.length} image(s) uploaded successfully!`, 'success');
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setUploadStatus('error');
      showToast('Failed to upload images. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const productData: ShopProduct = {
        id: editingProduct?.id || `product-${Date.now()}`,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        affiliateLink: formData.affiliateLink.trim(),
        images: uploadedImages,
        timestamp: editingProduct?.timestamp || BigInt(Date.now() * 1000000),
        published: formData.published,
        popular: formData.popular,
        category: 'default', // Add required category field
        inventory: BigInt(0), // Add required inventory field
        featured: false, // Add required featured field
      };

      if (editingProduct) {
        await updateProduct.mutateAsync(productData);
      } else {
        await createProduct.mutateAsync(productData);
      }

      await refetch();
      setShowAddModal(false);
      resetForm();
      setUploadStatus('success');
    } catch (error) {
      console.error('Error saving product:', error);
      setUploadStatus('error');
      showToast('Failed to save product. Please try again.', 'error');
    }
  };

  const handleEdit = (product: ShopProduct) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      affiliateLink: product.affiliateLink,
      published: product.published,
      popular: product.popular || false,
    });
    setUploadedImages(product.images || []);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await deleteProduct.mutateAsync(id);
        await refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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
          <h3 className="text-lg font-semibold text-secondary">Shop Product Management</h3>
          <p className="text-sm text-secondary-light mt-1">Add, edit, and manage shop products with multiple image upload functionality</p>
        </div>
        <button
          onClick={openModal}
          className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shopProducts && Array.isArray(shopProducts) && shopProducts.length > 0 ? (
          shopProducts.map((product: ShopProduct) => (
            <div key={product.id} className="bg-white border border-neutral-light rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-neutral-light overflow-hidden relative">
                {product.images && product.images.length > 0 ? (
                  <div className="relative w-full h-full">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {product.images.length > 1 && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>{product.images.length} photos</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-neutral-light flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-secondary-light" />
                  </div>
                )}
                
                {/* Price Badge */}
                <div className="absolute top-2 left-2 bg-accent text-white px-2 py-1 rounded font-semibold text-sm">
                  {formatPrice(product.price)}
                </div>
                
                {/* Status Badges */}
                <div className="absolute bottom-2 right-2 flex space-x-1">
                  {product.popular && (
                    <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>Popular</span>
                    </div>
                  )}
                  <div className={`text-xs px-2 py-1 rounded ${
                    product.published 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {product.published ? 'Published' : 'Draft'}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-secondary line-clamp-2 flex-1">{product.title}</h4>
                  {product.popular && (
                    <div className="ml-2 flex-shrink-0" title="Featured on homepage">
                      <Crown className="w-4 h-4 text-yellow-500" />
                    </div>
                  )}
                </div>
                <p className="text-secondary-light text-sm mb-3 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between text-xs text-secondary-light mb-3">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(product.timestamp)}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ExternalLink className="w-3 h-3" />
                    <span>Has Link</span>
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex items-center space-x-1 text-secondary-light hover:text-secondary text-xs px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex items-center space-x-1 text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-accent hover:text-accent-dark text-xs"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View Link</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white border border-neutral-light rounded-lg">
            <ShoppingBag className="w-12 h-12 text-secondary-light mx-auto mb-4" />
            <p className="text-secondary-light text-lg mb-2">No products yet.</p>
            <p className="text-secondary-light text-sm mb-4">
              Start building your shop by adding your first product.
            </p>
            <button
              onClick={openModal}
              className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
            >
              Add Your First Product
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-neutral-light">
              <h2 className="text-xl font-bold text-secondary">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={closeModal}
                className="text-secondary-light hover:text-secondary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center space-x-2 bg-neutral-light hover:bg-gray-200 text-secondary px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <span>{isUploading ? 'Uploading...' : 'Upload Product Images'}</span>
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
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-xs text-secondary-light">
                  <p>• Supported formats: JPG, PNG, WebP (max 10MB each)</p>
                  <p>• Upload multiple images to create a product gallery</p>
                  <p>• First image will be used as the main product image</p>
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
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      step="0.01"
                      min="0"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      placeholder="29.99"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-secondary mb-2">
                  Product Description *
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Describe the product features, benefits, and why travelers will love it..."
                  required
                />
              </div>

              {/* Affiliate Link */}
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
                    value={formData.affiliateLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, affiliateLink: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    placeholder="https://example.com/product-link"
                    required
                  />
                </div>
                <div className="mt-1 text-xs text-secondary-light">
                  This link will open when customers click the "BUY" button
                </div>
              </div>

              {/* Visibility Settings */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-secondary">Visibility Settings</h4>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
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
                    checked={formData.popular}
                    onChange={(e) => setFormData(prev => ({ ...prev, popular: e.target.checked }))}
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

              {/* Status Messages */}
              {uploadStatus === 'success' && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Product saved successfully!</span>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Failed to save product. Please try again.</span>
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
                  disabled={isUploading || uploadedImages.length === 0 || !formData.title.trim() || !formData.description.trim() || !formData.price || !formData.affiliateLink.trim()}
                  className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isUploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Add Product'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start space-x-3">
          <ShoppingBag className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h5 className="font-medium text-secondary mb-2">Shop Product Management</h5>
            <ul className="text-sm text-secondary-light space-y-1">
              <li>• Upload multiple product images to create attractive product galleries</li>
              <li>• All uploaded products are stored in the backend and instantly visible to all users</li>
              <li>• Edit product details, images, prices, and affiliate links anytime</li>
              <li>• Mark products as "Popular" to feature them on the homepage (limited to 6 products)</li>
              <li>• Products appear in the shop section on your homepage and dedicated shop page</li>
              <li>• Supports multiple image formats (JPG, PNG, WebP) up to 10MB each</li>
              <li>• Changes take effect immediately across your entire website for all users</li>
              <li>• Affiliate links open in new tabs when customers click "BUY" buttons</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
