const fs = require('fs');
const path = require('path');
const http = require('http');

console.log("Generating sitemap...");

// Base URL for the frontend
const FRONTEND_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONT_END_HOSTED || 'https://himalayanama.com';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:8000';

const sitemapPath = path.join(__dirname, '../public/sitemap.xml');

// Function to fetch data
const fetchData = (url) => {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            if (res.statusCode !== 200) {
                // If status is not 200, reject
                res.resume();
                reject(new Error(`Request to ${url} failed with status code ${res.statusCode}`));
                return;
            }

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error(`Failed to parse JSON response from ${url}: ${e.message}`));
                }
            });
        });

        req.on('error', (err) => {
            reject(new Error(`Network error fetching ${url}: ${err.message}`));
        });
    });
};

const generateSitemap = async () => {
    try {
        console.log(`Fetching blogs from ${BACKEND_URL}/api/v1/blog/getPublishedBlogs...`);

        let blogResponse = { success: false, blogs: [] };
        try {
            blogResponse = await fetchData(`${BACKEND_URL}/api/v1/blog/getPublishedBlogs`);
        } catch (fetchError) {
            console.error("Warning: Failed to fetch blogs for sitemap:", fetchError.message);
            console.error("Continuing with basic sitemap...");
        }

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${FRONTEND_URL}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${FRONTEND_URL}/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${FRONTEND_URL}/apartments</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${FRONTEND_URL}/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>`;

        if (blogResponse && (blogResponse.success || Array.isArray(blogResponse.blogs))) {
            const blogs = blogResponse.blogs || (Array.isArray(blogResponse) ? blogResponse : []);
            if (Array.isArray(blogs)) {
                console.log(`Adding ${blogs.length} blogs to sitemap.`);
                blogs.forEach(blog => {
                    const lastModDate = blog.updatedAt || blog.publishDate || new Date();
                    try {
                        xml += `
    <url>
        <loc>${FRONTEND_URL}/blog/${blog.slug}</loc>
        <lastmod>${new Date(lastModDate).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`;
                    } catch (e) {
                        console.error('Error adding blog to sitemap:', blog.slug, e.message);
                    }
                });
            }
        }

        xml += `
</urlset>`;

        fs.writeFileSync(sitemapPath, xml);
        console.log(`Sitemap generated successfully at ${sitemapPath}`);
    } catch (error) {
        console.error("Critical error generating sitemap:", error);
    }
};

generateSitemap();
