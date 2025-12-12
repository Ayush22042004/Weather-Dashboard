// Load environment variables from .env file for development
// This script should be loaded BEFORE app.js in index.html

window.__ENV__ = {};

// For Netlify: create a namespace for injected variables
window.__netlify = window.__netlify || {};

// Try to fetch .env file synchronously by using XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.open('GET', '.env', false); // false = synchronous
xhr.onload = function() {
    if (xhr.status === 200) {
        const envText = xhr.responseText;
        const lines = envText.split('\n');
        
        lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#')) {
                const [key, ...valueParts] = line.split('=');
                const value = valueParts.join('=').trim();
                
                // Remove quotes if present
                const cleanValue = value.replace(/^["']|["']$/g, '');
                const cleanKey = key.trim();
                window.__ENV__[cleanKey] = cleanValue;
                
                // Also expose OPENWEATHER_API_KEY for Netlify compatibility
                if (cleanKey === 'VITE_OPENWEATHER_API_KEY') {
                    window.__netlify.OPENWEATHER_API_KEY = cleanValue;
                }
            }
        });
        
        console.log('✅ Environment variables loaded from .env');
    }
};

try {
    xhr.send();
} catch (error) {
    console.log('ℹ️ .env file not found (this is normal in production)');
}
