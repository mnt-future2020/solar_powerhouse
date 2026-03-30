'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from '@/lib/axios';

interface PageSEO {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

interface GlobalSEO extends PageSEO {
  ogImage?: string;
  favicon?: string;
}

export default function MetadataProvider() {
  const pathname = usePathname();

  useEffect(() => {
    updateMetadata();
  }, [pathname]);

  const getPageKey = (): string => {
    if (pathname === '/') return 'home';
    if (pathname === '/about') return 'about';
    if (pathname === '/services') return 'services';
    if (pathname === '/contact') return 'contact';
    const serviceMatch = pathname.match(/^\/services\/([^/]+)$/);
    if (serviceMatch) return `service-${serviceMatch[1]}`;
    return '';
  };

  const updateMetadata = async () => {
    try {
      const pageKey = getPageKey();
      const isServiceDetail = pageKey.startsWith('service-');
      const serviceId = isServiceDetail ? pageKey.replace('service-', '') : null;

      // Fetch settings + service data in parallel
      const [settingsRes, serviceRes] = await Promise.all([
        axios.get('/settings'),
        serviceId ? axios.get(`/services/${serviceId}`).catch(() => null) : Promise.resolve(null),
      ]);

      const settings = settingsRes.data;
      const globalSeo: GlobalSEO = settings.seo?.global || {};
      const pages = settings.seo?.pages || {};
      const pageSeo: PageSEO = pageKey ? pages[pageKey] || {} : {};
      const serviceData = serviceRes?.data;

      // Priority: page-specific SEO → service data (auto) → global SEO
      let title = pageSeo.metaTitle;
      let description = pageSeo.metaDescription;
      let keywords = pageSeo.metaKeywords;

      if (!title && serviceData) {
        title = `${serviceData.detailTitle || serviceData.title} | ${settings.companyName || 'Solar Power House'}`;
      }
      if (!description && serviceData) {
        description = serviceData.detailDescription || serviceData.description;
      }

      // Fall back to global
      title = title || globalSeo.metaTitle;
      description = description || globalSeo.metaDescription;
      keywords = keywords || globalSeo.metaKeywords;

      if (title) document.title = title;
      updateMetaTag('description', description);
      updateMetaTag('keywords', keywords);

      // Open Graph
      updateMetaTag('og:title', title, 'property');
      updateMetaTag('og:description', description, 'property');
      if (globalSeo.ogImage) updateMetaTag('og:image', globalSeo.ogImage, 'property');

      // Twitter Card
      updateMetaTag('twitter:title', title, 'name');
      updateMetaTag('twitter:description', description, 'name');
      if (globalSeo.ogImage) updateMetaTag('twitter:image', globalSeo.ogImage, 'name');
      updateMetaTag('twitter:card', 'summary_large_image', 'name');

      if (globalSeo.favicon) updateFavicon(globalSeo.favicon);
    } catch {
      // Non-critical
    }
  };

  const updateMetaTag = (name: string, content: string | undefined, attribute: string = 'name') => {
    if (!content) return;
    let tag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (tag) {
      tag.setAttribute('content', content);
    } else {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, name);
      tag.setAttribute('content', content);
      document.head.appendChild(tag);
    }
  };

  const updateFavicon = (url: string) => {
    const existing = document.querySelector('link[rel="icon"]');
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = url;
    document.head.appendChild(link);
  };

  return null;
}
