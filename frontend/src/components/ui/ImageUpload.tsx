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
    } catch (error) {
      console.error('Failed to check configuration:', error);
      setConfigured(false);
    } finally {
      setLoading(false);
    }
  };

  const uploadToBackend = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        return response.data.url;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!configured) {
      toast({
        title: 'Configuration Error',
        description: 'Image upload is not configured. Please check backend settings.',
        variant: 'destructive',
      });
      return;
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

    try {
      const imageUrl = await uploadToBackend(file);
      onChange(imageUrl);
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
        variant: 'success',
      });
    } catch (error: any) {
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

  if (!configured) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <div className="text-sm">
            <div className="font-medium text-yellow-800">Image Upload Not Configured</div>
            <div className="text-yellow-700">
              Please configure Cloudinary in the backend environment variables.
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border">
          <div className="font-medium mb-1">Required in backend/.env:</div>
          <div className="font-mono">
            CLOUDINARY_CLOUD_NAME=your-cloud-name<br/>
            CLOUDINARY_API_KEY=your-api-key<br/>
            CLOUDINARY_API_SECRET=your-api-secret
          </div>
        </div>

        {/* Fallback URL input */}
        <div>
          <label className="block text-sm font-medium mb-2">Image URL (Fallback)</label>
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-sm text-gray-500">
          Max size: 5MB. Formats: JPG, PNG, WebP
        </div>
      </div>

      {value && (
        <div className="relative inline-block">
          <div className="relative group">
            <img
              src={value}
              alt="Uploaded image"
              className={`object-cover rounded-lg border ${className || 'w-40 h-32'}`}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onRemove?.()}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 break-all max-w-40">
            Uploaded to Cloudinary
          </div>
        </div>
      )}

      {!value && (
        <div className={`border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 ${className || 'w-40 h-32'}`}>
          <div className="text-center">
            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <div className="text-xs text-gray-500">No image selected</div>
          </div>
        </div>
      )}
    </div>
  );
}

export { ImageUpload };