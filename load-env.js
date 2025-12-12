// Load environment variables from .env file for development
// This script should be loaded BEFORE app.js in index.html

window.__ENV__ = {};

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
                window.__ENV__[key.trim()] = cleanValue;
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
