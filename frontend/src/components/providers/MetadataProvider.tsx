'use client';

import { useEffect } from 'react';
import axios from '@/lib/axios';

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
  favicon: string;
}

export default function MetadataProvider() {
  useEffect(() => {
    updateMetadata();
  }, []);

  const updateMetadata = async () => {
    try {
      const response = await axios.get('/settings');
      const seoSettings: SEOSettings = response.data.seo || {};

      // Update document title
      if (seoSettings.metaTitle) {
        document.title = seoSettings.metaTitle;
      }

      // Update meta description
      updateMetaTag('description', seoSettings.metaDescription);
      
      // Update meta keywords
      updateMetaTag('keywords', seoSettings.metaKeywords);

      // Update Open Graph tags
      updateMetaTag('og:title', seoSettings.metaTitle, 'property');
      updateMetaTag('og:description', seoSettings.metaDescription, 'property');
      updateMetaTag('og:image', seoSettings.ogImage, 'property');

      // Update Twitter Card tags
      updateMetaTag('twitter:title', seoSettings.metaTitle, 'name');
      updateMetaTag('twitter:description', seoSettings.metaDescription, 'name');
      updateMetaTag('twitter:image', seoSettings.ogImage, 'name');
      updateMetaTag('twitter:card', 'summary_large_image', 'name');

      // Update favicon
      if (seoSettings.favicon) {
        updateFavicon(seoSettings.favicon);
      }
    } catch {
      // Non-critical — site works fine without dynamic metadata
    }
  };

  const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
    if (!content) return;

    let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (metaTag) {
      metaTag.setAttribute('content', content);
    } else {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, name);
      metaTag.setAttribute('content', content);
      document.head.appendChild(metaTag);
    }
  };

  const updateFavicon = (faviconUrl: string) => {
    // Remove existing favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }

    // Add new favicon
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = faviconUrl;
    document.head.appendChild(favicon);
  };

  return null; // This component doesn't render anything
}