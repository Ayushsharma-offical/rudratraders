import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, url, type = 'website', image, schema }) => {
  const siteUrl = 'https://rudratraders.in';
  const defaultTitle = 'Rudra Traders | Premium Spices & Logistics in Bihar';
  const defaultDescription = 'Rudra Traders provides high-quality wholesale spices, agricultural goods, and robust logistics processing in Bihar. Order premium spices in bulk today.';
  const defaultImage = `${siteUrl}/hero_banner.jpg`; // Fallback image for social sharing

  const seoTitle = title ? `${title} | Rudra Traders` : defaultTitle;
  const seoDesc = description || defaultDescription;
  const seoUrl = url ? `${siteUrl}${url}` : siteUrl;
  const seoImage = image || defaultImage;

  return (
    <Helmet>
      {/* Standard SEO Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDesc} />
      <link rel="canonical" href={seoUrl} />

      {/* Open Graph (Facebook/WhatsApp/LinkedIn) */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDesc} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDesc} />
      <meta name="twitter:image" content={seoImage} />

      {/* JSON-LD Structured Data Schema for Sitelinks & Rich Results */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
