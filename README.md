# 🌤️ SkyPulse - Weather Dashboard

A modern, responsive weather application built with vanilla JavaScript. Features real-time weather data, interactive forecasts, beautiful data visualizations, and air quality monitoring.

**[View Live Demo](https://skypulse2.netlify.app/) | [GitHub](https://github.com/Ayush22042004/Weather-Dashboard)**

---

## ✨ Features

- 🌍 **Real-Time Weather Data** - Current conditions with detailed metrics
- 📍 **Smart Search** - Autocomplete city search with suggestions
- 📍 **GPS Geolocation** - Instant weather for your location
- 📊 **Interactive Charts** - Temperature trends & humidity visualization
- 💨 **Air Quality Index** - Real-time AQI and pollutant levels
- ⏰ **Hourly & 5-Day Forecasts** - Detailed weather predictions
- 📱 **Fully Responsive** - Perfect on desktop, tablet, and mobile
- 🎨 **Modern Design** - Dark theme with smooth animations
- ⚡ **Fast & Lightweight** - No build required, instant deployment

---

## 🚀 Quick Start

### Option 1: Online (Easiest)
Just open in browser - no setup needed!
```
index.html → Open in browser
```

### Option 2: Local Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server
```
Then visit `http://localhost:8000`

### Configuration
1. Get free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Open `app.js` and add your key (line 3):
```javascript
OPENWEATHER_KEY: 'your_api_key_here',
```
3. Done! ✅

---

## 📸 Screenshot

```
[Live Dashboard]
- Real-time weather with temperature
- 6 detailed metrics (humidity, wind, pressure, etc.)
- Hourly forecast cards
- 5-day forecast
- Interactive charts
- Air quality monitoring
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript |
| **API** | OpenWeatherMap (free tier) |
| **Charts** | Chart.js |
| **Icons** | Font Awesome 6 |
| **Deployment** | GitHub Pages / Netlify / Vercel |

---

## 📁 Project Structure

```
weather-dashboard/
├── index.html          # HTML structure
├── styles.css          # Styling & responsive design (700+ lines)
├── app.js              # Complete JavaScript logic (680+ lines)
└── README.md           # This file
```

**Total Size:** ~50KB | **No build process** | **Zero dependencies**

---

## 🎯 Core Features

### 1️⃣ Current Weather Display
- Large temperature with gradient text
- Weather condition & description
- 6 metrics: humidity, wind speed, pressure, visibility, feels-like, UV index
- Real-time date/time display

### 2️⃣ Smart Search
- Autocomplete suggestions as you type
- Real-time city search
- Debounced API calls (no rate limit issues)
- Keyboard support (Enter to search)

### 3️⃣ Geolocation
- Click location button for instant weather
- Browser permission handling
- Graceful error messages

### 4️⃣ Forecasts
- **Hourly:** Next 24 hours (3-hour intervals)
- **Daily:** Next 5 days with high/low temps
- **Rain Probability:** Calculated for each day

### 5️⃣ Data Visualization
- **Temperature Chart:** Real vs feels-like temperature trend
- **Humidity Chart:** Humidity % and precipitation
- **Interactive Legends:** Toggle data series on/off

### 6️⃣ Air Quality Monitoring
- Real-time AQI (1-5 scale)
- Pollutant levels (PM2.5, PM10, NO₂, O₃)
- Color-coded severity indicators
- Health recommendations

---

## 📱 Responsive Design

| Device | Breakpoint | Layout |
|--------|-----------|--------|
| Desktop | 1400px+ | Full grid layout |
| Laptop | 1024px | Minor adjustments |
| Tablet | 768px | Stacked cards |
| Mobile | 480px | Single column |

---

## 🎨 Design Highlights

### Color Palette
- **Primary:** Cyan (#00d4ff)
- **Secondary:** Teal (#4ecdc4)
- **Background:** Dark Navy (#0f1419)
- **Cards:** Darker Navy (#1a1f2e)

### UI/UX Features
- Smooth cubic-bezier animations
- Glassmorphism with backdrop blur
- Gradient overlays
- Floating animations
- Hover transformations

---

## 🔌 API Endpoints Used

```
1. Geocoding      → GET /geo/1.0/direct
2. Weather        → GET /data/2.5/weather
3. Forecast       → GET /data/2.5/forecast
4. Air Pollution  → GET /data/2.5/air_pollution
```

All from OpenWeatherMap API (free tier)

---

## 🚀 Deployment

### GitHub Pages (Recommended)
```bash
git push origin main
# Then enable Pages in Settings
```

### Netlify
```bash
# Drag & drop folder or
netlify deploy --prod --dir .
```

### Vercel
```bash
vercel --prod
```

**No build process needed!** Deploy as-is.

---

## 📊 Performance

- ✅ **~50KB total size** - Smaller than a single image
- ✅ **Instant deployment** - No build required
- ✅ **Fast load time** - < 2 seconds
- ✅ **Zero backend** - Static files only
- ✅ **GPU-accelerated animations** - Smooth on all devices
- ✅ **Debounced search** - Prevents API abuse

---

## 🐛 Troubleshooting

### "Failed to fetch weather"
- Check API key in browser console (F12)
- Verify key is active in OpenWeatherMap dashboard
- Try searching "London"

### "Search dropdown not showing"
- Check browser console for errors
- Verify JavaScript is enabled
- Clear browser cache

### "Charts not displaying"
- Open DevTools (F12) > Network tab
- Verify Chart.js CDN loads
- Check for console errors

### "Geolocation not working"
- Allow browser permission when prompted
- Some browsers require HTTPS
- Try on localhost or live server

---

## 💡 Code Quality

```javascript
// Modern ES6+ code
async/await    ✅
Arrow functions ✅
Template literals ✅
Destructuring   ✅
Fetch API       ✅
Event listeners ✅
```

### File Sizes
- `index.html` - 6 KB
- `styles.css` - 19 KB  
- `app.js` - 25 KB
- **Total - 50 KB** (uncompressed)

---

## 🎓 What You'll Learn

By studying this project:
- API integration with real-world data
- Responsive CSS Grid & Flexbox
- Vanilla JavaScript (ES6+)
- Chart.js data visualization
- Geolocation API
- Error handling & loading states
- Deployment strategies

---

## 🚀 Future Enhancements

- [ ] Multiple city comparison
- [ ] Favorite locations with localStorage
- [ ] Theme switcher (light/dark)
- [ ] Temperature unit toggle (°C/°F)
- [ ] Weather alerts & notifications
- [ ] Pollen & allergy forecasts
- [ ] Sunrise/sunset times
- [ ] PWA (offline support)
- [ ] Mobile app version

---

## 📞 Support

- **Issues?** Check browser console (F12)
- **API Down?** Check [OpenWeatherMap Status](https://openweathermap.org/)
- **Want to contribute?** Fork and submit a PR!

---

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

---

## 👨‍💻 Author

Built by a 21-year-old engineering student as a full-featured weather application.

**[GitHub](https://github.com/Ayush22042004) | [Portfolio](#)**

---

## 🙏 Credits

- [OpenWeatherMap](https://openweathermap.org/) - Weather data
- [Chart.js](https://www.chartjs.org/) - Charts
- [Font Awesome](https://fontawesome.com/) - Icons

---

⭐ If you found this helpful, please star the repository! ⭐

**Made with ❤️ and ☕**
