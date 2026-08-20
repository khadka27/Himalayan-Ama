# Himalayan Ama - Search Engine Optimization (SEO) & Structured Data Documentation

This document outlines the SEO architecture, JSON-LD Schema.org implementations, metadata standardizations, dynamic sitemaps, robots.txt configuration, and maintenance protocols for **Himalayan Ama** (`https://himalayanama.com`).

---

## Table of Contents
1. [Overview & Strategy](#overview--strategy)
2. [Metadata & OpenGraph Framework](#metadata--opengraph-framework)
3. [JSON-LD Structured Data (Schemas)](#json-ld-structured-data-schemas)
4. [Sitemap & Robots.txt Configuration](#sitemap--robotstxt-configuration)
5. [Page-by-Page SEO Matrix](#page-by-page-seo-matrix)
6. [Verification & Validation Tools](#verification--validation-tools)
7. [Developer Guidelines for New Pages](#developer-guidelines-for-new-pages)

---

## 1. Overview & Strategy

Himalayan Ama is optimized for organic search visibility across luxury lodging, vacation rental, and travel hospitality search queries in Nepal (and internationally).

### Key SEO Objectives:
- **Rich Search Results**: Implement Google Rich Snippets for accommodations (`LodgingBusiness`, `Accommodation`, `Product`), blog articles (`BlogPosting`), site navigation (`BreadcrumbList`), and customer feedback (`AggregateRating`, `FAQPage`).
- **Indexation Efficiency**: Provide search engines with clean XML sitemaps containing canonical tags, change frequencies, priorities, and updated timestamps.
- **Social Media Previews**: Standardized OpenGraph (OG) and Twitter Card tags across static and dynamic detail pages.

---

## 2. Metadata & OpenGraph Framework

Metadata is managed centrally via Next.js App Router (`Metadata` export in `layout.tsx` and `page.tsx` files).

### Global Defaults (`client/app/layout.tsx`)
- **Metadata Base**: `https://himalayanama.com`
- **Title Template**: `%s | Himalayan Ama`
- **Default Title**: `Himalayan Ama | Luxury Apartment Rentals in Pokhara`
- **Description**: Detailed multi-keyword overview of Pokhara Waterfall luxury residences.
- **Canonical Tag**: Relative `/` mapping automatically to absolute URL.
- **Robots**: `index: true`, `follow: true`, with GoogleBot snippet and max-image-preview controls.
- **Favicons & Manifest**: `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `site.webmanifest`.

---

## 3. JSON-LD Structured Data (Schemas)

Structured data files are centralized in [`client/lib/seo.ts`](file:///Users/lynx/projects/Himalayan-Ama/client/lib/seo.ts) and rendered via [`client/components/seo/json-ld.tsx`](file:///Users/lynx/projects/Himalayan-Ama/client/components/seo/json-ld.tsx).

### Implemented Schema Types

| Schema Type | Description | Targeted Pages |
| :--- | :--- | :--- |
| `LodgingBusiness` | Business location, address, price range, geo-coordinates, amenities, contact details | Home (`/`) |
| `WebSite` | Sitelinks search & site publisher data | Home (`/`) |
| `Organization` | Legal entity, logo, customer contact details | Home (`/`), About (`/about`) |
| `AboutPage` | Detailed brand narrative & luxury living mission | About (`/about`) |
| `ContactPage` | Customer support channels, phone, email | Contact (`/contact`) |
| `Service` | Offered hospitality services, airport pickups, tour guidance | Services (`/services`) |
| `Accommodation` / `Product` | Rental specs, image gallery, location, and pricing | Apartment Details (`/apartments/[slug]`) |
| `ItemList` / `CollectionPage` | Catalog of available luxury apartments | Apartments (`/apartments`) |
| `BlogPosting` / `Article` | Article headline, author, publication date, image | Blog Details (`/blog/[slug]`) |
| `Blog` | Journal index & articles overview | Journal (`/blog`) |
| `FAQPage` | Frequently asked questions regarding booking and security deposits | Policies (`/policies`) |
| `BreadcrumbList` | Hierarchical URL navigation structure for search engines | All inner pages |

---

## 4. Sitemap & Robots.txt Configuration

### Dynamic XML Sitemap (`client/app/sitemap.ts`)
Accessible at `https://himalayanama.com/sitemap.xml`.
- Includes all 9 core static routes (`/`, `/apartments`, `/blog`, `/about`, `/contact`, `/services`, `/reviews`, `/policies`, `/disclaimer`).
- Dynamically queries backend API (`/api/v1/flats/published` & `/api/v1/blog/getPublishedBlogs`) to generate sitemap nodes for every active apartment and published blog article.

### Robots Directive (`client/app/robots.ts`)
Accessible at `https://himalayanama.com/robots.txt`.
- Allows full indexing (`/`) for all user-agents.
- Disallows admin and internal API endpoints (`/admin/`, `/api/`).
- Directs search engines to `https://himalayanama.com/sitemap.xml`.

---

## 5. Page-by-Page SEO Matrix

| Route | Canonical URL | Primary Schema(s) | OpenGraph Type |
| :--- | :--- | :--- | :--- |
| `/` | `https://himalayanama.com` | `LodgingBusiness`, `WebSite`, `Organization` | `website` |
| `/about` | `https://himalayanama.com/about` | `AboutPage`, `BreadcrumbList` | `website` |
| `/apartments` | `https://himalayanama.com/apartments` | `CollectionPage`, `BreadcrumbList` | `website` |
| `/apartments/[slug]` | `https://himalayanama.com/apartments/[slug]` | `Accommodation`, `Product`, `BreadcrumbList` | `website` |
| `/blog` | `https://himalayanama.com/blog` | `Blog`, `BreadcrumbList` | `website` |
| `/blog/[slug]` | `https://himalayanama.com/blog/[slug]` | `BlogPosting`, `BreadcrumbList` | `article` |
| `/contact` | `https://himalayanama.com/contact` | `ContactPage`, `BreadcrumbList` | `website` |
| `/services` | `https://himalayanama.com/services` | `Service`, `BreadcrumbList` | `website` |
| `/reviews` | `https://himalayanama.com/reviews` | `BreadcrumbList`, `AggregateRating` | `website` |
| `/policies` | `https://himalayanama.com/policies` | `FAQPage`, `BreadcrumbList` | `website` |
| `/disclaimer` | `https://himalayanama.com/disclaimer` | `BreadcrumbList` | `website` |

---

## 6. Verification & Validation Tools

After deployment, test and verify structured data using the following standard tools:
1. **Google Rich Results Test**: [https://search.google.com/test/rich-results](https://search.google.com/test/rich-results)
2. **Schema Markup Validator**: [https://validator.schema.org](https://validator.schema.org)
3. **Google Search Console**: Inspect URL indexation and submit `https://himalayanama.com/sitemap.xml`.
4. **Facebook Sharing Debugger**: [https://developers.facebook.com/tools/debug/](https://developers.facebook.com/tools/debug/)
5. **Twitter Card Validator**: [https://cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)

---

## 7. Developer Guidelines for New Pages

When creating new public pages in `client/app`:
1. Ensure `page.tsx` is a **Server Component** (do not put `"use client"` in `page.tsx`). If interactive client logic is required, move the UI to a separate `*-client.tsx` file.
2. Export `export const metadata: Metadata` with title, description, canonical link, and OpenGraph tags.
3. Import `JsonLd` component from `@/components/seo/json-ld` and utility functions from `@/lib/seo`.
4. Always add a `BreadcrumbList` schema to assist Google with URL hierarchy representation.
