// netlify/functions/weather.js
// This function proxies weather API calls with the hidden API key

export default async (req, context) => {
    try {
        const { lat, lon } = new URL(req.url).searchParams;
        
        if (!lat || !lon) {
            return new Response(JSON.stringify({ error: 'Missing coordinates' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
