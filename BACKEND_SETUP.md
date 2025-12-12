# Weather Dashboard - Backend Setup Guide

## Overview

The weather dashboard now includes a secure backend server that handles all API calls and API key management. This ensures your OpenWeatherMap API key is never exposed to clients.

---

## ✅ Prerequisites

Before setting up the backend, ensure you have:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **OpenWeatherMap API Key** - [Get one here](https://openweathermap.org/api)
4. **Git** (optional but recommended)

---

## 🚀 Installation Steps

### Step 1: Prepare Your API Key

1. Go to [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to your API keys page
4. Copy your API key (it's a 32-character string)

### Step 2: Install Dependencies

Open PowerShell in the project folder (`e:\weather dashboard`) and run:

```powershell
npm install
```

This installs:
- `express` - Web server framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `node-fetch` - HTTP client for API calls

### Step 3: Create Environment File

Create a file named `.env` in the project folder with your API key:

```
OPENWEATHER_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=development
```

Replace `your_api_key_here` with your actual OpenWeatherMap API key.

**IMPORTANT:** Never commit `.env` to git. It's already in `.gitignore`.

### Step 4: Start the Backend Server

In PowerShell, run:

```powershell
npm start
```

Or with auto-restart on file changes (for development):

```powershell
npm run dev
```

You should see:

```
🌤️  Weather Dashboard Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on http://localhost:3000
📡 API endpoints:
   GET  /api/health           - Server health check
   GET  /api/weather          - Current weather
   GET  /api/forecast         - Weather forecast
   GET  /api/air-quality      - Air quality data
   GET  /api/geocode          - Search locations
   GET  /api/reverse-geocode  - Get location from coords
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Step 5: Open the Weather Dashboard

In a new PowerShell window, navigate to the project folder and open the app:

```powershell
start .\index.html
```

Or open it manually: `e:\weather dashboard\index.html`

---

## 🧪 Testing the Backend

### Test API Endpoints

Open your browser and test these URLs:

1. **Health Check:**
   ```
   http://localhost:3000/api/health
   ```
   Should return: `{"status":"ok","timestamp":"2024-12-12T..."}`

2. **Weather:**
   ```
   http://localhost:3000/api/weather?lat=40.7128&lon=-74.0060
   ```
   Should return current weather for New York

3. **Forecast:**
   ```
   http://localhost:3000/api/forecast?lat=40.7128&lon=-74.0060
   ```
   Should return 5-day forecast

4. **Air Quality:**
   ```
   http://localhost:3000/api/air-quality?lat=40.7128&lon=-74.0060
   ```
   Should return air quality data

5. **Geocode (Search):**
   ```
   http://localhost:3000/api/geocode?query=New%20York
   ```
   Should return search results

### Test the Frontend

1. Open the weather dashboard in your browser
2. Click the search icon
3. Type a city name (e.g., "London")
4. Select a city from suggestions
5. Weather should load

---

## 📋 API Endpoints Documentation

### GET /api/health

Check if server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-12-12T10:00:00.000Z"
}
```

---

### GET /api/weather

Get current weather data.

**Query Parameters:**
- `lat` (required) - Latitude (-90 to 90)
- `lon` (required) - Longitude (-180 to 180)

**Example:**
```
GET /api/weather?lat=40.7128&lon=-74.0060
```

**Response:** OpenWeatherMap current weather data

---

### GET /api/forecast

Get weather forecast for next 5 days.

**Query Parameters:**
- `lat` (required) - Latitude
- `lon` (required) - Longitude

**Response:** OpenWeatherMap 5-day forecast data

---

### GET /api/air-quality

Get air quality index and pollutant data.

**Query Parameters:**
- `lat` (required) - Latitude
- `lon` (required) - Longitude

**Response:** OpenWeatherMap air quality data with AQI, PM2.5, PM10, etc.

---

### GET /api/geocode

Search for locations by name.

**Query Parameters:**
- `query` (required) - Location name (max 100 chars)

**Validation:**
- Only allows letters, numbers, spaces, hyphens, and accents
- Returns validation error for special characters

**Example:**
```
GET /api/geocode?query=New%20York
```

**Response:** Array of location results with coordinates

---

### GET /api/reverse-geocode

Get location name from coordinates.

**Query Parameters:**
- `lat` (required) - Latitude
- `lon` (required) - Longitude

**Example:**
```
GET /api/reverse-geocode?lat=40.7128&lon=-74.0060
```

**Response:** Location data with city name and country

---

## 🔒 Security Features

### 1. API Key Protection
- API key is stored in `.env` (never in client code)
- Key is accessed only on the server
- Never exposed in responses or logs

### 2. Input Validation
- Location names validated (length & characters)
- Coordinates validated (range checks)
- Invalid requests rejected with error messages

### 3. Rate Limiting
- 60 requests per minute per IP address
- Returns 429 error when limit exceeded
- Prevents API abuse

### 4. Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy: default-src 'self'`

### 5. CORS Configuration
- Only allows requests from localhost:3000 and localhost:8000
- Can be configured in `server.js` for production

---

## ⚠️ Environment Variables

### Required
- `OPENWEATHER_API_KEY` - Your OpenWeatherMap API key (32 characters)

### Optional
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - `development` or `production` (default: development)

**Never commit `.env` to version control!**

---

## 🐛 Troubleshooting

### "Module not found: express"
```powershell
npm install
```

### "Cannot find .env file"
Create a `.env` file in the project root with your API key.

### "OPENWEATHER_API_KEY not found"
Make sure `.env` has the correct format:
```
OPENWEATHER_API_KEY=your_actual_key_here
```

### "Port 3000 already in use"
Either:
1. Stop the process using port 3000
2. Change PORT in `.env`: `PORT=3001`

### "Failed to fetch weather data"
1. Check backend is running: `http://localhost:3000/api/health`
2. Verify API key in `.env` is correct
3. Check internet connection

### "Too many requests" (429 error)
Rate limit reached. Wait a minute before trying again.

---

## 📦 Production Deployment

For deploying to production:

1. **Environment Variables:**
   - Set `NODE_ENV=production`
   - Use a `.env` file or environment configuration system

2. **CORS Configuration:**
   - Update `server.js` line 11 to allow your domain:
   ```javascript
   origin: ['https://yourdomain.com']
   ```

3. **Database (Optional):**
   - Consider caching API responses to reduce OpenWeatherMap calls
   - Implement request logging

4. **Hosting:**
   - Deploy to Heroku, AWS, DigitalOcean, Vercel, etc.
   - Ensure Node.js is available in production environment

5. **Monitoring:**
   - Set up error logging (e.g., Sentry)
   - Monitor rate limit usage
   - Track API performance

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Node.js Environment Variables](https://nodejs.org/en/knowledge/file-system/security/introduction/)
- [CORS Documentation](https://enable-cors.org/)

---

## ✅ Checklist

Before using the app:

- [ ] Node.js installed
- [ ] `npm install` completed
- [ ] `.env` file created with API key
- [ ] Backend server running (`npm start`)
- [ ] Can access `http://localhost:3000/api/health`
- [ ] Frontend loads without errors
- [ ] Search and location features work

---

## 🆘 Support

If you encounter issues:

1. Check the console for error messages
2. Verify `.env` file format
3. Ensure backend server is running
4. Check that port 3000 is available
5. Try restarting both backend and frontend

---

**Your secure weather dashboard is ready! 🌤️**
