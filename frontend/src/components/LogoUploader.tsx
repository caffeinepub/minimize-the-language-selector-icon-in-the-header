import React, { useState, useRef } from 'react';
import { Upload, Check, AlertCircle, Image, X, Loader2 } from 'lucide-react';
import { useFileUpload, useFileUrl } from '../blob-storage/FileStorage';

interface LogoUploaderProps {
  onLogoUploaded?: (logoUrl: string) => void;
}

export default function LogoUploader({ onLogoUploaded }: LogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showUploader, setShowUploader] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile } = useFileUpload();
  const { data: logoUrl, refetch } = useFileUrl('assets/travel-butts-logo.png');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous status
    setUploadStatus('idle');
    setErrorMessage('');

    // Validate file type - support JPG, JPEG, PNG, WebP, SVG
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadStatus('error');
      setErrorMessage('Ongeldig bestandsformaat. Gebruik JPG, PNG, WebP of SVG.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setUploadStatus('error');
      setErrorMessage(`Bestand is te groot (${(file.size / 1024 / 1024).toFixed(2)}MB). Maximum is 10MB.`);
      return;
    }

    setIsUploading(true);

    try {
      const result = await uploadFile('assets/travel-butts-logo.png', file);
      setUploadStatus('success');
      
      // Refetch the logo URL to update the display
      await refetch();
      
      if (onLogoUploaded && result.url) {
        onLogoUploaded(result.url);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Auto-hide uploader after success
      setTimeout(() => {
        setShowUploader(false);
        setUploadStatus('idle');
        setErrorMessage('');
      }, 3000);
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      setUploadStatus('error');
      
      // Provide detailed error message
      if (error.message) {
        setErrorMessage(`Upload mislukt: ${error.message}`);
      } else if (error.toString().includes('network')) {
        setErrorMessage('Netwerkfout. Controleer je internetverbinding en probeer opnieuw.');
      } else {
        setErrorMessage('Upload mislukt. Probeer het opnieuw of kies een ander bestand.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Current Logo Display */}
      {logoUrl && (
        <div className="bg-neutral-light rounded-lg p-4">
          <h4 className="text-sm font-medium text-secondary mb-2">Huidig Logo</h4>
          <div className="flex items-center space-x-4">
            <img
              src={logoUrl}
              alt="Huidig logo"
              className="h-12 w-auto border border-neutral-light rounded"
            />
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm">Logo is actief op de hele site</span>
            </div>
          </div>
        </div>
      )}

      {/* Upload Interface */}
      <div className="bg-white border border-neutral-light rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-secondary">
            {logoUrl ? 'Logo Bijwerken' : 'Logo Uploaden'}
          </h4>
          {showUploader && (
            <button
              onClick={() => {
                setShowUploader(false);
                setUploadStatus('idle');
                setErrorMessage('');
              }}
              className="text-secondary-light hover:text-secondary"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {!showUploader ? (
          <button
            onClick={() => setShowUploader(true)}
            className="flex items-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Image className="w-4 h-4" />
            <span>{logoUrl ? 'Logo Wijzigen' : 'Logo Uploaden'}</span>
          </button>
        ) : (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              onChange={handleFileSelect}
              className="hidden"
            />

            <button
              onClick={triggerFileSelect}
              disabled={isUploading}
              className="w-full flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Uploaden...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Selecteer Logobestand</span>
                </>
              )}
            </button>

            {uploadStatus === 'success' && (
              <div className="flex items-start space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Upload succesvol!</p>
                  <p className="text-xs mt-1">Het logo is nu zichtbaar op de hele website voor alle gebruikers.</p>
                </div>
              </div>
            )}

            {uploadStatus === 'error' && (
              <div className="flex items-start space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Upload mislukt</p>
                  <p className="text-xs mt-1">{errorMessage || 'Controleer het bestandsformaat en de grootte.'}</p>
                </div>
              </div>
            )}

            <div className="text-xs text-secondary-light bg-gray-50 p-3 rounded-lg space-y-1">
              <p className="font-medium mb-2">Vereisten:</p>
              <p>• Maximale bestandsgrootte: 10MB</p>
              <p>• Ondersteunde formaten: JPG, JPEG, PNG, WebP, SVG</p>
              <p>• Aanbevolen: Vierkant formaat, transparante achtergrond</p>
              <p>• Wijzigingen zijn direct zichtbaar op de hele site</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
