// Netlify Function to proxy weather API calls
// This keeps the API key server-side (hidden from client)

exports.handler = async (event) => {
    const { lat, lon, type } = event.queryStringParameters;
    
    if (!lat || !lon || !type) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing parameters: lat, lon, type' })
        };
    }
    
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    try {
        let url;
        
        if (type === 'weather') {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        } else if (type === 'air_pollution') {
            url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid type' })
            };
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data })
            };
        }
        
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
