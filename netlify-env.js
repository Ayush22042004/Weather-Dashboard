// Inject Netlify environment variables into window object
// This allows client-side code to access build-time environment variables
(function() {
    // Create a global object for Netlify environment variables
    window.__netlify = window.__netlify || {};
    
    // For Netlify, environment variables are NOT directly accessible in static sites
    // But we can pass them through the HTML via build plugins or serverless functions
    // This script will be supplemented by load-env.js which loads from .env file
    
    console.log('Netlify environment variables initialized');
})();
