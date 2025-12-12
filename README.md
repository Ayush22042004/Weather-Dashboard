# 🌤️ SkyPulse - Weather Dashboard

A modern, responsive weather application with a secure backend. Features real-time weather data, interactive forecasts, beautiful data visualizations, air quality monitoring, and production-ready security.

**[GitHub](https://github.com/Ayush22042004/Weather-Dashboard)**

---

## ✨ Features

### Frontend
- 🌍 **Real-Time Weather Data** - Current conditions with detailed metrics
- 📍 **Smart Search** - Autocomplete city search with suggestions
- 📍 **GPS Geolocation** - Instant weather for your location
- 📊 **Interactive Charts** - Temperature trends & humidity visualization
- 💨 **Air Quality Index** - Real-time AQI and pollutant levels
- ⏰ **Hourly & 5-Day Forecasts** - Detailed weather predictions
- 📱 **Fully Responsive** - Perfect on desktop, tablet, and mobile
- 🎨 **Beautiful Themes** - Auto day/night switching with smooth animations
- ⚡ **Fast & Smooth** - Optimized performance

### Backend (Express.js)
- 🔐 **Secure API Key Management** - Keys stored in environment variables
- 🛡️ **Security Headers** - CORS, CSP, XSS Protection
- ⚡ **Rate Limiting** - 60 requests/minute per IP
- ✓ **Input Validation** - All endpoints validate user input
- 🔄 **RESTful API** - 6 professional endpoints
- 📝 **Error Handling** - Comprehensive error responses
- 🚀 **Production Ready** - Enterprise-level reliability

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

- **[SETUP.md](./SETUP.md)** - Detailed setup guide
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Backend API documentation
- **[SECURITY_AUDIT.md](./SECURITY_AUDIT.md)** - Security implementation details
- **[COMPLETE_SOLUTION.md](./COMPLETE_SOLUTION.md)** - Full architecture overview

---

## 🏗️ Project Structure

```
weather-dashboard/
├── index.html              # Main HTML file
├── app.js                  # Frontend logic (1149 lines)
├── styles.css              # Styling (1302 lines)
├── server.js               # Backend server (228 lines)
├── package.json            # Dependencies
├── .env.example            # Environment template
├── .env                    # Your configuration (git ignored)
├── node_modules/           # Dependencies (git ignored)
├── README.md               # This file
└── docs/                   # Documentation files
```

---

## 🔌 API Endpoints

The backend provides these secure endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/weather?lat=X&lon=Y` | Current weather |
| GET | `/api/forecast?lat=X&lon=Y` | 5-day forecast |
| GET | `/api/air-quality?lat=X&lon=Y` | Air quality data |
| GET | `/api/geocode?query=city` | Search locations |
| GET | `/api/reverse-geocode?lat=X&lon=Y` | Get location name |

---

## 🔐 Security Features

✅ **API Key Protection** - Stored in environment variables, never exposed  
✅ **CORS Configuration** - Prevents unauthorized cross-origin requests  
✅ **Rate Limiting** - 60 requests/minute per IP  
✅ **Input Validation** - All parameters validated  
✅ **Security Headers** - CSP, X-Frame-Options, XSS-Protection  
✅ **Error Handling** - Safe error messages without exposing internals  

---

## 🛠️ Development

### Available Scripts

```bash
# Start server (production)
npm start

# Start server with auto-reload
npm run dev

# Install dependencies
npm install
```

### Environment Variables

```env
# Required
OPENWEATHER_API_KEY=your_key_here

# Optional
PORT=3000
NODE_ENV=development
```

---

## 📊 Technologies

**Frontend**
- Vanilla JavaScript (ES6+)
- Chart.js - Beautiful data visualization
- CSS3 - Modern styling & animations
- Responsive Design

**Backend**
- Node.js - JavaScript runtime
- Express.js - Web framework
- dotenv - Environment configuration
- node-fetch - HTTP requests

**APIs Used**
- OpenWeatherMap - Weather data
- Open-Meteo - Additional weather data

---

## 🎨 Themes

The app automatically switches between themes based on sunrise/sunset:

- **Day Theme** - Vibrant blue, golden yellow, orange (sunrise gradient)
- **Night Theme** - Elegant navy, indigo, purple (starry night gradient)

Custom themes can be configured in `styles.css`.

---

## 💡 Features Highlight

### Real-Time Updates
- Current weather with feels-like temperature
- Humidity, pressure, wind speed
- Visibility and cloud coverage

### Forecasting
- 8-hour detailed hourly forecast
- 5-day weather prediction
- Precipitation probability

### Air Quality
- AQI (Air Quality Index) rating
- PM2.5, PM10 levels
- NO₂ and O₃ measurements
- Health recommendations

### Charts
- 24-hour temperature trend
- Humidity & precipitation graph
- Beautiful gradient visualizations

---

## 🐛 Known Limitations

- OpenWeatherMap free tier: 1000 calls/day
- Air quality data may be unavailable for some regions
- Some countries have limited forecast data

---

## 🚀 Deployment

### Deploy Frontend (Netlify, Vercel, GitHub Pages)
1. Push code to GitHub
2. Connect to Netlify/Vercel
3. Set build command: `npm install`
4. Set output directory: `.`

### Deploy Backend (Heroku, AWS, DigitalOcean)
1. Create account on hosting platform
2. Set environment variables (API key, PORT)
3. Deploy `server.js` and `package.json`
4. Update frontend API base URL

**Example Backend URLs:**
- Heroku: `https://your-app-name.herokuapp.com/api/`
- AWS: `https://api.yourdomain.com/api/`
- Docker: `docker build -t weather-app .`

---

## 📝 License

MIT License - Feel free to use this project for personal or commercial use.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

## 📧 Support

For issues or questions:
1. Check [BACKEND_SETUP.md](./BACKEND_SETUP.md) troubleshooting section
2. Review error messages in browser console
3. Verify API key is valid and has sufficient quota
4. Ensure `.env` file is properly configured

---

**Made with ❤️ for weather enthusiasts**  
Last Updated: December 2025

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
