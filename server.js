// Backend Server for Weather Dashboard
// Handles API calls with proper authentication and security

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:8000', 'http://127.0.0.1:3000', 'http://127.0.0.1:8000'],
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

// Security Headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline';");
    next();
});

// OpenWeather API Key (stored securely in environment variable)
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'demo_key';
const OPENWEATHER_BASE = 'https://api.openweathermap.org/data/2.5';
const OPENMETEO_BASE = 'https://api.open-meteo.com/v1';
const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1';

// Rate limiting (simple in-memory implementation)
const requestCounts = {};
const RATE_LIMIT = 60; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(ip) {
    const now = Date.now();
    if (!requestCounts[ip]) {
        requestCounts[ip] = [];
    }
    
    // Remove old requests outside the window
    requestCounts[ip] = requestCounts[ip].filter(time => now - time < RATE_WINDOW);
    
    if (requestCounts[ip].length >= RATE_LIMIT) {
        return false;
    }
    
    requestCounts[ip].push(now);
    return true;
}

// Rate limiting middleware
app.use((req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    if (!checkRateLimit(ip)) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get weather data
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Missing latitude and longitude' });
        }
        
        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }
        
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Coordinates out of range' });
        }
        
        // Call OpenWeatherMap API
        const response = await fetch(
            `${OPENWEATHER_BASE}/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error(`OpenWeather API error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data', details: error.message });
    }
});

// Get forecast data
app.get('/api/forecast', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Missing latitude and longitude' });
        }
        
        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }
        
        // Call OpenWeatherMap API
        const response = await fetch(
            `${OPENWEATHER_BASE}/forecast?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        
        if (!response.ok) {
            throw new Error(`OpenWeather API error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Forecast API error:', error);
        res.status(500).json({ error: 'Failed to fetch forecast data', details: error.message });
    }
});

// Get air quality data
app.get('/api/air-quality', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Missing latitude and longitude' });
        }
        
        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }
        
        // Call OpenWeatherMap API
        const response = await fetch(
            `${OPENWEATHER_BASE}/air_pollution?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
        );
        
        if (!response.ok) {
            throw new Error(`OpenWeather API error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Air quality API error:', error);
        res.status(500).json({ error: 'Failed to fetch air quality data', details: error.message });
    }
});

// Geocode location
app.get('/api/geocode', async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Missing search query' });
        }
        
        // Validate input
        if (query.length > 100 || !/^[a-zA-Z0-9\s\-,áéíóúàèìòùäëïöüñ]*$/.test(query)) {
            return res.status(400).json({ error: 'Invalid search query' });
        }
        
        // Call Open-Meteo Geocoding API
        const response = await fetch(
            `${GEOCODING_BASE}/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
        );
        
        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Geocoding API error:', error);
        res.status(500).json({ error: 'Failed to geocode location', details: error.message });
    }
});

// Reverse geocode (get location name from coordinates)
app.get('/api/reverse-geocode', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'Missing latitude and longitude' });
        }
        
        // Validate coordinates
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        
        if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }
        
        // Call Open-Meteo Reverse Geocoding API
        const response = await fetch(
            `${GEOCODING_BASE}/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
        );
        
        if (!response.ok) {
            throw new Error(`Reverse geocoding API error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Reverse geocoding API error:', error);
        res.status(500).json({ error: 'Failed to reverse geocode', details: error.message });
    }
});

// Serve index.html for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handling
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🌤️  Weather Dashboard Backend`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints:`);
    console.log(`   GET  /api/health           - Server health check`);
    console.log(`   GET  /api/weather          - Current weather`);
    console.log(`   GET  /api/forecast         - Weather forecast`);
    console.log(`   GET  /api/air-quality      - Air quality data`);
    console.log(`   GET  /api/geocode          - Search locations`);
    console.log(`   GET  /api/reverse-geocode  - Get location from coords`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📝 Environment variables needed:`);
    console.log(`   OPENWEATHER_API_KEY        - Your OpenWeatherMap API key`);
    console.log(`   PORT                       - Server port (default: 3000)`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
});

module.exports = app;
