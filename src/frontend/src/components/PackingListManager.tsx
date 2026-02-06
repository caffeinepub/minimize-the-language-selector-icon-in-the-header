import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Package,
  Settings,
  Copy,
  RotateCcw
} from 'lucide-react';

interface PackingItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  defaultSelected: boolean;
}

interface PackingCategory {
  id: string;
  name: string;
  items: PackingItem[];
  subcategories?: {
    normal: PackingItem[];
    men: PackingItem[];
    women: PackingItem[];
  };
}

// Default packing list data (same as in PackingList.tsx)
const defaultPackingData: PackingCategory[] = [
  {
    id: 'clothing',
    name: 'Clothing',
    items: [
      { id: 'shirts', name: 'T-shirts/Shirts', category: 'clothing', defaultSelected: false },
      { id: 'pants', name: 'Pants/Jeans', category: 'clothing', defaultSelected: false },
      { id: 'shorts', name: 'Shorts', category: 'clothing', defaultSelected: false },
      { id: 'underwear', name: 'Underwear', category: 'clothing', defaultSelected: false },
      { id: 'socks', name: 'Socks', category: 'clothing', defaultSelected: false },
      { id: 'sleepwear', name: 'Sleepwear/Pajamas', category: 'clothing', defaultSelected: false },
      { id: 'jacket', name: 'Jacket/Coat', category: 'clothing', defaultSelected: false },
      { id: 'sweater', name: 'Sweater/Hoodie', category: 'clothing', defaultSelected: false },
      { id: 'dress', name: 'Dress/Formal wear', category: 'clothing', defaultSelected: false },
      { id: 'swimwear', name: 'Swimwear', category: 'clothing', defaultSelected: false },
      { id: 'hat', name: 'Hat/Cap', category: 'clothing', defaultSelected: false },
      { id: 'scarf', name: 'Scarf', category: 'clothing', defaultSelected: false },
      { id: 'gloves', name: 'Gloves', category: 'clothing', defaultSelected: false },
    ]
  },
  {
    id: 'footwear',
    name: 'Footwear',
    items: [
      { id: 'sneakers', name: 'Sneakers/Walking shoes', category: 'footwear', defaultSelected: false },
      { id: 'dress-shoes', name: 'Dress shoes', category: 'footwear', defaultSelected: false },
      { id: 'sandals', name: 'Sandals/Flip-flops', category: 'footwear', defaultSelected: false },
      { id: 'boots', name: 'Boots', category: 'footwear', defaultSelected: false },
      { id: 'slippers', name: 'Slippers', category: 'footwear', defaultSelected: false },
    ]
  },
  {
    id: 'toiletries',
    name: 'Toiletries',
    items: [],
    subcategories: {
      normal: [
        { id: 'toothbrush', name: 'Toothbrush', category: 'toiletries', subcategory: 'normal', defaultSelected: false },
        { id: 'toothpaste', name: 'Toothpaste', category: 'toiletries', subcategory: 'normal', defaultSelected: false },
        { id: 'shampoo', name: 'Shampoo', category: 'toiletries', subcategory: 'normal', defaultSelected: false },
        { id: 'conditioner', name: 'Conditioner', category: 'toiletries', subcategory: 'normal', defaultSelected: false },
        { id: 'body-wash', name: 'Body wash/Soap', category: 'toiletries', subcategory: 'normal', defaultSelected: false },
        { id: 'deodorant', name: 'Deodorant', category: 'toiletries', subcategory: 'normal', defaultSelected: false },
        { id: 'sunscreen', name: 'Sunscreen', category: 'toiletries', subcategory: 'normal', defaultSelected: false },
        { id: 'moisturizer', name: 'Moisturizer', category: 'toiletries', subcategory: 'normal', defaultSelected: false },
        { id: 'lip-balm', name: 'Lip balm', category: 'toiletries', subcategory: 'normal', defaultSelected: false },
        { id: 'hand-sanitizer', name: 'Hand sanitizer', category: 'toiletries', subcategory: 'normal', defaultSelected: false },
      ],
      men: [
        { id: 'razor', name: 'Razor', category: 'toiletries', subcategory: 'men', defaultSelected: false },
        { id: 'shaving-cream', name: 'Shaving cream', category: 'toiletries', subcategory: 'men', defaultSelected: false },
        { id: 'aftershave', name: 'Aftershave', category: 'toiletries', subcategory: 'men', defaultSelected: false },
        { id: 'cologne', name: 'Cologne', category: 'toiletries', subcategory: 'men', defaultSelected: false },
      ],
      women: [
        { id: 'makeup', name: 'Makeup', category: 'toiletries', subcategory: 'women', defaultSelected: false },
        { id: 'makeup-remover', name: 'Makeup remover', category: 'toiletries', subcategory: 'women', defaultSelected: false },
        { id: 'perfume', name: 'Perfume', category: 'toiletries', subcategory: 'women', defaultSelected: false },
        { id: 'hair-ties', name: 'Hair ties/clips', category: 'toiletries', subcategory: 'women', defaultSelected: false },
        { id: 'feminine-products', name: 'Feminine hygiene products', category: 'toiletries', subcategory: 'women', defaultSelected: false },
      ]
    }
  },
  {
    id: 'electronics',
    name: 'Electronics',
    items: [
      { id: 'phone', name: 'Phone', category: 'electronics', defaultSelected: false },
      { id: 'phone-charger', name: 'Phone charger', category: 'electronics', defaultSelected: false },
      { id: 'power-bank', name: 'Power bank', category: 'electronics', defaultSelected: false },
      { id: 'camera', name: 'Camera', category: 'electronics', defaultSelected: false },
      { id: 'camera-charger', name: 'Camera charger', category: 'electronics', defaultSelected: false },
      { id: 'laptop', name: 'Laptop', category: 'electronics', defaultSelected: false },
      { id: 'laptop-charger', name: 'Laptop charger', category: 'electronics', defaultSelected: false },
      { id: 'headphones', name: 'Headphones', category: 'electronics', defaultSelected: false },
      { id: 'adapter', name: 'Travel adapter', category: 'electronics', defaultSelected: false },
      { id: 'extension-cord', name: 'Extension cord', category: 'electronics', defaultSelected: false },
    ]
  },
  {
    id: 'documents',
    name: 'Documents & Money',
    items: [
      { id: 'passport', name: 'Passport', category: 'documents', defaultSelected: false },
      { id: 'visa', name: 'Visa (if required)', category: 'documents', defaultSelected: false },
      { id: 'id-card', name: 'ID card/Driver\'s license', category: 'documents', defaultSelected: false },
      { id: 'tickets', name: 'Flight/train tickets', category: 'documents', defaultSelected: false },
      { id: 'hotel-confirmation', name: 'Hotel confirmations', category: 'documents', defaultSelected: false },
      { id: 'insurance', name: 'Travel insurance documents', category: 'documents', defaultSelected: false },
      { id: 'credit-cards', name: 'Credit/debit cards', category: 'documents', defaultSelected: false },
      { id: 'cash', name: 'Cash (local currency)', category: 'documents', defaultSelected: false },
      { id: 'emergency-contacts', name: 'Emergency contact list', category: 'documents', defaultSelected: false },
    ]
  },
  {
    id: 'health',
    name: 'Health & Safety',
    items: [
      { id: 'medications', name: 'Prescription medications', category: 'health', defaultSelected: false },
      { id: 'first-aid', name: 'First aid kit', category: 'health', defaultSelected: false },
      { id: 'pain-relief', name: 'Pain relief (ibuprofen, etc.)', category: 'health', defaultSelected: false },
      { id: 'band-aids', name: 'Band-aids', category: 'health', defaultSelected: false },
      { id: 'thermometer', name: 'Thermometer', category: 'health', defaultSelected: false },
      { id: 'hand-sanitizer-health', name: 'Hand sanitizer', category: 'health', defaultSelected: false },
      { id: 'masks', name: 'Face masks', category: 'health', defaultSelected: false },
      { id: 'insect-repellent', name: 'Insect repellent', category: 'health', defaultSelected: false },
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    items: [
      { id: 'sunglasses', name: 'Sunglasses', category: 'accessories', defaultSelected: false },
      { id: 'watch', name: 'Watch', category: 'accessories', defaultSelected: false },
      { id: 'jewelry', name: 'Jewelry', category: 'accessories', defaultSelected: false },
      { id: 'belt', name: 'Belt', category: 'accessories', defaultSelected: false },
      { id: 'wallet', name: 'Wallet', category: 'accessories', defaultSelected: false },
      { id: 'backpack', name: 'Backpack/Day bag', category: 'accessories', defaultSelected: false },
      { id: 'umbrella', name: 'Umbrella', category: 'accessories', defaultSelected: false },
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    items: [
      { id: 'books', name: 'Books/E-reader', category: 'entertainment', defaultSelected: false },
      { id: 'tablet', name: 'Tablet', category: 'entertainment', defaultSelected: false },
      { id: 'games', name: 'Travel games', category: 'entertainment', defaultSelected: false },
      { id: 'journal', name: 'Travel journal', category: 'entertainment', defaultSelected: false },
      { id: 'pen', name: 'Pen/Pencil', category: 'entertainment', defaultSelected: false },
    ]
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    items: [
      { id: 'laundry-bag', name: 'Laundry bag', category: 'miscellaneous', defaultSelected: false },
      { id: 'plastic-bags', name: 'Plastic bags', category: 'miscellaneous', defaultSelected: false },
      { id: 'travel-pillow', name: 'Travel pillow', category: 'miscellaneous', defaultSelected: false },
      { id: 'eye-mask', name: 'Eye mask', category: 'miscellaneous', defaultSelected: false },
      { id: 'earplugs', name: 'Earplugs', category: 'miscellaneous', defaultSelected: false },
      { id: 'snacks', name: 'Snacks', category: 'miscellaneous', defaultSelected: false },
      { id: 'water-bottle', name: 'Water bottle', category: 'miscellaneous', defaultSelected: false },
      { id: 'travel-locks', name: 'Travel locks', category: 'miscellaneous', defaultSelected: false },
    ]
  }
];

export default function PackingListManager() {
  const [packingData, setPackingData] = useState<PackingCategory[]>(defaultPackingData);
  const [activeTab, setActiveTab] = useState<'categories' | 'items'>('categories');
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PackingCategory | null>(null);
  const [editingItem, setEditingItem] = useState<{ item: PackingItem; categoryId: string; subcategory?: string } | null>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    hasSubcategories: false
  });

  const [itemForm, setItemForm] = useState({
    name: '',
    categoryId: '',
    subcategory: '',
    defaultSelected: false
  });

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      hasSubcategories: false
    });
    setEditingCategory(null);
  };

  const resetItemForm = () => {
    setItemForm({
      name: '',
      categoryId: '',
      subcategory: '',
      defaultSelected: false
    });
    setEditingItem(null);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) {
      alert('Please enter a category name');
      return;
    }

    const category: PackingCategory = {
      id: editingCategory?.id || `category-${Date.now()}`,
      name: categoryForm.name,
      items: editingCategory?.items || [],
      subcategories: categoryForm.hasSubcategories ? {
        normal: editingCategory?.subcategories?.normal || [],
        men: editingCategory?.subcategories?.men || [],
        women: editingCategory?.subcategories?.women || []
      } : undefined
    };

    if (editingCategory) {
      setPackingData(prev => prev.map(c => c.id === category.id ? category : c));
    } else {
      setPackingData(prev => [...prev, category]);
    }

    setShowCategoryModal(false);
    resetCategoryForm();
  };

  const handleSaveItem = () => {
    if (!itemForm.name.trim() || !itemForm.categoryId) {
      alert('Please fill in all required fields');
      return;
    }

    const item: PackingItem = {
      id: editingItem?.item.id || `item-${Date.now()}`,
      name: itemForm.name,
      category: itemForm.categoryId,
      subcategory: itemForm.subcategory || undefined,
      defaultSelected: itemForm.defaultSelected
    };

    setPackingData(prev => prev.map(category => {
      if (category.id === itemForm.categoryId) {
        if (itemForm.subcategory && category.subcategories) {
          const subcategoryKey = itemForm.subcategory as keyof typeof category.subcategories;
          return {
            ...category,
            subcategories: {
              ...category.subcategories,
              [subcategoryKey]: editingItem 
                ? category.subcategories[subcategoryKey].map(i => i.id === item.id ? item : i)
                : [...category.subcategories[subcategoryKey], item]
            }
          };
        } else {
          return {
            ...category,
            items: editingItem 
              ? category.items.map(i => i.id === item.id ? item : i)
              : [...category.items, item]
          };
        }
      }
      return category;
    }));

    setShowItemModal(false);
    resetItemForm();
  };

  const handleEditCategory = (category: PackingCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      hasSubcategories: !!category.subcategories
    });
    setShowCategoryModal(true);
  };

  const handleEditItem = (item: PackingItem, categoryId: string, subcategory?: string) => {
    setEditingItem({ item, categoryId, subcategory });
    setItemForm({
      name: item.name,
      categoryId,
      subcategory: subcategory || '',
      defaultSelected: item.defaultSelected
    });
    setShowItemModal(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category and all its items?')) {
      setPackingData(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleDeleteItem = (categoryId: string, itemId: string, subcategory?: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setPackingData(prev => prev.map(category => {
        if (category.id === categoryId) {
          if (subcategory && category.subcategories) {
            const subcategoryKey = subcategory as keyof typeof category.subcategories;
            return {
              ...category,
              subcategories: {
                ...category.subcategories,
                [subcategoryKey]: category.subcategories[subcategoryKey].filter(i => i.id !== itemId)
              }
            };
          } else {
            return {
              ...category,
              items: category.items.filter(i => i.id !== itemId)
            };
          }
        }
        return category;
      }));
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= packingData.length) return;
    
    const newCategories = [...packingData];
    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];
    setPackingData(newCategories);
  };

  const getTotalItemsInCategory = (category: PackingCategory): number => {
    let total = category.items.length;
    if (category.subcategories) {
      total += Object.values(category.subcategories).reduce((acc, items) => acc + items.length, 0);
    }
    return total;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-secondary">Packing List Management</h3>
        <p className="text-sm text-secondary-light mt-1">Manage categories and items for the packing list tool</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            activeTab === 'categories'
              ? 'bg-white text-accent shadow-sm'
              : 'text-secondary-light hover:text-secondary'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Categories</span>
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
            activeTab === 'items'
              ? 'bg-white text-accent shadow-sm'
              : 'text-secondary-light hover:text-secondary'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Items</span>
        </button>
      </div>

      {/* Categories Management */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-secondary">Packing Categories</h4>
            <button
              onClick={() => {
                resetCategoryForm();
                setShowCategoryModal(true);
              }}
              className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="space-y-3">
            {packingData.map((category, index) => (
              <div key={category.id} className="bg-white border border-neutral-light rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Package className="w-5 h-5 text-accent" />
                      <h5 className="font-semibold text-secondary">{category.name}</h5>
                      {category.subcategories && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          Has Subcategories
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-secondary-light">
                      {getTotalItemsInCategory(category)} items
                      {category.subcategories && (
                        <span className="ml-2">
                          (Normal: {category.subcategories.normal.length}, 
                          Men: {category.subcategories.men.length}, 
                          Women: {category.subcategories.women.length})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => moveCategory(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-secondary-light hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveCategory(index, 'down')}
                      disabled={index === packingData.length - 1}
                      className="p-1 text-secondary-light hover:text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-1 text-secondary-light hover:text-secondary"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {packingData.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Package className="w-12 h-12 text-secondary-light mx-auto mb-4" />
                <p className="text-secondary-light">No categories yet.</p>
                <button
                  onClick={() => {
                    resetCategoryForm();
                    setShowCategoryModal(true);
                  }}
                  className="mt-4 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Add Your First Category
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Items Management */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-secondary">Packing Items</h4>
            <button
              onClick={() => {
                resetItemForm();
                setShowItemModal(true);
              }}
              className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-4">
            {packingData.map(category => (
              <div key={category.id} className="bg-white border border-neutral-light rounded-lg p-4">
                <h5 className="font-semibold text-secondary mb-3 flex items-center space-x-2">
                  <Package className="w-4 h-4 text-accent" />
                  <span>{category.name}</span>
                </h5>

                {/* Regular Items */}
                {category.items.length > 0 && (
                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {category.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-secondary">{item.name}</span>
                            {item.defaultSelected && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleEditItem(item, category.id)}
                              className="p-1 text-secondary-light hover:text-secondary"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(category.id, item.id)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subcategory Items */}
                {category.subcategories && (
                  <div className="space-y-3">
                    {Object.entries(category.subcategories).map(([subcategoryKey, items]) => (
                      <div key={subcategoryKey}>
                        <h6 className={`text-sm font-medium mb-2 ${
                          subcategoryKey === 'men' ? 'text-blue-600' :
                          subcategoryKey === 'women' ? 'text-pink-600' : 'text-secondary'
                        }`}>
                          {subcategoryKey.charAt(0).toUpperCase() + subcategoryKey.slice(1)} Toiletries
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {items.map(item => (
                            <div key={item.id} className={`flex items-center justify-between p-2 rounded border ${
                              subcategoryKey === 'men' ? 'bg-blue-50' :
                              subcategoryKey === 'women' ? 'bg-pink-50' : 'bg-gray-50'
                            }`}>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-secondary">{item.name}</span>
                                {item.defaultSelected && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleEditItem(item, category.id, subcategoryKey)}
                                  className="p-1 text-secondary-light hover:text-secondary"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(category.id, item.id, subcategoryKey)}
                                  className="p-1 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Item to Category */}
                <button
                  onClick={() => {
                    resetItemForm();
                    setItemForm(prev => ({ ...prev, categoryId: category.id }));
                    setShowItemModal(true);
                  }}
                  className="mt-3 text-sm text-accent hover:text-accent-dark flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add item to {category.name}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-neutral-light">
              <h2 className="text-xl font-bold text-secondary">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  resetCategoryForm();
                }}
                className="text-secondary-light hover:text-secondary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="e.g., Clothing"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasSubcategories"
                  checked={categoryForm.hasSubcategories}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, hasSubcategories: e.target.checked }))}
                  className="h-4 w-4 text-accent focus:ring-accent border-neutral-light rounded"
                />
                <label htmlFor="hasSubcategories" className="ml-2 block text-sm text-secondary">
                  Has subcategories (like Toiletries)
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-light">
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    resetCategoryForm();
                  }}
                  className="px-6 py-2 border border-neutral-light text-secondary rounded-lg hover:bg-neutral-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCategory ? 'Update' : 'Add'} Category</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-neutral-light">
              <h2 className="text-xl font-bold text-secondary">
                {editingItem ? 'Edit Item' : 'Add Item'}
              </h2>
              <button
                onClick={() => {
                  setShowItemModal(false);
                  resetItemForm();
                }}
                className="text-secondary-light hover:text-secondary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Item Name *</label>
                <input
                  type="text"
                  value={itemForm.name}
                  onChange={(e) => setItemForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="e.g., T-shirts"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Category *</label>
                <select
                  value={itemForm.categoryId}
                  onChange={(e) => {
                    setItemForm(prev => ({ ...prev, categoryId: e.target.value, subcategory: '' }));
                  }}
                  className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {packingData.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Subcategory for Toiletries */}
              {itemForm.categoryId === 'toiletries' && (
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Subcategory</label>
                  <select
                    value={itemForm.subcategory}
                    onChange={(e) => setItemForm(prev => ({ ...prev, subcategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    <option value="">Select subcategory</option>
                    <option value="normal">General</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="defaultSelected"
                  checked={itemForm.defaultSelected}
                  onChange={(e) => setItemForm(prev => ({ ...prev, defaultSelected: e.target.checked }))}
                  className="h-4 w-4 text-accent focus:ring-accent border-neutral-light rounded"
                />
                <label htmlFor="defaultSelected" className="ml-2 block text-sm text-secondary">
                  Selected by default
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-neutral-light">
                <button
                  onClick={() => {
                    setShowItemModal(false);
                    resetItemForm();
                  }}
                  className="px-6 py-2 border border-neutral-light text-secondary rounded-lg hover:bg-neutral-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingItem ? 'Update' : 'Add'} Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
