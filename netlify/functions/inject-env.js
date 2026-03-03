// Netlify Function to proxy OpenWeatherMap API calls
// The API key stays on the server side, never exposed to the client

exports.handler = async (event, context) => {
    try {
        const { lat, lon, type } = event.queryStringParameters || {};
        
        if (!lat || !lon || !type) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Missing parameters: lat, lon, type' })
            };
        }
        
        // Handle reverse geocoding (no API key needed)
        if (type === 'reverse_geocoding') {
            const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=en`;
            const response = await fetch(url);
            let data;
            
            try {
                data = await response.json();
            } catch (e) {
                console.error('Failed to parse reverse geocoding response:', e);
                return {
                    statusCode: 500,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ 
                        error: 'Failed to parse reverse geocoding response',
                        statusCode: response.status
                    })
                };
            }
            
            return {
                statusCode: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify(data)
            };
        }
        
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'API key not configured' })
            };
        }
        
        let url;
        if (type === 'weather') {
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        } else if (type === 'air_pollution') {
            url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        } else {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'Invalid type parameter' })
            };
        }
        
        const response = await fetch(url);
        let data;
        
        try {
            data = await response.json();
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    error: 'Failed to parse API response',
                    statusCode: response.status
                })
            };
        }
        
        // Return the response from the API
        return {
            statusCode: response.status,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error('Proxy error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
