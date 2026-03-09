import React, { useState } from 'react';
import { Package, Home, Download, Plus, X, Search, Filter, Share2 } from 'lucide-react';
import { useFileUrl } from '../blob-storage/FileStorage';
import { showToast } from '../utils/toast';

interface PackingItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  selected: boolean;
  isCustom?: boolean;
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

// Default packing list data
const defaultPackingData: PackingCategory[] = [
  {
    id: 'clothing',
    name: 'Clothing',
    items: [
      { id: 'shirts', name: 'T-shirts/Shirts', category: 'clothing', selected: false },
      { id: 'pants', name: 'Pants/Jeans', category: 'clothing', selected: false },
      { id: 'shorts', name: 'Shorts', category: 'clothing', selected: false },
      { id: 'underwear', name: 'Underwear', category: 'clothing', selected: false },
      { id: 'socks', name: 'Socks', category: 'clothing', selected: false },
      { id: 'sleepwear', name: 'Sleepwear/Pajamas', category: 'clothing', selected: false },
      { id: 'jacket', name: 'Jacket/Coat', category: 'clothing', selected: false },
      { id: 'sweater', name: 'Sweater/Hoodie', category: 'clothing', selected: false },
      { id: 'dress', name: 'Dress/Formal wear', category: 'clothing', selected: false },
      { id: 'swimwear', name: 'Swimwear', category: 'clothing', selected: false },
      { id: 'hat', name: 'Hat/Cap', category: 'clothing', selected: false },
      { id: 'scarf', name: 'Scarf', category: 'clothing', selected: false },
      { id: 'gloves', name: 'Gloves', category: 'clothing', selected: false },
    ]
  },
  {
    id: 'footwear',
    name: 'Footwear',
    items: [
      { id: 'sneakers', name: 'Sneakers/Walking shoes', category: 'footwear', selected: false },
      { id: 'dress-shoes', name: 'Dress shoes', category: 'footwear', selected: false },
      { id: 'sandals', name: 'Sandals/Flip-flops', category: 'footwear', selected: false },
      { id: 'boots', name: 'Boots', category: 'footwear', selected: false },
      { id: 'slippers', name: 'Slippers', category: 'footwear', selected: false },
    ]
  },
  {
    id: 'toiletries',
    name: 'Toiletries',
    items: [],
    subcategories: {
      normal: [
        { id: 'toothbrush', name: 'Toothbrush', category: 'toiletries', subcategory: 'normal', selected: false },
        { id: 'toothpaste', name: 'Toothpaste', category: 'toiletries', subcategory: 'normal', selected: false },
        { id: 'shampoo', name: 'Shampoo', category: 'toiletries', subcategory: 'normal', selected: false },
        { id: 'conditioner', name: 'Conditioner', category: 'toiletries', subcategory: 'normal', selected: false },
        { id: 'body-wash', name: 'Body wash/Soap', category: 'toiletries', subcategory: 'normal', selected: false },
        { id: 'deodorant', name: 'Deodorant', category: 'toiletries', subcategory: 'normal', selected: false },
        { id: 'sunscreen', name: 'Sunscreen', category: 'toiletries', subcategory: 'normal', selected: false },
        { id: 'moisturizer', name: 'Moisturizer', category: 'toiletries', subcategory: 'normal', selected: false },
        { id: 'lip-balm', name: 'Lip balm', category: 'toiletries', subcategory: 'normal', selected: false },
        { id: 'hand-sanitizer', name: 'Hand sanitizer', category: 'toiletries', subcategory: 'normal', selected: false },
      ],
      men: [
        { id: 'razor', name: 'Razor', category: 'toiletries', subcategory: 'men', selected: false },
        { id: 'shaving-cream', name: 'Shaving cream', category: 'toiletries', subcategory: 'men', selected: false },
        { id: 'aftershave', name: 'Aftershave', category: 'toiletries', subcategory: 'men', selected: false },
        { id: 'cologne', name: 'Cologne', category: 'toiletries', subcategory: 'men', selected: false },
      ],
      women: [
        { id: 'makeup', name: 'Makeup', category: 'toiletries', subcategory: 'women', selected: false },
        { id: 'makeup-remover', name: 'Makeup remover', category: 'toiletries', subcategory: 'women', selected: false },
        { id: 'perfume', name: 'Perfume', category: 'toiletries', subcategory: 'women', selected: false },
        { id: 'hair-ties', name: 'Hair ties/clips', category: 'toiletries', subcategory: 'women', selected: false },
        { id: 'feminine-products', name: 'Feminine hygiene products', category: 'toiletries', subcategory: 'women', selected: false },
      ]
    }
  },
  {
    id: 'electronics',
    name: 'Electronics',
    items: [
      { id: 'phone', name: 'Phone', category: 'electronics', selected: false },
      { id: 'phone-charger', name: 'Phone charger', category: 'electronics', selected: false },
      { id: 'power-bank', name: 'Power bank', category: 'electronics', selected: false },
      { id: 'camera', name: 'Camera', category: 'electronics', selected: false },
      { id: 'camera-charger', name: 'Camera charger', category: 'electronics', selected: false },
      { id: 'laptop', name: 'Laptop', category: 'electronics', selected: false },
      { id: 'laptop-charger', name: 'Laptop charger', category: 'electronics', selected: false },
      { id: 'headphones', name: 'Headphones', category: 'electronics', selected: false },
      { id: 'adapter', name: 'Travel adapter', category: 'electronics', selected: false },
      { id: 'extension-cord', name: 'Extension cord', category: 'electronics', selected: false },
    ]
  },
  {
    id: 'documents',
    name: 'Documents & Money',
    items: [
      { id: 'passport', name: 'Passport', category: 'documents', selected: false },
      { id: 'visa', name: 'Visa (if required)', category: 'documents', selected: false },
      { id: 'id-card', name: 'ID card/Driver\'s license', category: 'documents', selected: false },
      { id: 'tickets', name: 'Flight/train tickets', category: 'documents', selected: false },
      { id: 'hotel-confirmation', name: 'Hotel confirmations', category: 'documents', selected: false },
      { id: 'insurance', name: 'Travel insurance documents', category: 'documents', selected: false },
      { id: 'credit-cards', name: 'Credit/debit cards', category: 'documents', selected: false },
      { id: 'cash', name: 'Cash (local currency)', category: 'documents', selected: false },
      { id: 'emergency-contacts', name: 'Emergency contact list', category: 'documents', selected: false },
    ]
  },
  {
    id: 'health',
    name: 'Health & Safety',
    items: [
      { id: 'medications', name: 'Prescription medications', category: 'health', selected: false },
      { id: 'first-aid', name: 'First aid kit', category: 'health', selected: false },
      { id: 'pain-relief', name: 'Pain relief (ibuprofen, etc.)', category: 'health', selected: false },
      { id: 'band-aids', name: 'Band-aids', category: 'health', selected: false },
      { id: 'thermometer', name: 'Thermometer', category: 'health', selected: false },
      { id: 'hand-sanitizer-health', name: 'Hand sanitizer', category: 'health', selected: false },
      { id: 'masks', name: 'Face masks', category: 'health', selected: false },
      { id: 'insect-repellent', name: 'Insect repellent', category: 'health', selected: false },
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    items: [
      { id: 'sunglasses', name: 'Sunglasses', category: 'accessories', selected: false },
      { id: 'watch', name: 'Watch', category: 'accessories', selected: false },
      { id: 'jewelry', name: 'Jewelry', category: 'accessories', selected: false },
      { id: 'belt', name: 'Belt', category: 'accessories', selected: false },
      { id: 'wallet', name: 'Wallet', category: 'accessories', selected: false },
      { id: 'backpack', name: 'Backpack/Day bag', category: 'accessories', selected: false },
      { id: 'umbrella', name: 'Umbrella', category: 'accessories', selected: false },
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    items: [
      { id: 'books', name: 'Books/E-reader', category: 'entertainment', selected: false },
      { id: 'tablet', name: 'Tablet', category: 'entertainment', selected: false },
      { id: 'games', name: 'Travel games', category: 'entertainment', selected: false },
      { id: 'journal', name: 'Travel journal', category: 'entertainment', selected: false },
      { id: 'pen', name: 'Pen/Pencil', category: 'entertainment', selected: false },
    ]
  },
  {
    id: 'miscellaneous',
    name: 'Miscellaneous',
    items: [
      { id: 'laundry-bag', name: 'Laundry bag', category: 'miscellaneous', selected: false },
      { id: 'plastic-bags', name: 'Plastic bags', category: 'miscellaneous', selected: false },
      { id: 'travel-pillow', name: 'Travel pillow', category: 'miscellaneous', selected: false },
      { id: 'eye-mask', name: 'Eye mask', category: 'miscellaneous', selected: false },
      { id: 'earplugs', name: 'Earplugs', category: 'miscellaneous', selected: false },
      { id: 'snacks', name: 'Snacks', category: 'miscellaneous', selected: false },
      { id: 'water-bottle', name: 'Water bottle', category: 'miscellaneous', selected: false },
      { id: 'travel-locks', name: 'Travel locks', category: 'miscellaneous', selected: false },
    ]
  }
];

// Minimalist PDF generation with multiple fallback methods
const generatePackingListPDF = async (selectedItems: PackingItem[], logoUrl?: string): Promise<void> => {
  // Check if we have items to export
  if (selectedItems.length === 0) {
    throw new Error('Please select some items before downloading');
  }

  // Try multiple PDF generation methods in order of preference
  const pdfMethods = [
    () => generatePDFWithJsPDF(selectedItems, logoUrl),
    () => generatePDFWithPDFLib(selectedItems, logoUrl),
    () => generatePDFWithBrowserAPI(selectedItems, logoUrl)
  ];

  let lastError: Error | null = null;

  for (let i = 0; i < pdfMethods.length; i++) {
    try {
      console.log(`Attempting PDF generation method ${i + 1}/${pdfMethods.length}`);
      await pdfMethods[i]();
      console.log(`PDF generation successful with method ${i + 1}`);
      return; // Success! Exit the function
    } catch (error) {
      console.warn(`PDF generation method ${i + 1} failed:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown PDF generation error');
      
      // Continue to next method unless this is the last one
      if (i < pdfMethods.length - 1) {
        console.log(`Trying next PDF generation method...`);
        continue;
      }
    }
  }

  // All PDF methods failed, provide text file fallback with clear messaging
  console.error('All PDF generation methods failed, falling back to text file');
  
  try {
    await generateFallbackTextFile(selectedItems);
    throw new Error('PDF generation failed on your device. A text file has been downloaded instead. This may happen due to browser limitations or device restrictions.');
  } catch (fallbackError) {
    throw new Error('Failed to generate both PDF and text file. Please try again or contact support.');
  }
};

// Primary PDF generation method using jsPDF with minimalist design
const generatePDFWithJsPDF = async (selectedItems: PackingItem[], logoUrl?: string): Promise<void> => {
  const jsPDF = await loadJsPDFLibrary();
  const { jsPDF: PDF } = jsPDF;

  // Create PDF document with enhanced settings
  const doc = new PDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
    precision: 2
  });

  await buildMinimalistPDFContent(doc, selectedItems, logoUrl, 'jspdf');
  
  // Generate filename with timestamp
  const fileName = `travel-butts-packing-list-${new Date().toISOString().split('T')[0]}.pdf`;
  
  // Direct download
  doc.save(fileName);
};

// Secondary PDF generation method using PDF-lib (if available)
const generatePDFWithPDFLib = async (selectedItems: PackingItem[], logoUrl?: string): Promise<void> => {
  // Try to load PDF-lib from CDN
  const PDFLib = await loadPDFLibLibrary();
  
  const pdfDoc = await PDFLib.PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
  
  await buildPDFContentWithPDFLib(pdfDoc, page, selectedItems, logoUrl);
  
  const pdfBytes = await pdfDoc.save();
  
  // Create blob and download
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `travel-butts-packing-list-${new Date().toISOString().split('T')[0]}.pdf`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Tertiary PDF generation method using browser APIs
const generatePDFWithBrowserAPI = async (selectedItems: PackingItem[], logoUrl?: string): Promise<void> => {
  // Create a temporary HTML document for PDF generation
  const htmlContent = await buildMinimalistHTMLForPDF(selectedItems, logoUrl);
  
  // Create a new window for PDF generation
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Popup blocked - cannot generate PDF');
  }
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // Wait for content to load
  await new Promise(resolve => {
    printWindow.onload = resolve;
    setTimeout(resolve, 1000); // Fallback timeout
  });
  
  // Trigger print to PDF
  printWindow.print();
  
  // Close the window after a delay
  setTimeout(() => {
    printWindow.close();
  }, 2000);
};

// Enhanced jsPDF library loader with better error handling and retries
const loadJsPDFLibrary = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if (typeof window !== 'undefined' && (window as any).jsPDF) {
      resolve((window as any).jsPDF);
      return;
    }

    let attempts = 0;
    const maxAttempts = 3;
    
    const tryLoad = () => {
      attempts++;
      
      const script = document.createElement('script');
      script.src = attempts === 1 
        ? 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
        : attempts === 2
        ? 'https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js'
        : 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
      
      script.async = true;
      
      const timeout = setTimeout(() => {
        script.remove();
        if (attempts < maxAttempts) {
          console.warn(`jsPDF load attempt ${attempts} failed, trying alternative CDN...`);
          tryLoad();
        } else {
          reject(new Error('jsPDF library loading failed after multiple attempts'));
        }
      }, 10000);

      script.onload = () => {
        clearTimeout(timeout);
        if ((window as any).jsPDF) {
          resolve((window as any).jsPDF);
        } else {
          script.remove();
          if (attempts < maxAttempts) {
            tryLoad();
          } else {
            reject(new Error('jsPDF library loaded but not available'));
          }
        }
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        if (attempts < maxAttempts) {
          tryLoad();
        } else {
          reject(new Error('Failed to load jsPDF library from all CDNs'));
        }
      };

      document.head.appendChild(script);
    };
    
    tryLoad();
  });
};

// PDF-lib library loader
const loadPDFLibLibrary = async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).PDFLib) {
      resolve((window as any).PDFLib);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js';
    script.async = true;
    
    const timeout = setTimeout(() => {
      script.remove();
      reject(new Error('PDF-lib library loading timed out'));
    }, 15000);

    script.onload = () => {
      clearTimeout(timeout);
      if ((window as any).PDFLib) {
        resolve((window as any).PDFLib);
      } else {
        reject(new Error('PDF-lib library loaded but not available'));
      }
    };
    
    script.onerror = () => {
      clearTimeout(timeout);
      script.remove();
      reject(new Error('Failed to load PDF-lib library'));
    };

    document.head.appendChild(script);
  });
};

// Minimalist PDF content builder with clean Travel Butts branding and perfect centering
const buildMinimalistPDFContent = async (doc: any, selectedItems: PackingItem[], logoUrl?: string, method: string = 'jspdf'): Promise<void> => {
  // Travel Butts brand colors (RGB values)
  const brandSecondary = [17, 69, 76];       // #11454c (dark teal)
  const brandAccent = [11, 145, 149];        // #0b9195 (teal accent)
  const lightGray = [248, 250, 252];         // Very light background
  const darkGray = [55, 65, 81];             // Dark text

  // Page setup
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let yPosition = margin + 15;

  // Enhanced font setting with proper fallback chain
  const setFont = (weight: 'normal' | 'bold' = 'normal') => {
    try {
      // Try Gotham first (primary brand font)
      doc.setFont('Gotham', weight);
    } catch (e) {
      try {
        // Fallback to Montserrat
        doc.setFont('Montserrat', weight);
      } catch (e2) {
        try {
          // Fallback to Inter
          doc.setFont('Inter', weight);
        } catch (e3) {
          try {
            // Fallback to system-ui equivalent (Helvetica)
            doc.setFont('helvetica', weight);
          } catch (e4) {
            // Final fallback to default
            doc.setFont('helvetica', weight === 'bold' ? 'bold' : 'normal');
          }
        }
      }
    }
  };

  // Header section with logo
  if (logoUrl) {
    try {
      const logoBase64 = await convertImageToBase64(logoUrl);
      if (logoBase64) {
        // Clean logo positioning - top left
        const logoWidth = 50;
        const logoHeight = 20;
        doc.addImage(logoBase64, 'PNG', margin, yPosition, logoWidth, logoHeight);
        yPosition += logoHeight + 20;
      }
    } catch (logoError) {
      console.warn('Could not add logo to PDF:', logoError);
      yPosition += 10;
    }
  }

  // Main title - perfectly centered horizontally
  doc.setFontSize(24);
  doc.setTextColor(...brandSecondary);
  setFont('bold');
  
  const title = 'Travel Packing List';
  const titleWidth = doc.getTextWidth(title);
  const titleX = (pageWidth - titleWidth) / 2; // Perfect horizontal centering
  
  doc.text(title, titleX, yPosition);
  yPosition += 20;

  // Simple travel message - perfectly centered horizontally
  doc.setFontSize(12);
  doc.setTextColor(...brandAccent);
  setFont('normal');
  
  const travelMessage = 'Pack smart, travel light, explore more.';
  const messageWidth = doc.getTextWidth(travelMessage);
  const messageX = (pageWidth - messageWidth) / 2; // Perfect horizontal centering
  
  doc.text(travelMessage, messageX, yPosition);
  yPosition += 25;

  // Date and item count - minimal info
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  doc.setFontSize(10);
  doc.setTextColor(...darkGray);
  setFont('normal');
  doc.text(`Created: ${currentDate}`, margin, yPosition);
  doc.text(`${selectedItems.length} items`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 20;

  // Group items by category
  const itemsByCategory = groupItemsByCategory(selectedItems);

  // Category sections with clean styling
  Object.entries(itemsByCategory).forEach(([categoryKey, items]) => {
    // Check if we need a new page
    const spaceNeeded = (items.length * 8) + 30;
    
    if (yPosition + spaceNeeded > pageHeight - 40) {
      doc.addPage();
      yPosition = margin + 20;
    }

    const categoryName = getCategoryDisplayName(categoryKey);
    
    // Category header - simple line
    doc.setFontSize(14);
    doc.setTextColor(...brandSecondary);
    setFont('bold');
    doc.text(categoryName, margin, yPosition);
    
    // Simple underline
    doc.setDrawColor(...brandAccent);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition + 2, margin + doc.getTextWidth(categoryName), yPosition + 2);
    
    yPosition += 15;

    // Items - clean checkboxes and text
    items.forEach((item) => {
      // Simple checkbox
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(...brandAccent);
      doc.setLineWidth(0.8);
      doc.rect(margin, yPosition - 2.5, 5, 5, 'D');

      // Item text
      doc.setFontSize(10);
      doc.setTextColor(...brandSecondary);
      setFont('normal');
      
      let itemName = item.name;
      if (itemName.length > 60) {
        itemName = itemName.substring(0, 57) + '...';
      }
      
      doc.text(itemName, margin + 8, yPosition + 1);
      
      yPosition += 8;
    });

    yPosition += 10;
  });

  // Simple footer with Travel Butts branding
  const footerY = pageHeight - 25;
  
  doc.setFontSize(10);
  doc.setTextColor(...brandAccent);
  setFont('normal');
  
  const footerBrand = 'Travel Butts';
  const footerBrandWidth = doc.getTextWidth(footerBrand);
  const footerBrandX = (pageWidth - footerBrandWidth) / 2; // Perfect horizontal centering
  doc.text(footerBrand, footerBrandX, footerY);
  
  doc.setFontSize(8);
  doc.setTextColor(...darkGray);
  const footerCredit = '© 2025 Built with love using caffeine.ai';
  const footerCreditWidth = doc.getTextWidth(footerCredit);
  const footerCreditX = (pageWidth - footerCreditWidth) / 2; // Perfect horizontal centering
  doc.text(footerCredit, footerCreditX, footerY + 8);
};

// Build PDF content using PDF-lib with minimalist Travel Butts branding and perfect centering
const buildPDFContentWithPDFLib = async (pdfDoc: any, page: any, selectedItems: PackingItem[], logoUrl?: string): Promise<void> => {
  const { rgb } = await loadPDFLibLibrary();
  
  // Travel Butts brand colors
  const brandSecondary = rgb(17/255, 69/255, 76/255);   // Dark teal
  const brandAccent = rgb(11/255, 145/255, 149/255);    // Teal accent
  
  const pageWidth = 595.28; // A4 width in points
  let yPosition = 800;
  
  // Header with Travel Butts branding - perfectly centered
  const title = 'Travel Packing List';
  const titleSize = 24;
  // Approximate text width calculation for centering (PDF-lib doesn't have getTextWidth)
  const titleWidth = title.length * (titleSize * 0.6); // Rough estimation
  const titleX = (pageWidth - titleWidth) / 2;
  
  page.drawText(title, {
    x: titleX,
    y: yPosition,
    size: titleSize,
    color: brandSecondary,
  });
  yPosition -= 30;
  
  // Simple travel message - perfectly centered
  const message = 'Pack smart, travel light, explore more.';
  const messageSize = 12;
  const messageWidth = message.length * (messageSize * 0.6); // Rough estimation
  const messageX = (pageWidth - messageWidth) / 2;
  
  page.drawText(message, {
    x: messageX,
    y: yPosition,
    size: messageSize,
    color: brandAccent,
  });
  yPosition -= 40;
  
  // Date and stats
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  page.drawText(`Created: ${currentDate}`, {
    x: 50,
    y: yPosition,
    size: 10,
    color: brandSecondary,
  });
  
  page.drawText(`${selectedItems.length} items`, {
    x: 500,
    y: yPosition,
    size: 10,
    color: brandSecondary,
  });
  yPosition -= 30;
  
  // Group items by category and add them with clean styling
  const itemsByCategory = groupItemsByCategory(selectedItems);
  
  Object.entries(itemsByCategory).forEach(([categoryKey, items]) => {
    const categoryName = getCategoryDisplayName(categoryKey);
    
    // Category header
    page.drawText(categoryName, {
      x: 50,
      y: yPosition,
      size: 14,
      color: brandSecondary,
    });
    yPosition -= 20;
    
    // Items with simple checkboxes
    items.forEach((item) => {
      if (yPosition < 50) {
        // Would need to add new page logic here
        return;
      }
      
      // Simple checkbox
      page.drawRectangle({
        x: 60,
        y: yPosition - 4,
        width: 8,
        height: 8,
        borderColor: brandAccent,
        borderWidth: 1,
      });
      
      // Item text
      page.drawText(item.name, {
        x: 75,
        y: yPosition,
        size: 10,
        color: brandSecondary,
      });
      
      yPosition -= 15;
    });
    
    yPosition -= 10;
  });
};

// Minimalist HTML content for browser-based PDF generation with perfect centering
const buildMinimalistHTMLForPDF = async (selectedItems: PackingItem[], logoUrl?: string): Promise<string> => {
  const itemsByCategory = groupItemsByCategory(selectedItems);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let categoriesHTML = '';
  Object.entries(itemsByCategory).forEach(([categoryKey, items]) => {
    const categoryName = getCategoryDisplayName(categoryKey);
    let itemsHTML = '';
    
    items.forEach(item => {
      itemsHTML += `
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <div style="width: 12px; height: 12px; border: 1px solid #0b9195; margin-right: 12px; border-radius: 2px;"></div>
          <span style="font-size: 11px; color: #11454c; font-family: 'Gotham', 'Montserrat', 'Inter', 'Helvetica', sans-serif;">${item.name}</span>
        </div>
      `;
    });
    
    categoriesHTML += `
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <h3 style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #11454c; font-family: 'Gotham', 'Montserrat', 'Inter', 'Helvetica', sans-serif; border-bottom: 1px solid #0b9195; padding-bottom: 3px;">
          ${categoryName}
        </h3>
        <div style="margin-left: 10px;">
          ${itemsHTML}
        </div>
      </div>
    `;
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Travel Butts - Packing List</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
      <style>
        @page { 
          size: A4; 
          margin: 20mm; 
        }
        body { 
          font-family: 'Gotham', 'Montserrat', 'Inter', 'Helvetica', 'Arial', sans-serif; 
          font-size: 11px; 
          line-height: 1.4; 
          color: #11454c;
          margin: 0;
          padding: 0;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px;
        }
        .logo {
          margin-bottom: 15px;
          text-align: center;
        }
        .logo img {
          height: 40px;
        }
        .title { 
          font-size: 24px; 
          font-weight: bold; 
          margin-bottom: 8px; 
          color: #11454c;
          font-family: 'Gotham', 'Montserrat', 'Inter', 'Helvetica', sans-serif;
          text-align: center;
        }
        .subtitle {
          font-size: 12px;
          color: #0b9195;
          margin-bottom: 20px;
          text-align: center;
          font-family: 'Gotham', 'Montserrat', 'Inter', 'Helvetica', sans-serif;
        }
        .info {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #374151;
          margin-bottom: 25px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e5e7eb;
        }
        .footer { 
          position: fixed; 
          bottom: 15mm; 
          left: 20mm; 
          right: 20mm; 
          text-align: center; 
          font-size: 10px;
          color: #0b9195;
        }
        .footer-brand {
          margin-bottom: 3px;
          font-weight: bold;
          font-family: 'Gotham', 'Montserrat', 'Inter', 'Helvetica', sans-serif;
        }
        .footer-credit {
          font-size: 8px;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="header">
        ${logoUrl ? `<div class="logo"><img src="${logoUrl}" alt="Travel Butts Logo"></div>` : ''}
        <div class="title">Travel Packing List</div>
        <div class="subtitle">Pack smart, travel light, explore more.</div>
      </div>
      
      <div class="info">
        <span>Created: ${currentDate}</span>
        <span>${selectedItems.length} items</span>
      </div>
      
      ${categoriesHTML}
      
      <div class="footer">
        <div class="footer-brand">Travel Butts</div>
        <div class="footer-credit">© 2025 Built with love using caffeine.ai</div>
      </div>
    </body>
    </html>
  `;
};

// Helper function to convert image to base64 with enhanced error handling
const convertImageToBase64 = async (imageUrl: string): Promise<string | null> => {
  try {
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(imageUrl, { 
      signal: controller.signal,
      mode: 'cors'
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to convert image to base64'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Image conversion failed:', error);
    return null;
  }
};

// Enhanced fallback method with better error handling
const generateFallbackTextFile = async (selectedItems: PackingItem[]): Promise<void> => {
  const itemsByCategory = groupItemsByCategory(selectedItems);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let textContent = `TRAVEL BUTTS - PACKING LIST\n`;
  textContent += `═══════════════════════════════════════\n\n`;
  textContent += `Pack smart, travel light, explore more.\n\n`;
  textContent += `Created: ${currentDate}\n`;
  textContent += `Total items: ${selectedItems.length}\n\n`;

  Object.entries(itemsByCategory).forEach(([categoryKey, items]) => {
    const categoryName = getCategoryDisplayName(categoryKey);
    textContent += `${categoryName.toUpperCase()}\n`;
    textContent += '─'.repeat(categoryName.length) + '\n';
    
    items.forEach(item => {
      textContent += `☐ ${item.name}\n`;
    });
    textContent += '\n';
  });

  textContent += '\n═══════════════════════════════════════\n';
  textContent += 'Travel Butts\n';
  textContent += '© 2025 Built with love using caffeine.ai\n';

  // Create and download text file
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `travel-butts-packing-list-${new Date().toISOString().split('T')[0]}.txt`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Helper functions with Travel Butts branding
const groupItemsByCategory = (items: PackingItem[]): Record<string, PackingItem[]> => {
  const grouped: Record<string, PackingItem[]> = {};
  
  items.forEach(item => {
    const categoryKey = item.subcategory ? `${item.category}-${item.subcategory}` : item.category;
    if (!grouped[categoryKey]) {
      grouped[categoryKey] = [];
    }
    grouped[categoryKey].push(item);
  });
  
  return grouped;
};

const getCategoryDisplayName = (categoryKey: string): string => {
  if (categoryKey.includes('-')) {
    const [category, subcategory] = categoryKey.split('-');
    if (category === 'toiletries') {
      return `Toiletries - ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}`;
    }
  }
  
  const categoryNames: Record<string, string> = {
    'clothing': 'Clothing',
    'footwear': 'Footwear',
    'toiletries': 'Toiletries',
    'electronics': 'Electronics',
    'documents': 'Documents & Money',
    'health': 'Health & Safety',
    'accessories': 'Accessories',
    'entertainment': 'Entertainment',
    'miscellaneous': 'Miscellaneous'
  };
  
  return categoryNames[categoryKey] || categoryKey;
};

export default function PackingList() {
  const [packingData, setPackingData] = useState<PackingCategory[]>(defaultPackingData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customItem, setCustomItem] = useState('');
  const [selectedToiletriesTab, setSelectedToiletriesTab] = useState<'normal' | 'men' | 'women'>('normal');
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: logoUrl } = useFileUrl('assets/travel-butts-logo.png');

  const goHome = () => {
    window.location.hash = '';
    window.location.reload();
  };

  const toggleItem = (categoryId: string, itemId: string, subcategory?: string) => {
    setPackingData(prev => prev.map(category => {
      if (category.id === categoryId) {
        if (subcategory && category.subcategories) {
          return {
            ...category,
            subcategories: {
              ...category.subcategories,
              [subcategory]: category.subcategories[subcategory as keyof typeof category.subcategories].map(item =>
                item.id === itemId ? { ...item, selected: !item.selected } : item
              )
            }
          };
        } else {
          return {
            ...category,
            items: category.items.map(item =>
              item.id === itemId ? { ...item, selected: !item.selected } : item
            )
          };
        }
      }
      return category;
    }));
  };

  const addCustomItem = (categoryId: string) => {
    if (!customItem.trim()) return;

    const newItem: PackingItem = {
      id: `custom-${Date.now()}`,
      name: customItem.trim(),
      category: categoryId,
      selected: true,
      isCustom: true
    };

    setPackingData(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: [...category.items, newItem]
        };
      }
      return category;
    }));

    setCustomItem('');
  };

  const removeCustomItem = (categoryId: string, itemId: string) => {
    setPackingData(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== itemId)
        };
      }
      return category;
    }));
  };

  const getAllItems = (): PackingItem[] => {
    const allItems: PackingItem[] = [];
    packingData.forEach(category => {
      allItems.push(...category.items);
      if (category.subcategories) {
        Object.values(category.subcategories).forEach(subcategoryItems => {
          allItems.push(...subcategoryItems);
        });
      }
    });
    return allItems;
  };

  const getSelectedItems = (): PackingItem[] => {
    return getAllItems().filter(item => item.selected);
  };

  const getFilteredCategories = () => {
    if (selectedCategory === 'all' && !searchTerm) {
      return packingData;
    }

    return packingData.filter(category => {
      if (selectedCategory !== 'all' && category.id !== selectedCategory) {
        return false;
      }

      if (!searchTerm) return true;

      const searchLower = searchTerm.toLowerCase();
      const categoryMatches = category.name.toLowerCase().includes(searchLower);
      const itemMatches = category.items.some(item => 
        item.name.toLowerCase().includes(searchLower)
      );
      const subcategoryMatches = category.subcategories ? 
        Object.values(category.subcategories).some(subcategoryItems =>
          subcategoryItems.some(item => item.name.toLowerCase().includes(searchLower))
        ) : false;

      return categoryMatches || itemMatches || subcategoryMatches;
    });
  };

  const downloadPackingListPDF = async () => {
    const selectedItems = getSelectedItems();
    
    if (selectedItems.length === 0) {
      showToast('Please select some items before downloading', 'warning');
      return;
    }

    setIsDownloading(true);

    try {
      await generatePackingListPDF(selectedItems, logoUrl);
      showToast('Minimalist packing list PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('PDF generation failed:', error);
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'PDF generation failed. Please try again.';
      
      if (errorMessage.includes('text file has been downloaded instead')) {
        showToast(errorMessage, 'warning');
      } else {
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const sharePackingList = () => {
    const selectedItems = getSelectedItems();
    if (selectedItems.length === 0) {
      showToast('Please select some items before sharing', 'warning');
      return;
    }

    const itemsList = selectedItems.map(item => `• ${item.name}`).join('\n');
    const shareText = `Check out my Travel Butts packing list for my upcoming trip! 🧳✈️\n\n${itemsList}\n\nCreate your own at ${window.location.origin}#packing-list`;

    if (navigator.share) {
      navigator.share({
        title: 'My Travel Packing List',
        text: shareText,
        url: `${window.location.origin}#packing-list`
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        showToast('Packing list copied to clipboard! You can now paste it anywhere to share.', 'success');
      }).catch(() => {
        // Final fallback: show share text in alert
        alert(`Share this packing list:\n\n${shareText}`);
      });
    }
  };

  const selectedCount = getSelectedItems().length;
  const totalCount = getAllItems().length;

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={goHome}
            className="inline-flex items-center space-x-2 text-secondary-light hover:text-secondary mb-4 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Travel Butts logo"
                className="h-10 w-auto"
              />
            )}
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary">Smart Packing List</h1>
          </div>
          
          <p className="text-lg text-secondary-light mb-6">
            Create your personalized packing list and download it as a clean, minimalist PDF for your trip
          </p>

          {/* Progress */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{selectedCount}</div>
                <div className="text-sm text-secondary-light">Selected</div>
              </div>
              <div className="text-secondary-light">/</div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{totalCount}</div>
                <div className="text-sm text-secondary-light">Total Items</div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-light w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-light w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  {packingData.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Packing Categories */}
        <div className="space-y-6">
          {getFilteredCategories().map(category => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-accent text-white p-4">
                <h2 className="text-xl font-semibold flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>{category.name}</span>
                  <span className="text-sm opacity-75">
                    ({category.items.filter(item => item.selected).length + 
                      (category.subcategories ? 
                        Object.values(category.subcategories).reduce((acc, items) => 
                          acc + items.filter(item => item.selected).length, 0
                        ) : 0
                      )} selected)
                  </span>
                </h2>
              </div>

              <div className="p-6">
                {/* Special handling for Toiletries category */}
                {category.id === 'toiletries' && category.subcategories ? (
                  <div className="space-y-6">
                    {/* Toiletries Tab Navigation */}
                    <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setSelectedToiletriesTab('normal')}
                        className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                          selectedToiletriesTab === 'normal'
                            ? 'bg-white text-accent shadow-sm'
                            : 'text-secondary-light hover:text-secondary'
                        }`}
                      >
                        General
                      </button>
                      <button
                        onClick={() => setSelectedToiletriesTab('men')}
                        className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                          selectedToiletriesTab === 'men'
                            ? 'bg-blue-50 text-blue-600 shadow-sm'
                            : 'text-secondary-light hover:text-secondary'
                        }`}
                      >
                        Men
                      </button>
                      <button
                        onClick={() => setSelectedToiletriesTab('women')}
                        className={`flex-1 px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                          selectedToiletriesTab === 'women'
                            ? 'bg-pink-50 text-pink-600 shadow-sm'
                            : 'text-secondary-light hover:text-secondary'
                        }`}
                      >
                        Women
                      </button>
                    </div>

                    {/* Toiletries Items */}
                    <div className={`p-4 rounded-lg ${
                      selectedToiletriesTab === 'men' ? 'bg-blue-50' :
                      selectedToiletriesTab === 'women' ? 'bg-pink-50' : 'bg-gray-50'
                    }`}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {category.subcategories[selectedToiletriesTab].map(item => (
                          <label
                            key={item.id}
                            className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-neutral-light hover:border-accent transition-colors cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={item.selected}
                              onChange={() => toggleItem(category.id, item.id, selectedToiletriesTab)}
                              className="w-4 h-4 text-accent focus:ring-accent border-neutral-light rounded"
                            />
                            <span className="font-medium flex-1 text-secondary">
                              {item.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Regular category items */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {category.items.map(item => (
                        <label
                          key={item.id}
                          className="flex items-center space-x-3 p-3 rounded-lg border bg-gray-50 border-neutral-light hover:border-accent transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleItem(category.id, item.id)}
                            className="w-4 h-4 text-accent focus:ring-accent border-neutral-light rounded"
                          />
                          <span className="font-medium flex-1 text-secondary">
                            {item.name}
                          </span>
                          {item.isCustom && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeCustomItem(category.id, item.id);
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </label>
                      ))}
                    </div>

                    {/* Add Custom Item */}
                    <div className="flex space-x-2 pt-4 border-t border-neutral-light">
                      <input
                        type="text"
                        placeholder="Add custom item..."
                        value={customItem}
                        onChange={(e) => setCustomItem(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCustomItem(category.id);
                          }
                        }}
                        className="flex-1 px-3 py-2 border border-neutral-light rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                      />
                      <button
                        onClick={() => addCustomItem(category.id)}
                        disabled={!customItem.trim()}
                        className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons at Bottom */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-secondary mb-6">
              Ready to pack? Choose how you'd like to use your list:
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={sharePackingList}
                disabled={selectedCount === 0}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className="w-5 h-5" />
                <span>Share Packing List</span>
              </button>
              
              <button
                onClick={downloadPackingListPDF}
                disabled={selectedCount === 0 || isDownloading}
                className="flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Download className="w-5 h-5" />
                )}
                <span>{isDownloading ? 'Generating PDF...' : 'Download Clean PDF'}</span>
              </button>
            </div>

            {selectedCount === 0 && (
              <p className="text-sm text-secondary-light mt-4">
                Select some items above to enable these actions
              </p>
            )}

            {/* Enhanced device compatibility notice */}
            <div className="mt-6 p-4 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg border border-accent/20">
              <p className="text-xs text-secondary-light leading-relaxed">
                <strong>✨ Clean & Minimalist PDF Design:</strong> Your packing list will be generated as a beautifully simple, 
                A4-formatted PDF featuring the Travel Butts logo, perfectly centered title and travel message using Gotham font 
                (with fallbacks to Montserrat, Inter, then system fonts), and clear section headings. 
                The design focuses on readability with minimal decorative elements - perfect for printing or viewing on any device 
                with our multi-method generation system for maximum compatibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
