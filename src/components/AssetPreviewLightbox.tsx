
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AssetPreviewLightboxProps {
  asset: {
    name: string;
    url: string;
  } | null;
  onClose: () => void;
}

const AssetPreviewLightbox: React.FC<AssetPreviewLightboxProps> = ({ asset, onClose }) => {
  if (!asset) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium truncate max-w-[80%]">{asset.name}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close preview">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center p-4">
          <img 
            src={asset.url} 
            alt={asset.name} 
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AssetPreviewLightbox;
