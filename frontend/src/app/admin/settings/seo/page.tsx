'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Save, Search, Tag, ChevronDown } from 'lucide-react';
import axios from '@/lib/axios';

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

interface PageSEO {
  [key: string]: SEOSettings;
}

export default function SEOSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedPage, setSelectedPage] = useState('home');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pageSEOData, setPageSEOData] = useState<PageSEO>({});

  const availablePages = [
    { value: 'home', label: 'Home Page', path: '/' },
    { value: 'about', label: 'About Page', path: '/about' },
    { value: 'services', label: 'Services Page', path: '/services' },
    { value: 'contact', label: 'Contact Page', path: '/contact' },
  ];

  const currentSEOSettings = pageSEOData[selectedPage] || {
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/settings/seo');
      setPageSEOData(response.data || {});
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load SEO settings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedData = {
        ...pageSEOData,
        [selectedPage]: currentSEOSettings
      };
      await axios.put('/settings/seo', updatedData);
      setPageSEOData(updatedData);
      toast({
        title: 'Success',
        description: `SEO settings for ${availablePages.find(p => p.value === selectedPage)?.label} updated successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update SEO settings',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPageSEOData(prev => ({
      ...prev,
      [selectedPage]: {
        ...prev[selectedPage],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SEO Settings</h1>
          <p className="text-gray-600">Optimize your website pages for search engines</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Page Selection Dropdown */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Select Page</h2>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full md:w-64 px-4 py-2 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
          >
            <span>{availablePages.find(p => p.value === selectedPage)?.label}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div className="absolute z-10 w-full md:w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {availablePages.map((page) => (
                <button
                  key={page.value}
                  onClick={() => {
                    setSelectedPage(page.value);
                    setDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                    selectedPage === page.value ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  <div>
                    <div className="font-medium">{page.label}</div>
                    <div className="text-sm text-gray-500">{page.path}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Meta Information */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">
            Meta Information - {availablePages.find(p => p.value === selectedPage)?.label}
          </h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={currentSEOSettings.metaTitle}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter meta title (50-60 characters)"
              maxLength={60}
            />
            <p className="text-xs text-gray-500 mt-1">
              {currentSEOSettings.metaTitle.length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={currentSEOSettings.metaDescription}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter meta description (150-160 characters)"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {currentSEOSettings.metaDescription.length}/160 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              value={currentSEOSettings.metaKeywords}
              onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter keywords separated by commas"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate keywords with commas (e.g., solar energy, renewable power, green technology)
            </p>
          </div>
        </div>
      </Card>

      {/* SEO Preview */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Search Engine Preview</h2>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">
              {currentSEOSettings.metaTitle || 'Your Page Title'}
            </div>
            <div className="text-green-600 text-sm">
              https://yourwebsite.com{availablePages.find(p => p.value === selectedPage)?.path}
            </div>
            <div className="text-gray-600 text-sm">
              {currentSEOSettings.metaDescription || 'Your meta description will appear here...'}
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">SEO Tips:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Keep meta titles under 60 characters</li>
            <li>• Write compelling meta descriptions under 160 characters</li>
            <li>• Use relevant keywords naturally</li>
            <li>• Make each page's SEO unique and descriptive</li>
            <li>• Include your target keywords in titles and descriptions</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}