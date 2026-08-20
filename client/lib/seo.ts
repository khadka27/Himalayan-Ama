export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://himalayanama.com";
export const SITE_NAME = "Himalayan Ama";
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:8000";

export interface FlatItem {
    _id?: string;
    slug?: string;
    flatName?: string;
    description?: string;
    imagesUri?: string[];
    location?: string;
    bedrooms?: number;
    rooms?: number;
    price?: number | string;
    rate?: number | string;
    currency?: string;
}

export interface BlogItem {
    _id?: string;
    slug?: string;
    title?: string;
    shortDescription?: string;
    subtitle?: string;
    bannerImageURI?: string;
    publishDate?: string;
    createdAt?: string;
    updatedAt?: string;
    author?: {
        authorName?: string;
    };
}

export interface ReviewItem {
    userName?: string;
    review?: string;
    rating?: number;
    createdAt?: string;
}

export function getImageUrl(path?: string): string {
    if (!path) return `${SITE_URL}/og-image.jpg`;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${BACKEND_URL}/images/${path}`;
}

export function getLodgingBusinessSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "@id": `${SITE_URL}/#lodging`,
        "name": SITE_NAME,
        "alternateName": "Himalayan Ama Luxury Apartments",
        "description": "Experience luxury living at Himalayan Ama. We offer premium apartment rentals in Pokhara Waterfall, providing comfort, style, and authentic Nepalese hospitality.",
        "url": SITE_URL,
        "telephone": "+977-9816685279",
        "email": "info@himalayanama.com",
        "logo": `${SITE_URL}/favicon-32x32.png`,
        "image": `${SITE_URL}/og-image.jpg`,
        "priceRange": "$$",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Pokhara Waterfall Area",
            "addressLocality": "Pokhara",
            "addressRegion": "Kaski",
            "postalCode": "33700",
            "addressCountry": "NP"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "28.1923",
            "longitude": "83.9745"
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
        },
        "amenityFeature": [
            { "@type": "LocationFeatureSpecification", "name": "Free High-Speed Wi-Fi", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Mountain Views", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Fully Equipped Kitchen", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "24/7 Concierge Service", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Private Balcony", "value": true },
            { "@type": "LocationFeatureSpecification", "name": "Housekeeping", "value": true }
        ],
        "sameAs": [
            "https://facebook.com/himalayanama",
            "https://instagram.com/himalayanama"
        ]
    };
}

export function getWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        "url": SITE_URL,
        "name": SITE_NAME,
        "description": "Luxury Apartment Rentals in Pokhara, Nepal",
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/favicon-32x32.png`
            }
        }
    };
}

export function getOrganizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": SITE_NAME,
        "url": SITE_URL,
        "logo": `${SITE_URL}/favicon-32x32.png`,
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+977-9816685279",
            "contactType": "customer service",
            "areaServed": "NP",
            "availableLanguage": ["English", "Nepali"]
        }
    };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.item.startsWith("http") ? item.item : `${SITE_URL}${item.item}`
        }))
    };
}

export function getApartmentSchema(flat: FlatItem) {
    if (!flat) return null;
    const images = (flat.imagesUri || []).map((img: string) => getImageUrl(img));
    if (images.length === 0) images.push(`${SITE_URL}/og-image.jpg`);

    return {
        "@context": "https://schema.org",
        "@type": ["Accommodation", "Product"],
        "@id": `${SITE_URL}/apartments/${flat._id || flat.slug || ''}#apartment`,
        "name": flat.flatName || "Luxury Apartment",
        "description": flat.description || `Luxury apartment ${flat.flatName || ''} in Pokhara.`,
        "image": images,
        "url": `${SITE_URL}/apartments/${flat._id || flat.slug || ''}`,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": flat.location || "Pokhara",
            "addressRegion": "Kaski",
            "addressCountry": "NP"
        },
        "numberOfRooms": flat.bedrooms || flat.rooms || 1,
        "offers": {
            "@type": "Offer",
            "price": flat.price || flat.rate || "100",
            "priceCurrency": flat.currency || "NPR",
            "availability": "https://schema.org/InStock",
            "url": `${SITE_URL}/apartments/${flat._id || flat.slug || ''}`
        }
    };
}

export function getApartmentsListSchema(flats: FlatItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Luxury Apartments Portfolio",
        "description": "Collection of luxury residences and apartments in Pokhara Waterfall by Himalayan Ama.",
        "itemListElement": (flats || []).map((flat, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": flat.flatName || "Luxury Residence",
            "url": `${SITE_URL}/apartments/${flat._id}`
        }))
    };
}

export function getBlogPostingSchema(blog: BlogItem) {
    if (!blog) return null;
    const bannerImage = getImageUrl(blog.bannerImageURI);

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${SITE_URL}/blog/${blog.slug || ''}#article`,
        "headline": blog.title || "Article",
        "description": blog.shortDescription || blog.subtitle || blog.title,
        "image": [bannerImage],
        "datePublished": blog.publishDate || blog.createdAt || new Date().toISOString(),
        "dateModified": blog.updatedAt || blog.publishDate || blog.createdAt || new Date().toISOString(),
        "author": {
            "@type": "Person",
            "name": blog.author?.authorName || "Himalayan Ama Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {
                "@type": "ImageObject",
                "url": `${SITE_URL}/favicon-32x32.png`
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${blog.slug || ''}`
        }
    };
}

export function getBlogListSchema(blogs: BlogItem[]) {
    return {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Himalayan Ama Journal",
        "description": "Travel guides, local stories, and insights into luxury living in Pokhara, Nepal.",
        "url": `${SITE_URL}/blog`,
        "blogPost": (blogs || []).map(blog => getBlogPostingSchema(blog))
    };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

export function getAggregateRatingSchema(reviews: ReviewItem[]) {
    const total = reviews.length;
    if (total === 0) return null;
    const sum = reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0);
    const avg = (sum / total).toFixed(1);

    return {
        "@context": "https://schema.org",
        "@type": "LodgingBusiness",
        "name": SITE_NAME,
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": avg,
            "reviewCount": total,
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": reviews.map(rev => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": rev.userName || "Guest"
            },
            "datePublished": rev.createdAt || new Date().toISOString(),
            "reviewBody": rev.review || "",
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": rev.rating || 5,
                "bestRating": "5",
                "worstRating": "1"
            }
        }))
    };
}
