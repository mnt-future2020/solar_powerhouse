'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import axios from '@/lib/axios';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  className?: string;
}

export default function ImageUpload({ value, onChange, onRemove, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    try {
      const response = await axios.get('/upload/config');
      setConfigured(response.data.configured);
    } catch {
      // Backend unreachable or upload not configured — silently fall back
      setConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  const uploadToBackend = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      console.log('Starting upload for file:', file.name, 'Size:', file.size);
      const response = await axios.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data);

      if (response.data.success) {
        return response.data.url;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!configured) {
       // Just warn the user instead of outright blocking them, they might have fixed it or it might just be a false ping.
       console.warn('Image upload target unverified. Continuing upload regardless...');
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Error',
        description: 'Image size should be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    
    // Show uploading toast
    toast({
      title: 'Uploading...',
      description: `Uploading ${file.name}...`,
    });

    try {
      const imageUrl = await uploadToBackend(file);
      onChange(imageUrl);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error: any) {
      console.error('Upload failed:', error);
      toast({
        title: 'Upload Error',
        description: error.message || 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-4">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600">Checking configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 shadow-sm p-4 border border-gray-100/50 rounded-2xl bg-white/50">
      
      {!configured && !loading && (
        <div className="flex items-start gap-2 p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl mb-4">
          <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-700/80 leading-relaxed">
            <span className="font-semibold block mb-0.5">Cloudinary Disconnected</span>
            API not verified. Uploads may fail. You can provide a direct URL below instead.
          </div>
        </div>
      )}

      {/* Primary Local Upload Button System */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`flex items-center gap-2 transition-colors ${
              uploading 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'hover:bg-slate-50'
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Local Image
              </>
            )}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Max 5MB. JPG, PNG, WebP.
          </div>
        </div>

      </div>

      {value && (
        <div className="relative inline-block mt-2">
          <div className="relative group">
            <img
              src={value}
              alt="Image preview"
              className={`object-cover rounded-xl border border-gray-200 shadow-sm ${className || 'w-40 h-28'}`}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+Image'; }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center backdrop-blur-[2px]">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => { onChange(''); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                className="rounded-lg font-semibold shadow-xl"
              >
                <X className="h-3 w-3 mr-1" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {!value && (
        <div className={`border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gray-50/50 ${className || 'w-40 h-28'}`}>
          <div className="text-center">
            <ImageIcon className="h-6 w-6 text-gray-300 mx-auto mb-2" />
            <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">No Image</div>
          </div>
        </div>
      )}
    </div>
  );
}