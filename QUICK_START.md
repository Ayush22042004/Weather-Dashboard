<!-- QUICK START GUIDE -->

# Quick Start Guide - Weather Dashboard

## 1️⃣ Get Your API Key (2 minutes)

1. Go to https://openweathermap.org/api
2. Click "Sign Up" and create a free account
3. Go to "API keys" section (top menu)
4. Copy your key

## 2️⃣ Add API Key to Code (1 minute)

Open `app.js` and find this line (around line 6):
```javascript
OPENWEATHER_KEY: 'YOUR_OPENWEATHER_API_KEY',
```

Replace `YOUR_OPENWEATHER_API_KEY` with your copied key:
```javascript
OPENWEATHER_KEY: 'abc123def456ghi789',
```

## 3️⃣ Open the App

**Option A: Direct (Easiest)**
- Double-click `index.html`

**Option B: Local Server (Better)**

Windows PowerShell:
```powershell
cd 'e:\weather dashboard'
python -m http.server 8000
# Then open: http://localhost:8000
```

Python (any OS):
```bash
cd weather-dashboard
python -m http.server 8000
```

Node.js:
```bash
npx http-server
```

## 4️⃣ Start Using!

✅ Search for any city
✅ Click location icon to use GPS
✅ View forecasts and charts
✅ Check air quality data

## 🎨 What You Get

- 📍 Real-time weather with location search
- 📊 Interactive temperature & humidity charts
- 🌍 5-day forecast with hourly breakdown
- 💨 Air quality monitoring
- 📱 Fully responsive design
- 🌙 Dark theme with cyan accents

## ⚡ Features at a Glance

| Feature | Details |
|---------|---------|
| Search | Type city name and press Enter |
| GPS | Click location button (📍) |
| Forecasts | Hourly (24h) + Daily (5 days) |
| Charts | Temperature trends & humidity |
| Air Quality | AQI + pollutant levels |
| Mobile | 100% responsive |

## 🐛 Troubleshooting

**Blank page?**
- Open browser console (F12)
- Check if API key is set correctly
- Wait a few seconds for data to load

**API Key not working?**
- Go to openweathermap.org > API Keys
- Make sure key is active (blue dot)
- Wait 10 minutes after creation
- Try re-creating a new key

**Geolocation not working?**
- Click permission popup in browser
- Use search instead (works everywhere)

## 📚 File Overview

- `index.html` - All the HTML structure
- `styles.css` - All the styling (responsive)
- `app.js` - All the JavaScript logic
- `README.md` - Full documentation

## 🚀 Next Steps

1. **Customize Colors** - Edit CSS variables in `styles.css` (lines 1-17)
2. **Change Default City** - Edit line 527 in `app.js` (currently New York)
3. **Add More Features** - Comments in code show where to extend

## 💡 Cool Things to Try

- Search "London", "Tokyo", "Sydney"
- Try specific coordinates (e.g., "40.7128,-74.0060")
- Watch the temperature chart update
- Check different times of day for UV index changes
- Compare air quality in different cities

---

**That's it! You're ready to go! 🌤️**
