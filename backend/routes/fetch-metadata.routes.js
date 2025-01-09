import express from 'express';
import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';

const router = express.Router();

// Helper function to extract Telegram username from a URL
const extractTelegramUsername = (url) => {
    const telegramRegex = /(?:https?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me)\/([a-zA-Z0-9_]+)/;
    const match = url.match(telegramRegex);
    return match ? match[1] : null; // Return the username or null if not found
};

// Controller function to fetch metadata
const fetchMetaData = async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        // Extract Telegram username
        const telegramUsername = extractTelegramUsername(url);

        // Fetch the page content and extract metadata
        const response = await fetch(url);
        const html = await response.text();
        const dom = new JSDOM(html);
        const document = dom.window.document;

        const metaData = {
            title: document.querySelector('meta[property="og:title"]')?.content ||
                   document.querySelector('title')?.textContent ||
                   'No title found',
            description: document.querySelector('meta[property="og:description"]')?.content ||
                         document.querySelector('meta[name="description"]')?.content ||
                         'No description found',
            image: document.querySelector('meta[property="og:image"]')?.content ||
                   document.querySelector('link[rel="icon"]')?.href ||
                   'No image found',
            telegramUsername: telegramUsername || 'No Telegram username found',
        };

        res.json(metaData);
    } catch (error) {
        console.error('Error fetching metadata:', error);
        res.status(500).json({ error: 'Failed to fetch metadata' });
    }
};

// Define the route
router.post('/fetch-metadata', fetchMetaData);

export default router;
