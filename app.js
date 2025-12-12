// Weather API Configuration - Using OpenWeatherMap (accurate) + Open-Meteo for Forecasts
// SECURITY: API keys should be server-side only. This is a client-side demo app.
// For production, move all API calls to a backend server/proxy.
const API_CONFIG = {
    OPENMETEO_BASE: 'https://api.open-meteo.com/v1',
    GEOCODING_BASE: 'https://geocoding-api.open-meteo.com/v1',
    OPENWEATHER_BASE: 'https://api.openweathermap.org/data/2.5',
    // Store actual key in backend environment variable, not client code
    OPENWEATHER_API_KEY: '', // To be fetched from backend
    UNITS: 'metric'
};

// Theme Management System
const THEMES = {
    DAY: 'day',
    NIGHT: 'night'
};

const TIMES = {
    DAY: 'day',
    NIGHT: 'night'
};

// State Management
const state = {
    currentLocation: null,
    currentWeather: null,
    forecast: null,
    hourlyData: [],
    chartInstances: { temperature: null, humidity: null },
    isLoading: false,
    currentTheme: 'night',
    sunrise: null,
    sunset: null
};

const themeManager = {
    applyTheme(theme) {
        document.body.className = '';
        document.body.classList.add(`theme-${theme}`);
        state.currentTheme = theme;
        localStorage.setItem('theme', theme);
    },
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'night';
        state.currentTheme = savedTheme;
        this.applyTheme(savedTheme);
    }
};

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    locationBtn: document.getElementById('locationBtn'),
    daylightToggle: document.getElementById('daylightToggle'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    cityName: document.getElementById('cityName'),
    currentDate: document.getElementById('currentDate'),
    temperature: document.getElementById('temperature'),
    weatherDescription: document.getElementById('weatherDescription'),
    weatherIcon: document.getElementById('weatherIcon'),
    humidity: document.getElementById('humidity'),
    windSpeed: document.getElementById('windSpeed'),
    pressure: document.getElementById('pressure'),
    visibility: document.getElementById('visibility'),
    feelsLike: document.getElementById('feelsLike'),
    uvIndex: document.getElementById('uvIndex'),
    hourlyForecast: document.getElementById('hourlyForecast'),
    dailyForecast: document.getElementById('dailyForecast'),
    airQuality: document.getElementById('airQuality'),
    lastUpdated: document.getElementById('lastUpdated'),
    suggestionsList: document.getElementById('suggestionsList')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    themeManager.initializeTheme();
    setupEventListeners();
    loadDefaultLocation();
});

// Event Listeners
function setupEventListeners() {
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    elements.searchInput.addEventListener('input', handleSearchInput);
    elements.locationBtn.addEventListener('click', handleLocationClick);
    elements.daylightToggle.addEventListener('click', toggleDayNightMode);
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== elements.searchInput) {
            elements.suggestionsList.classList.remove('active');
        }
    });
}

// Theme Toggle Handler
function toggleTheme() {
    const newTheme = state.currentTheme === THEMES.DAY ? THEMES.NIGHT : THEMES.DAY;
    themeManager.applyTheme(newTheme);
    showNotification(`Switched to ${newTheme} mode 🌗`);
    updateDayNightToggleIcon();
}

// Day/Night Toggle Handler
function toggleDayNightMode() {
    toggleTheme();
}

function updateDayNightToggleIcon() {
    elements.daylightToggle.textContent = state.currentTheme === THEMES.DAY ? '☀️' : '🌙';
    elements.daylightToggle.classList.toggle('night-mode', state.currentTheme === THEMES.NIGHT);
}

// Sanitize HTML to prevent XSS attacks
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Validate search input to prevent injection and excessive queries
function validateSearchInput(query) {
    if (!query || typeof query !== 'string') return false;
    // Trim and check length (min 2, max 100 characters)
    query = query.trim();
    if (query.length < 2 || query.length > 100) return false;
    // Allow letters, numbers, spaces, hyphens, and commas only
    return /^[a-zA-Z0-9\s\-,áéíóúàèìòùäëïöüñ]*$/.test(query);
}

// Search Handler with Input Validation
async function handleSearch() {
    const query = elements.searchInput.value.trim();
    
    if (!validateSearchInput(query)) {
        showError('Invalid location. Use letters, numbers, spaces, hyphens, or commas only (max 100 chars).');
        return;
    }

    try {
        showLoadingSpinner(true);
        const coords = await geocodeLocation(query);
        if (coords) {
            await fetchWeatherData(coords.lat, coords.lon);
            elements.searchInput.value = '';
            elements.suggestionsList.classList.remove('active');
        }
    } catch (error) {
        console.error('Search error:', error);
        showError('Could not find location. Please try again.');
    } finally {
        showLoadingSpinner(false);
    }
}

// Search Input Handler (Autocomplete)
let autocompleteTimeout;
async function handleSearchInput(e) {
    const query = e.target.value.trim();
    
    // Clear previous timeout
    clearTimeout(autocompleteTimeout);
    
    if (query.length < 2) {
        elements.suggestionsList.classList.remove('active');
        return;
    }
    
    // Debounce API calls
    autocompleteTimeout = setTimeout(() => {
        fetchCitySuggestions(query);
    }, 300);
}

// Fetch City Suggestions
async function fetchCitySuggestions(query) {
    try {
        // Use backend API for search
        const response = await fetch(`http://localhost:3000/api/geocode?query=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            elements.suggestionsList.innerHTML = '<li class="suggestion-item">No cities found</li>';
            elements.suggestionsList.classList.add('active');
            return;
        }
        
        // Build suggestions list - prioritize cities with admin1 (state/region)
        elements.suggestionsList.innerHTML = data.results.slice(0, 10).map((city, index) => {
            const admin1 = city.admin1 ? `, ${city.admin1}` : '';
            const displayName = `${city.name}${admin1}, ${city.country}`;
            return `
                <li class="suggestion-item" data-index="${index}" data-lat="${city.latitude}" data-lon="${city.longitude}" data-name="${city.name}" data-country="${city.country}">
                    <strong>${city.name}</strong>${admin1}, ${city.country}
                </li>
            `;
        }).join('');
        
        // Add click handlers to suggestions
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const lat = item.getAttribute('data-lat');
                const lon = item.getAttribute('data-lon');
                const name = item.getAttribute('data-name');
                const country = item.getAttribute('data-country');
                
                // Store location BEFORE fetching weather
                state.currentLocation = { lat: parseFloat(lat), lon: parseFloat(lon), name, country };
                
                elements.searchInput.value = `${name}, ${country}`;
                elements.suggestionsList.classList.remove('active');
                fetchWeatherData(parseFloat(lat), parseFloat(lon));
            });
        });
        
        elements.suggestionsList.classList.add('active');
    } catch (error) {
        console.error('Autocomplete error:', error);
    }
}

// Current Location Handler
async function handleLocationClick() {
    try {
        showLoadingSpinner(true);
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log('Got location:', latitude, longitude);
                    
                    // Try to get location name from reverse geocoding using backend
                    let locationName = 'Current Location';
                    let countryCode = '';
                    
                    try {
                        // Use backend API for reverse geocoding
                        const response = await fetch(`http://localhost:3000/api/reverse-geocode?lat=${latitude}&lon=${longitude}`, { signal: AbortSignal.timeout(8000) });
                        
                        if (response.ok) {
                            const data = await response.json();
                            console.log('Reverse geocode response:', data);
                            if (data.results && data.results.length > 0) {
                                const result = data.results[0];
                                console.log('Result object keys:', Object.keys(result));
                                console.log('Result name field:', result.name);
                                
                                // Prioritize: name field (which is the city) > admin1 > admin2
                                locationName = result.name || 
                                               result.admin1 || 
                                               result.admin2 || 
                                               'Current Location';
                                
                                countryCode = result.country_code || 
                                             result.country || '';
                                
                                console.log('Extracted location name:', locationName);
                                console.log('Extracted country code:', countryCode);
                            }
                        } else {
                            console.warn('Reverse geocode returned status:', response.status);
                        }
                    } catch (geoError) {
                        console.warn('Reverse geocoding failed:', geoError.message);
                        // Fallback: if backend is not available, still work with coordinates
                    }
                    
                    // Set the location in state BEFORE fetching weather
                    state.currentLocation = {
                        lat: latitude,
                        lon: longitude,
                        name: locationName,
                        country: countryCode
                    };
                    
                    console.log('Set state.currentLocation:', state.currentLocation);
                    
                    // Now fetch weather with the location name already set
                    await fetchWeatherData(latitude, longitude);
                    showLoadingSpinner(false);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    showError(`Location error: ${error.message}. Please enable location permissions.`);
                    showLoadingSpinner(false);
                },
                {
                    timeout: 10000,
                    enableHighAccuracy: false
                }
            );
        } else {
            showError('Geolocation is not supported by your browser');
            showLoadingSpinner(false);
        }
    } catch (error) {
        console.error('Location error:', error);
        showLoadingSpinner(false);
    }
}

// Geocode Location
async function geocodeLocation(query) {
    try {
        // Use backend API for geocoding
        const response = await fetch(`http://localhost:3000/api/geocode?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('Location not found');
        }

        const city = data.results[0];
        const lat = city.latitude;
        const lon = city.longitude;
        const name = city.name;
        const country = city.country;
        
        state.currentLocation = { lat, lon, name, country };
        return { lat, lon };
    } catch (error) {
        console.error('Geocoding error:', error);
        throw error;
    }
}

// Fetch Weather Data
async function fetchWeatherData(lat, lon) {
    try {
        showLoadingSpinner(true);

        // Use backend API endpoints for secure API calls
        const apiBase = 'http://localhost:3000/api'; // Backend server
        
        // Fetch current weather, forecast, and air quality from backend
        const [weatherResponse, forecastResponse, airQualityResponse] = await Promise.all([
            fetch(`${apiBase}/weather?lat=${lat}&lon=${lon}`),
            fetch(`${apiBase}/forecast?lat=${lat}&lon=${lon}`),
            fetch(`${apiBase}/air-quality?lat=${lat}&lon=${lon}`)
        ]);
        
        if (!weatherResponse.ok) {
            throw new Error(`Weather API error: ${weatherResponse.status}`);
        }
        
        if (!forecastResponse.ok) {
            throw new Error(`Forecast API error: ${forecastResponse.status}`);
        }
        
        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        const airQualityData = airQualityResponse.ok ? await airQualityResponse.json() : null;

        
        // Get location name - use stored location if available
        let locationName = state.currentLocation?.name || weatherData.name || 'Current Location';
        let countryCode = state.currentLocation?.country || weatherData.sys?.country || '';
        
        console.log('Current location state:', state.currentLocation);
        console.log('Location name being used:', locationName);
        console.log('Weather data:', weatherData);
        
        // Store weather data in a compatible format (from OpenWeatherMap)
        state.currentWeather = {
            name: locationName,
            sys: {
                country: countryCode,
                sunrise: weatherData.sys.sunrise,
                sunset: weatherData.sys.sunset
            },
            main: {
                temp: Math.round(weatherData.main.temp * 10) / 10,
                feels_like: Math.round(weatherData.main.feels_like * 10) / 10,
                humidity: Math.round(weatherData.main.humidity),
                pressure: Math.round(weatherData.main.pressure)
            },
            weather: [{
                main: weatherData.weather[0].main,
                description: weatherData.weather[0].description.toLowerCase(),
                icon: weatherData.weather[0].icon
            }],
            wind: {
                speed: Math.round(weatherData.wind.speed * 10) / 10
            },
            visibility: Math.round(weatherData.visibility || 10000),
            clouds: {
                all: weatherData.clouds?.all || 0
            }
        };
        
        // Capture sunrise and sunset times
        state.sunrise = state.currentWeather.sys.sunrise;
        state.sunset = state.currentWeather.sys.sunset;
        
        // Auto-apply theme based on actual sunrise/sunset time
        const isDay = isDayTime(state.sunrise, state.sunset);
        const autoTheme = isDay ? THEMES.DAY : THEMES.NIGHT;
        themeManager.applyTheme(autoTheme);

        // Process hourly forecast data from OpenWeatherMap (5-day/3-hour forecast)
        state.hourlyData = [];
        const forecastList = forecastData.list || [];
        for (let i = 0; i < Math.min(8, forecastList.length); i++) {
            const item = forecastList[i];
            state.hourlyData.push({
                dt: item.dt,
                main: {
                    temp: item.main.temp,
                    humidity: item.main.humidity,
                    feels_like: item.main.feels_like
                },
                weather: [{
                    main: item.weather[0].main,
                    icon: item.weather[0].icon
                }],
                rain: item.rain ? item.rain : null
            });
        }

        // Process daily forecast (group by day from the 5-day forecast)
        state.forecast = {
            list: []
        };
        const dailyData = {};
        
        // Group forecast data by day
        for (const item of forecastList) {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
            
            if (!dailyData[dateKey]) {
                dailyData[dateKey] = {
                    dt: item.dt,
                    temps: [item.main.temp],
                    weather: item.weather[0],
                    rain: item.rain
                };
            } else {
                dailyData[dateKey].temps.push(item.main.temp);
            }
        }
        
        // Create 5-day forecast from grouped data
        Object.keys(dailyData).slice(0, 5).forEach(dateKey => {
            const dayData = dailyData[dateKey];
            const temps = dayData.temps;
            state.forecast.list.push({
                dt: dayData.dt,
                main: {
                    temp_max: Math.max(...temps),
                    temp_min: Math.min(...temps),
                    temp: (Math.max(...temps) + Math.min(...temps)) / 2
                },
                weather: [{
                    main: dayData.weather.main,
                    icon: dayData.weather.icon
                }],
                rain: dayData.rain ? dayData.rain : null
            });
        });

        // Update UI
        updateCurrentWeather();
        updateHourlyForecast();
        updateDailyForecast();
        updateCharts();
        // Air quality data from backend
        updateAirQuality(airQualityData);
        updateLastUpdated();
        
        // Start monitoring for day/night transition
        startDayNightMonitoring();

    } catch (error) {
        console.error('Weather data fetch error:', error);
        showError('Failed to fetch weather data. Please check your connection and try again.');
    } finally {
        showLoadingSpinner(false);
    }
}

// Helper function to convert WMO weather codes to descriptions
function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Clear',
        1: 'Mainly Clear',
        2: 'Partly Cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light Drizzle',
        53: 'Moderate Drizzle',
        55: 'Dense Drizzle',
        61: 'Slight Rain',
        63: 'Moderate Rain',
        65: 'Heavy Rain',
        71: 'Slight Snow',
        73: 'Moderate Snow',
        75: 'Heavy Snow',
        80: 'Slight Rain Showers',
        81: 'Moderate Rain Showers',
        82: 'Violent Rain Showers',
        85: 'Slight Snow Showers',
        86: 'Heavy Snow Showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with Slight Hail',
        99: 'Thunderstorm with Heavy Hail'
    };
    return weatherCodes[code] || 'Unknown';
}

// Helper function to map weather codes to icons
function getWeatherIcon(code) {
    // Map WMO codes to OpenWeatherMap-style icon codes for visual consistency
    if (code === 0) return '01d'; // clear
    if (code === 1 || code === 2) return '02d'; // cloudy
    if (code === 3) return '04d'; // overcast
    if ([45, 48].includes(code)) return '50d'; // fog
    if ([51, 53, 55].includes(code)) return '09d'; // drizzle
    if ([61, 63, 65].includes(code)) return '10d'; // rain
    if ([71, 73, 75].includes(code)) return '13d'; // snow
    if ([80, 81, 82].includes(code)) return '09d'; // rain showers
    if ([85, 86].includes(code)) return '13d'; // snow showers
    if ([95, 96, 99].includes(code)) return '11d'; // thunderstorm
    return '01d';
}

// Update Current Weather
function updateCurrentWeather() {
    const data = state.currentWeather;

    elements.cityName.textContent = `${data.name}, ${data.sys.country || 'World'}`;
    elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
    elements.weatherDescription.textContent = data.weather[0].description;
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.windSpeed.textContent = `${data.wind.speed.toFixed(1)} m/s`;
    elements.pressure.textContent = `${Math.round(data.main.pressure)} hPa`;
    elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

    // Weather icon - OpenWeatherMap icon code
    const iconCode = data.weather[0].icon;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    elements.weatherIcon.alt = data.weather[0].main;

    // Update date
    updateDateTime();

    // Get UV index (from forecast data, approximation)
    updateUVIndex();
}

// Update Date and Time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    elements.currentDate.textContent = now.toLocaleDateString('en-US', options);
}

// Update UV Index (approximation based on time and cloud cover)
function updateUVIndex() {
    const cloudCover = state.currentWeather.clouds.all;
    // Simple approximation: higher when sun is high, lower with clouds
    const hour = new Date().getHours();
    let baseUV = 0;

    if (hour >= 8 && hour <= 16) {
        baseUV = 8;
    } else if (hour >= 6 && hour <= 18) {
        baseUV = 5;
    } else {
        baseUV = 1;
    }

    const adjustedUV = (baseUV * (1 - cloudCover / 100)).toFixed(1);
    elements.uvIndex.textContent = adjustedUV;
}

// Update Hourly Forecast
function updateHourlyForecast() {
    const forecastList = state.hourlyData.slice(0, 8); // Next 24 hours (8 items from hourly data)

    elements.hourlyForecast.innerHTML = forecastList.map(item => {
        const date = new Date(item.dt * 1000);
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const time = `${hour}:${minute}`;
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;
        const feelsLike = Math.round(item.main.feels_like);

        return `
            <div class="hourly-card fade-in">
                <div class="hourly-time">${time}</div>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather" class="hourly-icon">
                <div class="hourly-temp">${temp}°</div>
                <div class="hourly-detail">Feels: ${feelsLike}°</div>
            </div>
        `;
    }).join('');
}

// Update Daily Forecast
function updateDailyForecast() {
    const dailyData = state.forecast.list.slice(0, 5);

    elements.dailyForecast.innerHTML = dailyData.map((item, index) => {
        const date = new Date(item.dt * 1000);
        const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });
        
        const maxTemp = Math.round(item.main.temp_max);
        const minTemp = Math.round(item.main.temp_min);
        const icon = item.weather[0].icon;
        const mainWeather = item.weather[0].main;
        const rainProb = item.rain ? (typeof item.rain === 'object' ? Math.round((item.rain['3h'] || 0) * 100) : Math.round(item.rain * 100)) : 0;

        return `
            <div class="daily-card fade-in">
                <div class="daily-date">${formatted}</div>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather" class="daily-icon">
                <div class="daily-temps">
                    <span class="daily-temp-high">${maxTemp}°</span>
                    <span class="daily-temp-low">${minTemp}°</span>
                </div>
                <div style="text-align: center; font-size: 12px; color: var(--text-secondary);">${mainWeather}</div>
                <div class="daily-rain"><i class="fas fa-droplet"></i> ${rainProb}%</div>
            </div>
        `;
    }).join('');
}

// Update Air Quality
function updateAirQuality(data) {
    if (!data || !data.list || data.list.length === 0) {
        // Fallback message if data is not available - Using safe DOM methods
        const container = document.createElement('div');
        container.className = 'aq-card fade-in aq-main';
        container.style.borderColor = '#74c0fc';
        container.style.background = 'linear-gradient(135deg, #74c0fc15 0%, rgba(0,212,255,0.05) 100%)';
        container.innerHTML = '<div class="aq-main-content"><div><div class="aq-label">💨 Air Quality</div><div style="font-size: 14px; color: var(--text-primary); margin-top: 12px; line-height: 1.5; font-weight: 500;">Air quality data not available.</div></div></div>';
        elements.airQuality.innerHTML = '';
        elements.airQuality.appendChild(container);
        return;
    }

    const current = data.list[0]; // Get latest air quality data
    const components = current.components;

    // Extract pollutant values and clamp to valid ranges
    const pm25 = components.pm2_5 ? Math.round(components.pm2_5 * 10) / 10 : 'N/A';
    const pm10 = components.pm10 ? Math.round(components.pm10 * 10) / 10 : 'N/A';
    const o3 = components.o3 ? Math.round(components.o3 * 10) / 10 : 'N/A';
    const no2 = components.no2 ? Math.round(components.no2 * 10) / 10 : 'N/A';

    // OpenWeather AQI: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
    const aqi = Math.min(5, Math.max(1, current.main.aqi || 1));

    const aqiCategories = {
        1: { name: 'Good', emoji: '✨', color: '#00ff00', bg: 'rgba(0, 255, 0, 0.1)', advice: '✓ Air quality is satisfactory. Enjoy outdoor activities!' },
        2: { name: 'Fair', emoji: '👍', color: '#90ee90', bg: 'rgba(144, 238, 144, 0.1)', advice: '✓ Air quality is acceptable. No restrictions needed.' },
        3: { name: 'Moderate', emoji: '⚠️', color: '#ffff00', bg: 'rgba(255, 255, 0, 0.1)', advice: '⚠️ Sensitive groups may experience effects. Limit outdoor activities.' },
        4: { name: 'Poor', emoji: '😷', color: '#ff6600', bg: 'rgba(255, 102, 0, 0.1)', advice: '😷 Health alert! Consider wearing a mask outdoors.' },
        5: { name: 'Very Poor', emoji: '🚨', color: '#ff0000', bg: 'rgba(255, 0, 0, 0.1)', advice: '🚨 Health alert! Avoid outdoors. Stay indoors.' }
    };

    const aqiInfo = aqiCategories[aqi] || aqiCategories[1];

    // Build the air quality display using safe DOM methods
    const container = document.createElement('div');
    container.className = 'aq-card fade-in aq-main';
    container.style.border = `2px solid ${aqiInfo.color}`;
    container.style.background = aqiInfo.bg;
    container.style.padding = '20px';
    container.style.borderRadius = '15px';

    // Create grid layout
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = '1fr 2fr';
    grid.style.gap = '20px';
    grid.style.alignItems = 'start';

    // Left side: AQI display
    const leftCol = document.createElement('div');
    leftCol.style.textAlign = 'center';

    const aqiLabel = document.createElement('div');
    aqiLabel.style.fontSize = '12px';
    aqiLabel.style.color = 'var(--text-secondary)';
    aqiLabel.style.marginBottom = '8px';
    aqiLabel.style.textTransform = 'uppercase';
    aqiLabel.textContent = 'AQI';
    leftCol.appendChild(aqiLabel);

    const aqiValue = document.createElement('div');
    aqiValue.style.fontSize = '48px';
    aqiValue.style.fontWeight = 'bold';
    aqiValue.style.color = aqiInfo.color;
    aqiValue.style.lineHeight = '1';
    aqiValue.textContent = `${aqi}/5`;
    leftCol.appendChild(aqiValue);

    const aqiName = document.createElement('div');
    aqiName.style.fontSize = '14px';
    aqiName.style.color = aqiInfo.color;
    aqiName.style.marginTop = '8px';
    aqiName.style.fontWeight = '600';
    aqiName.textContent = `${aqiInfo.name} ${aqiInfo.emoji}`;
    leftCol.appendChild(aqiName);

    // Right side: Details
    const rightCol = document.createElement('div');

    // Pollutants grid
    const pollutantsGrid = document.createElement('div');
    pollutantsGrid.style.display = 'grid';
    pollutantsGrid.style.gridTemplateColumns = '1fr 1fr';
    pollutantsGrid.style.gap = '12px';
    pollutantsGrid.style.marginBottom = '16px';

    // Helper to create pollutant card
    const createPollutantCard = (label, value, unit, color) => {
        const card = document.createElement('div');
        card.style.background = 'rgba(0,212,255,0.1)';
        card.style.padding = '12px';
        card.style.borderRadius = '10px';
        card.style.borderLeft = `3px solid ${color}`;
        card.style.textAlign = 'center';

        const cardLabel = document.createElement('div');
        cardLabel.style.fontSize = '11px';
        cardLabel.style.color = 'var(--text-secondary)';
        cardLabel.style.marginBottom = '4px';
        cardLabel.textContent = label;
        card.appendChild(cardLabel);

        const cardValue = document.createElement('div');
        cardValue.style.fontSize = '18px';
        cardValue.style.fontWeight = 'bold';
        cardValue.style.color = color;
        cardValue.textContent = String(value);
        card.appendChild(cardValue);

        const cardUnit = document.createElement('div');
        cardUnit.style.fontSize = '10px';
        cardUnit.style.color = 'var(--text-secondary)';
        cardUnit.textContent = unit;
        card.appendChild(cardUnit);

        return card;
    };

    pollutantsGrid.appendChild(createPollutantCard('PM2.5', pm25, 'μg/m³', '#00d4ff'));
    pollutantsGrid.appendChild(createPollutantCard('PM10', pm10, 'μg/m³', '#4ecdc4'));
    pollutantsGrid.appendChild(createPollutantCard('NO₂', no2, 'μg/m³', '#74c0fc'));
    pollutantsGrid.appendChild(createPollutantCard('O₃', o3, 'μg/m³', '#ffd700'));

    rightCol.appendChild(pollutantsGrid);

    // Health advice box
    const adviceBox = document.createElement('div');
    adviceBox.style.background = `rgba(${aqiInfo.color === '#ff0000' ? '255, 0, 0' : aqiInfo.color === '#ff6600' ? '255, 102, 0' : '116, 192, 252'}, 0.15)`;
    adviceBox.style.padding = '12px';
    adviceBox.style.borderRadius = '10px';
    adviceBox.style.borderLeft = `3px solid ${aqiInfo.color}`;

    const adviceText = document.createElement('div');
    adviceText.style.fontSize = '12px';
    adviceText.style.color = 'var(--text-primary)';
    adviceText.style.fontWeight = '600';
    adviceText.style.lineHeight = '1.6';
    adviceText.textContent = aqiInfo.advice;
    adviceBox.appendChild(adviceText);

    rightCol.appendChild(adviceBox);

    grid.appendChild(leftCol);
    grid.appendChild(rightCol);
    container.appendChild(grid);

    // Clear and append
    elements.airQuality.innerHTML = '';
    elements.airQuality.appendChild(container);
}

// Update Charts
function updateCharts() {
    const hourlyData = state.hourlyData;

    if (hourlyData.length === 0) return;

    // Temperature Chart
    updateTemperatureChart(hourlyData);

    // Humidity Chart
    updateHumidityChart(hourlyData);
}

// Update Temperature Chart
function updateTemperatureChart(data) {
    const ctx = document.getElementById('temperatureChart');
    if (!ctx) return;

    // Fix: Format time labels with HH:MM format and avoid showing duplicate "5:00"
    const labels = data.map(item => {
        const date = new Date(item.dt * 1000);
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        return `${hour}:${minute}`;
    });

    const temps = data.map(item => Math.round(item.main.temp));
    const feelsLike = data.map(item => Math.round(item.main.feels_like));

    if (state.chartInstances.temperature) {
        state.chartInstances.temperature.destroy();
    }

    state.chartInstances.temperature = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temps,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#00d4ff',
                    pointBorderColor: '#00d4ff',
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Feels Like (°C)',
                    data: feelsLike,
                    borderColor: '#4ecdc4',
                    backgroundColor: 'rgba(78, 205, 196, 0.05)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: '#4ecdc4',
                    pointBorderColor: '#4ecdc4',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#b0b0b0',
                        font: { size: 12, weight: '500' },
                        padding: 15
                    }
                },
                filler: {
                    propagate: true
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(42, 47, 63, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#b0b0b0',
                        font: { size: 11 },
                        callback: function(value) {
                            return value + '°C';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#b0b0b0',
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

// Update Humidity Chart
function updateHumidityChart(data) {
    const ctx = document.getElementById('humidityChart');
    if (!ctx) return;

    // Fix: Format time labels with HH:MM format
    const labels = data.map(item => {
        const date = new Date(item.dt * 1000);
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        return `${hour}:${minute}`;
    });

    const humidity = data.map(item => item.main.humidity);
    const precipitation = data.map(item => {
        if (!item.rain) return 0;
        return typeof item.rain === 'object' ? (item.rain['3h'] || 0) : item.rain;
    });

    if (state.chartInstances.humidity) {
        state.chartInstances.humidity.destroy();
    }

    state.chartInstances.humidity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Humidity (%)',
                    data: humidity,
                    backgroundColor: 'rgba(74, 192, 252, 0.6)',
                    borderColor: '#4ac0fc',
                    borderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: 'Precipitation (mm)',
                    data: precipitation,
                    backgroundColor: 'rgba(76, 175, 255, 0.4)',
                    borderColor: '#4caffe',
                    borderWidth: 1,
                    type: 'line',
                    yAxisID: 'y1',
                    borderDash: [3, 3],
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#b0b0b0',
                        font: { size: 12, weight: '500' },
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: 'rgba(42, 47, 63, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#b0b0b0',
                        font: { size: 11 },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#4caffe',
                        font: { size: 11 },
                        callback: function(value) {
                            return value + ' mm';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#b0b0b0',
                        font: { size: 11 }
                    }
                }
            }
        }
    });
}

// Load Default Location (Delhi)
async function loadDefaultLocation() {
    try {
        // Delhi coordinates
        state.currentLocation = { lat: 28.7041, lon: 77.1025, name: 'Delhi', country: 'India' };
        await fetchWeatherData(28.7041, 77.1025);
    } catch (error) {
        console.error('Failed to load default location:', error);
    }
}

// Update Last Updated Time
function updateLastUpdated() {
    const now = new Date();
    elements.lastUpdated.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// Day/Night Monitoring
let dayNightMonitoringInterval = null;

// Check if it's daytime
function isDayTime(sunrise, sunset) {
    const now = new Date().getTime() / 1000; // Current time in seconds
    return now >= sunrise && now < sunset;
}

function startDayNightMonitoring() {
    // Clear any existing interval
    if (dayNightMonitoringInterval) {
        clearInterval(dayNightMonitoringInterval);
    }
    
    // Check for day/night transition every minute
    dayNightMonitoringInterval = setInterval(() => {
        if (state.sunrise && state.sunset && state.currentLocation) {
            const isDay = isDayTime(state.sunrise, state.sunset);
            const currentTheme = isDay ? THEMES.DAY : THEMES.NIGHT;
            
            // If the time of day has changed, update the theme
            if (currentTheme !== state.currentTheme) {
                themeManager.applyTheme(currentTheme);
                showNotification(`Switched to ${currentTheme} mode ✨`);
            }
        }
    }, 60000); // Check every minute
}

function showNotification(message) {
    const notifDiv = document.createElement('div');
    notifDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 998;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 8px 24px rgba(0, 212, 255, 0.3);
    `;
    notifDiv.textContent = message;
    document.body.appendChild(notifDiv);

    setTimeout(() => {
        notifDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notifDiv.remove(), 300);
    }, 3000);
}

// Utility Functions
function showLoadingSpinner(show) {
    state.isLoading = show;
    if (show) {
        elements.loadingSpinner.classList.add('active');
    } else {
        elements.loadingSpinner.classList.remove('active');
    }
}

function showError(message) {
    // Create a simple error notification
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 999;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 4000);
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);
