# 🌤️ Weather Dashboard

A beautiful, responsive weather application built with vanilla JavaScript. Get real-time weather, interactive forecasts, air quality data, and stunning visualizations—all deployed as a static site.

**[Live Demo](https://skypulse2.netlify.app/) | [GitHub](https://github.com/Ayush22042004/Weather-Dashboard)**

---

## ✨ Features

✅ **Real-Time Weather Data** - Current conditions with 6+ detailed metrics  
✅ **Smart Search** - Autocomplete city search with instant suggestions  
✅ **GPS Geolocation** - One-click weather for your location  
✅ **24-Hour Hourly Forecast** - Scrollable hourly weather with navigation  
✅ **5-Day Forecast** - Daily predictions with high/low temperatures  
✅ **Interactive Charts** - Beautiful temperature & humidity visualizations  
✅ **Air Quality Index** - Real-time AQI and pollutant levels  
✅ **Timezone-Aware** - Accurate times for any location globally  
✅ **Auto Day/Night Theme** - Smooth transitions with gorgeous gradients  
✅ **Fully Responsive** - Perfect on desktop, tablet, and mobile  
✅ **No Backend Required** - Pure static site, instant deployment  
✅ **Zero Dependencies** - Vanilla JavaScript, lightweight performance

---

## 🚀 Quick Start (30 Seconds)

### Option 1: Open Directly
```bash
# Clone the repository
git clone https://github.com/Ayush22042004/Weather-Dashboard.git
cd Weather-Dashboard

# Open in browser
start index.html
# or open index.html with your browser
```

### Option 2: Deploy to Netlify/Vercel
1. Fork this repository
2. Connect to Netlify or Vercel
3. Select this folder
4. Deploy! 🚀

### Option 3: Run Local Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (using http-server)
npx http-server
```

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 14+ installed
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Setup

1. **Get API Key** (2 min)
   - Visit https://openweathermap.org/api
   - Sign up (free)
   - Copy your API key

2. **Create `.env` file** (1 min)
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

3. **Install & Run** (2 min)
   ```bash
   npm install
   npm start
   ```

4. **Open App**
   ```
   http://localhost:3000/index.html
   or simply open index.html in your browser
   ```

---

## 📋 Documentation

Visit the [GitHub](https://github.com/Ayush22042004/Weather-Dashboard) repository for more information.

---

## 🏗️ Project Structure

```
weather-dashboard/
├── index.html              # HTML structure (200 lines)
├── app.js                  # JavaScript logic (1530 lines)
├── styles.css              # Styling & animations (1571 lines)
├── netlify.toml            # Deployment config
├── _redirects              # URL redirects for SPA
├── package.json            # Dependencies
├── README.md               # This file
└── .git/                   # Version control
```

**Total Size:** ~100KB uncompressed | **No build process** | **Zero runtime dependencies**

---

## 🔌 APIs Used

| API | Purpose | Free Tier |
|-----|---------|-----------|
| OpenWeatherMap | Current weather, forecasts | 1000 calls/day |
| Open-Meteo | Geocoding, timezone data | Unlimited |

---

---

## 📊 Technologies

**Frontend**
- Vanilla JavaScript (ES6+) - No frameworks
- Chart.js - Beautiful data visualization
- CSS3 - Modern styling & animations
- Responsive design with mobile-first approach

**APIs**
- OpenWeatherMap API - Weather data
- Open-Meteo API - Geocoding and timezone data

**Deployment**
- Netlify - Static site hosting
- GitHub Pages - Alternative hosting

---

## 🎨 Themes

The app automatically switches between themes based on time of day:

- **Day Theme** - Sky blue (#87CEEB) to golden yellow (#FFD700) gradient
- **Night Theme** - Elegant navy, indigo, purple starry night gradient
- **Smooth Transitions** - Auto switching at sunrise/sunset

All labels are styled in cyan blue (#00d4ff) with text shadows for perfect readability.

---

## 💡 Key Features Explained

### Real-Time Updates
- Current temperature with feels-like value
- Humidity, pressure, wind speed & direction
- Visibility and cloud coverage
- Sunrise/sunset times

### Smart Forecasting
- **24-Hour Hourly Forecast** - Complete day with hour-by-hour breakdown
- **5-Day Daily Forecast** - High/low temps and rain probability
- **Timezone-Aware** - Accurate times for any location worldwide
- **Keyboard Navigation** - Use arrow keys to browse hourly forecast

### Air Quality Monitoring
- Real-time AQI (Air Quality Index) 1-5 scale
- Pollutant breakdown: PM2.5, PM10, NO₂, O₃
- Color-coded severity (green to red)
- Health recommendations based on AQI

### Beautiful Visualizations
- 24-hour temperature trend chart
- Humidity & precipitation dual-axis chart
- Interactive legends (toggle data on/off)
- Smooth animations and gradients

---

## 🐛 Known Limitations

- OpenWeatherMap free tier: 1000 API calls/day
- Air quality data unavailable for some regions
- Some countries have limited forecast data availability

---

## 🚀 Deployment

### Deploy to Netlify (Recommended - 2 minutes)
1. Fork the repository on GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your fork
5. Deploy! It's live 🚀

### Deploy to Vercel (2 minutes)
1. Fork the repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import from Git
5. Deploy! 🚀

### Deploy to GitHub Pages (2 minutes)
1. Push code to GitHub
2. Go to Settings > Pages
3. Select "Deploy from a branch"
4. Select "main" branch
5. Live at `username.github.io/Weather-Dashboard` 🚀

---

## 🐛 Troubleshooting

### "Failed to fetch weather data"
✓ Verify internet connection  
✓ Check browser console (F12) for errors  
✓ OpenWeatherMap API might be rate limited  
✓ Try searching for "London" to test

### "Search suggestions not appearing"
✓ Clear browser cache (Ctrl+Shift+Del)  
✓ Check JavaScript is enabled  
✓ Verify browser console for errors

### "Charts not displaying"
✓ Clear cache and refresh (Ctrl+Shift+R)  
✓ Check Chart.js CDN loads in Network tab (F12)  
✓ Verify no console errors

### "Geolocation not working"
✓ Allow browser permission when prompted  
✓ HTTPS required for some browsers (Netlify provides this)  
✓ Location services must be enabled on device

---

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 📧 Support

- **Questions?** Check the GitHub issues
- **API problems?** Check [OpenWeatherMap Status](https://openweathermap.org/)
- **Deploy issues?** Check Netlify/Vercel documentation

---

## 🙏 Credits

- [OpenWeatherMap](https://openweathermap.org/) - Weather data API
- [Open-Meteo](https://open-meteo.com/) - Geocoding & timezone API
- [Chart.js](https://www.chartjs.org/) - Charts library
- [Font Awesome](https://fontawesome.com/) - Icons

---

## 📈 Performance Metrics

- ✅ **~100KB total** - Lightweight and fast
- ✅ **0 dependencies** - Pure vanilla JavaScript
- ✅ **Instant load** - No build process needed
- ✅ **GPU optimized** - Smooth 60 FPS animations
- ✅ **Mobile first** - Responsive on all devices
- ✅ **Accessible** - Semantic HTML & ARIA labels

---

## 🎓 What You Can Learn

By exploring this project:
- API integration with real-world data
- Responsive CSS Grid & Flexbox
- Vanilla JavaScript ES6+ patterns
- Data visualization with Chart.js
- Browser Geolocation API
- Timezone handling & calculations
- Error handling & loading states
- Static site deployment

---

## 🚀 Future Ideas

- [ ] Multiple city comparison
- [ ] Favorite locations with localStorage
- [ ] Manual theme switcher
- [ ] Temperature unit toggle (°C/°F)
- [ ] Weather alerts & notifications
- [ ] PWA with offline support
- [ ] Mobile app (React Native)
- [ ] Dark/light mode toggle

---

⭐ **If you found this helpful, please star the repository!** ⭐

**Made with ❤️ and ☕ by [Ayush22042004](https://github.com/Ayush22042004)**
**thanks for reading**

*Last Updated: December 2025*
