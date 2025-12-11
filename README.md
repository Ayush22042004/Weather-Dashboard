# 🌤️ Weather Dashboard

A modern, responsive weather application built with vanilla JavaScript, featuring real-time weather data, detailed forecasts, and beautiful data visualizations.

## Features

### 🎯 Core Features
- **Real-Time Weather Data** - Current conditions, hourly & 5-day forecasts
- **Location-Based Forecasts** - Search any city or use GPS geolocation
- **Interactive Charts** - Temperature trends and humidity analysis with Chart.js
- **Air Quality Monitoring** - Real-time AQI and pollutant levels
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### 🎨 Technical Highlights
- **Modern UI/UX** - Dark theme with cyan/teal gradient accents
- **Smooth Animations** - Fade-ins, hover effects, and transitions
- **Real-Time Updates** - Automatic timestamp tracking
- **Glassmorphism Design** - Backdrop blur effects and layered cards
- **Professional Data Visualization** - Dual-axis charts and gradient fills

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone or download the project**
   ```bash
   cd weather-dashboard
   ```

2. **Get a Free OpenWeatherMap API Key**
   - Visit https://openweathermap.org/api
   - Sign up for a free account
   - Navigate to API keys section
   - Copy your API key

3. **Configure API Key**
   - Open `app.js`
   - Replace `YOUR_OPENWEATHER_API_KEY` with your actual key (line 6):
   ```javascript
   const API_CONFIG = {
       OPENWEATHER_KEY: 'YOUR_OPENWEATHER_API_KEY',
       // ... rest of config
   };
   ```

4. **Open in Browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js (if installed)
   npx http-server
   ```
   - Then navigate to `http://localhost:8000`

## Usage

### Search for a City
1. Type a city name in the search box
2. Click the search button or press Enter
3. Weather data updates automatically

### Use Current Location
1. Click the location icon (📍) in the header
2. Allow browser to access your location
3. Weather data for your location loads instantly

### View Details
- **Current Weather Card** - Temperature, conditions, and 6 weather metrics
- **Hourly Forecast** - Next 24 hours in 3-hour intervals
- **5-Day Forecast** - Daily high/low temps and rain probability
- **Temperature Chart** - 24-hour trend with "feels like" comparison
- **Humidity Chart** - Humidity percentage and precipitation rates
- **Air Quality Section** - AQI index and pollutant concentrations

## Project Structure

```
weather-dashboard/
├── index.html          # Main HTML file
├── styles.css          # Responsive styles & animations
├── app.js              # Core JavaScript logic
└── README.md           # This file
```

## Technical Stack

- **HTML5** - Semantic markup
- **CSS3** - Grid, Flexbox, animations, gradients
- **Vanilla JavaScript** - ES6+ with async/await
- **Chart.js** - Data visualization library
- **OpenWeatherMap API** - Weather data source
- **Font Awesome** - Icons

## API Integration

### Endpoints Used

1. **Geocoding API** - Convert city names to coordinates
   ```
   GET /geo/1.0/direct?q={city}&limit=1&appid={key}
   ```

2. **Current Weather API** - Real-time conditions
   ```
   GET /data/2.5/weather?lat={lat}&lon={lon}&units=metric&appid={key}
   ```

3. **Forecast API** - 5-day forecast with hourly data
   ```
   GET /data/2.5/forecast?lat={lat}&lon={lon}&units=metric&appid={key}
   ```

4. **Air Pollution API** - Air quality data
   ```
   GET /data/2.5/air_pollution?lat={lat}&lon={lon}&appid={key}
   ```

## Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Cyan | `#00d4ff` |
| Secondary | Teal | `#4ecdc4` |
| Accent Red | Red | `#ff6b6b` |
| Background | Dark Navy | `#0f1419` |
| Card | Darker Navy | `#1a1f2e` |
| Text Primary | White | `#ffffff` |
| Text Secondary | Gray | `#b0b0b0` |

## Responsive Breakpoints

- **Desktop** - 1400px max-width with grid layouts
- **Tablet** - 768px breakpoint with adjusted spacing
- **Mobile** - 480px breakpoint with optimized cards

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Optimizations

- **Lazy Loading** - Images load on demand
- **Debounced Search** - Prevents excessive API calls
- **Chart Destruction** - Previous charts cleared before rendering new ones
- **CSS Grid** - Efficient responsive layouts
- **Backdrop Filter** - GPU-accelerated blur effects

## Features Breakdown

### 1. Current Weather Display
- Large temperature display with gradient text
- Weather description and icon
- 6 detailed metrics (humidity, wind, pressure, visibility, feels-like, UV index)
- Date and time display

### 2. Hourly Forecast
- 24-hour forecast in 3-hour intervals
- Temperature and feel-like temperature
- Weather icons and descriptions
- Hover effects for interactivity

### 3. 5-Day Forecast
- Daily high/low temperatures
- Weather conditions
- Rain probability
- Visual weather icons

### 4. Advanced Charts
- **Temperature Chart** - Line chart showing real and "feels-like" temps
- **Humidity Chart** - Dual-axis bar/line chart for humidity and precipitation
- **Interactive Legend** - Click to toggle data series

### 5. Air Quality Index
- AQI scale (1-5) with color coding
- Pollutant concentrations (PM2.5, PM10, NO₂, O₃)
- Real-time monitoring

## Future Enhancements

- [ ] Multiple city comparison
- [ ] Weather alerts and notifications
- [ ] Historical data trends
- [ ] Local storage for favorite locations
- [ ] Theme switcher (light/dark mode)
- [ ] Pollen and allergy forecasts
- [ ] Sunrise/sunset times
- [ ] Wind direction visualization
- [ ] Mobile app version
- [ ] PWA (Progressive Web App) capabilities

## Code Examples

### Fetching Weather Data
```javascript
async function fetchWeatherData(lat, lon) {
    const currentUrl = `${API_CONFIG.OPENWEATHER_BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${API_CONFIG.UNITS}&appid=${API_CONFIG.OPENWEATHER_KEY}`;
    const response = await fetch(currentUrl);
    const data = await response.json();
    // Update UI with data
}
```

### Creating a Chart
```javascript
new Chart(ctx, {
    type: 'line',
    data: {
        labels: timeLabels,
        datasets: [{
            label: 'Temperature',
            data: temperatures,
            borderColor: '#00d4ff',
            tension: 0.4
        }]
    },
    options: { /* chart options */ }
});
```

## Troubleshooting

### API Key Issues
- **Error**: "401 Unauthorized"
  - Check if API key is correctly inserted
  - Verify key is active in OpenWeatherMap dashboard
  - Wait a few minutes after creating new key

### Geolocation Not Working
- Ensure browser has permission to access location
- Some browsers require HTTPS (except localhost)
- Check browser's location settings

### Charts Not Displaying
- Clear browser cache (Ctrl+Shift+Del)
- Ensure Chart.js CDN is loading
- Check browser console for errors (F12)

### No Data Showing
- Verify internet connection
- Check OpenWeatherMap API status
- Ensure CORS is not blocked

## Credits

- **Weather Data** - [OpenWeatherMap](https://openweathermap.org/)
- **Icons** - [Font Awesome](https://fontawesome.com/)
- **Charts** - [Chart.js](https://www.chartjs.org/)
- **Design Inspiration** - Modern tech dashboards

## License

This project is open source and available under the MIT License.

## Contact & Support

For issues, suggestions, or contributions:
- Report bugs via GitHub Issues
- Submit feature requests
- Feel free to fork and customize

---

**Made with ❤️ by a 21-year-old engineer**

*Last Updated: December 2024*
