// Weather API Configuration
const API_CONFIG = {
    OPENWEATHER_KEY: '35102437e50d37262084332662179159', // Active API key
    OPENWEATHER_BASE: 'https://api.openweathermap.org',
    UNITS: 'metric'
};

// State Management
const state = {
    currentLocation: null,
    currentWeather: null,
    forecast: null,
    hourlyData: [],
    chartInstances: { temperature: null, humidity: null },
    isLoading: false,
    currentTheme: 'auto',
    currentTimeOfDay: TIMES.NIGHT,
    sunrise: null,
    sunset: null
};

// Theme Management System
const THEMES = {
    SPRING: 'spring',
    SUMMER: 'summer',
    AUTUMN: 'autumn',
    WINTER: 'winter',
    DARK: 'dark',
    LIGHT: 'light'
};

const TIMES = {
    DAY: 'day',
    NIGHT: 'night'
};

const themeManager = {
    getCurrentSeason(latitude) {
        const month = new Date().getMonth();
        
        // Northern hemisphere seasons (using latitude to adjust)
        if (latitude > 0) {
            if (month >= 2 && month <= 4) return THEMES.SPRING;
            if (month >= 5 && month <= 7) return THEMES.SUMMER;
            if (month >= 8 && month <= 10) return THEMES.AUTUMN;
            return THEMES.WINTER;
        } else {
            // Southern hemisphere seasons (reversed)
            if (month >= 2 && month <= 4) return THEMES.AUTUMN;
            if (month >= 5 && month <= 7) return THEMES.WINTER;
            if (month >= 8 && month <= 10) return THEMES.SPRING;
            return THEMES.SUMMER;
        }
    },
    
    isDayTime(sunrise, sunset) {
        const now = new Date().getTime() / 1000; // Current time in seconds
        return now >= sunrise && now < sunset;
    },
    
    getCurrentTimeOfDay(sunrise, sunset) {
        return this.isDayTime(sunrise, sunset) ? TIMES.DAY : TIMES.NIGHT;
    },
    
    applyTheme(theme, timeOfDay = null) {
        document.body.className = '';
        let finalTheme = theme;
        
        // If a time of day is specified, apply day/night variant
        if (timeOfDay && (theme === THEMES.SPRING || theme === THEMES.SUMMER || theme === THEMES.AUTUMN || theme === THEMES.WINTER)) {
            finalTheme = `${theme}-${timeOfDay}`;
        }
        
        document.body.classList.add(`theme-${finalTheme}`);
        state.currentTheme = theme;
        state.currentTimeOfDay = timeOfDay || TIMES.NIGHT;
        localStorage.setItem('theme', theme);
        updateThemeToggleIcon(theme, timeOfDay);
    },
    
    getAutoTheme(latitude) {
        const season = this.getCurrentSeason(latitude);
        return season;
    },
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'auto';
        state.currentTheme = savedTheme;
        
        if (savedTheme === 'auto' || savedTheme === 'light' || savedTheme === 'dark') {
            this.applyTheme(savedTheme);
        } else {
            this.applyTheme(savedTheme);
        }
    }
};

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    locationBtn: document.getElementById('locationBtn'),
    themeToggle: document.getElementById('themeToggle'),
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
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target !== elements.searchInput) {
            elements.suggestionsList.classList.remove('active');
        }
    });
}

// Theme Toggle Handler
function toggleTheme() {
    const themes = Object.values(THEMES);
    const currentIndex = themes.indexOf(state.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    themeManager.applyTheme(nextTheme);
}

function updateThemeToggleIcon(theme, timeOfDay = null) {
    const icons = {
        [THEMES.SPRING]: { day: '🌸', night: '🌙' },
        [THEMES.SUMMER]: { day: '☀️', night: '🌙' },
        [THEMES.AUTUMN]: { day: '🍂', night: '🌙' },
        [THEMES.WINTER]: { day: '❄️', night: '🌙' },
        [THEMES.DARK]: { day: '🌙', night: '🌙' },
        [THEMES.LIGHT]: { day: '🌞', night: '🌞' }
    };
    
    const icon = icons[theme];
    if (icon) {
        if (timeOfDay) {
            elements.themeToggle.textContent = icon[timeOfDay];
        } else {
            elements.themeToggle.textContent = icon.night || '🌙';
        }
    } else {
        elements.themeToggle.textContent = '🌙';
    }
}

// Search Handler
async function handleSearch() {
    const query = elements.searchInput.value.trim();
    if (!query) return;

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
        const url = `${API_CONFIG.OPENWEATHER_BASE}/geo/1.0/direct?q=${query}&limit=10&appid=${API_CONFIG.OPENWEATHER_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.length === 0) {
            elements.suggestionsList.innerHTML = '<li class="suggestion-item">No cities found</li>';
            elements.suggestionsList.classList.add('active');
            return;
        }
        
        // Build suggestions list
        elements.suggestionsList.innerHTML = data.map((city, index) => `
            <li class="suggestion-item" data-index="${index}" data-lat="${city.lat}" data-lon="${city.lon}">
                <strong>${city.name}</strong>${city.state ? ', ' + city.state : ''}, ${city.country}
            </li>
        `).join('');
        
        // Add click handlers to suggestions
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const lat = item.getAttribute('data-lat');
                const lon = item.getAttribute('data-lon');
                elements.searchInput.value = `${item.textContent}`;
                elements.suggestionsList.classList.remove('active');
                fetchWeatherData(lat, lon);
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
                    await fetchWeatherData(latitude, longitude);
                    showLoadingSpinner(false);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    showError('Could not access your location');
                    showLoadingSpinner(false);
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
        const url = `${API_CONFIG.OPENWEATHER_BASE}/geo/1.0/direct?q=${query}&limit=1&appid=${API_CONFIG.OPENWEATHER_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();

        if (data.length === 0) {
            throw new Error('Location not found');
        }

        const { lat, lon, name, country } = data[0];
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

        // Fetch current weather
        const currentUrl = `${API_CONFIG.OPENWEATHER_BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${API_CONFIG.UNITS}&appid=${API_CONFIG.OPENWEATHER_KEY}`;
        const currentResponse = await fetch(currentUrl);
        if (!currentResponse.ok) {
            throw new Error(`Current weather API error: ${currentResponse.status} ${currentResponse.statusText}`);
        }
        state.currentWeather = await currentResponse.json();
        
        // Capture sunrise and sunset times
        state.sunrise = state.currentWeather.sys.sunrise;
        state.sunset = state.currentWeather.sys.sunset;
        
        // Auto-apply theme based on location's season and time of day if theme is set to 'auto'
        if (state.currentTheme === 'auto') {
            const seasonTheme = themeManager.getAutoTheme(lat);
            const timeOfDay = themeManager.getCurrentTimeOfDay(state.sunrise, state.sunset);
            themeManager.applyTheme(seasonTheme, timeOfDay);
        }

        // Fetch forecast (includes hourly and daily)
        const forecastUrl = `${API_CONFIG.OPENWEATHER_BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${API_CONFIG.UNITS}&appid=${API_CONFIG.OPENWEATHER_KEY}`;
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) {
            throw new Error(`Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText}`);
        }
        state.forecast = await forecastResponse.json();

        // Fetch air quality data
        const aqUrl = `${API_CONFIG.OPENWEATHER_BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_CONFIG.OPENWEATHER_KEY}`;
        const aqResponse = await fetch(aqUrl);
        if (!aqResponse.ok) {
            throw new Error(`Air quality API error: ${aqResponse.status} ${aqResponse.statusText}`);
        }
        const aqData = await aqResponse.json();

        // Update UI
        updateCurrentWeather();
        updateHourlyForecast();
        updateDailyForecast();
        updateAirQuality(aqData);
        updateCharts();
        updateLastUpdated();
        
        // Start monitoring for day/night transition
        startDayNightMonitoring();

    } catch (error) {
        console.error('Weather data fetch error:', error);
        showError('Failed to fetch weather data: ' + error.message);
    } finally {
        showLoadingSpinner(false);
    }
}

// Update Current Weather
function updateCurrentWeather() {
    const data = state.currentWeather;

    elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
    elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
    elements.weatherDescription.textContent = data.weather[0].description;
    elements.humidity.textContent = `${data.main.humidity}%`;
    elements.windSpeed.textContent = `${data.wind.speed.toFixed(1)} m/s`;
    elements.pressure.textContent = `${data.main.pressure} hPa`;
    elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;

    // Weather icon
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
    const forecastList = state.forecast.list.slice(0, 8); // Next 24 hours (8 x 3-hour intervals)
    state.hourlyData = forecastList;

    elements.hourlyForecast.innerHTML = forecastList.map(item => {
        const date = new Date(item.dt * 1000);
        const hour = date.getHours().toString().padStart(2, '0') + ':00';
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;
        const feelsLike = Math.round(item.main.feels_like);

        return `
            <div class="hourly-card fade-in">
                <div class="hourly-time">${hour}</div>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather" class="hourly-icon">
                <div class="hourly-temp">${temp}°</div>
                <div class="hourly-detail">Feels: ${feelsLike}°</div>
            </div>
        `;
    }).join('');
}

// Update Daily Forecast
function updateDailyForecast() {
    const dailyData = {};

    // Group forecast by day
    state.forecast.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString('en-US');

        if (!dailyData[day]) {
            dailyData[day] = [];
        }
        dailyData[day].push(item);
    });

    // Get next 5 days
    const next5Days = Object.keys(dailyData).slice(0, 5);

    elements.dailyForecast.innerHTML = next5Days.map(day => {
        const dayItems = dailyData[day];
        const temps = dayItems.map(item => item.main.temp);
        const maxTemp = Math.round(Math.max(...temps));
        const minTemp = Math.round(Math.min(...temps));

        // Get most common weather
        const weatherCounts = {};
        dayItems.forEach(item => {
            const desc = item.weather[0].main;
            weatherCounts[desc] = (weatherCounts[desc] || 0) + 1;
        });
        const mainWeather = Object.keys(weatherCounts).reduce((a, b) =>
            weatherCounts[a] > weatherCounts[b] ? a : b
        );

        // Get icon from that weather
        const iconItem = dayItems.find(item => item.weather[0].main === mainWeather);
        const icon = iconItem.weather[0].icon;

        // Calculate rain probability
        const rainProb = Math.round(
            (dayItems.filter(item => item.rain).length / dayItems.length) * 100
        );

        const date = new Date(day);
        const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' });

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
    const aqi = data.list[0].main.aqi; // AQI scale: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
    const components = data.list[0].components;

    const aqiLevels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
    const aqiColors = ['', '#51cf66', '#74c0fc', '#ffd43b', '#ff922b', '#ff6b6b'];
    const aqiDescriptions = [
        '', 
        'Air quality is satisfactory. Enjoy outdoor activities!',
        'Acceptable air quality. Enjoy outdoor activities.',
        'Sensitive groups may experience health effects. Limit outdoor activity.',
        'General public may experience health effects. Reduce outdoor activity.',
        'Health alert! Everyone may experience serious health effects. Avoid outdoors.'
    ];

    const pollutants = [
        { label: 'PM2.5', value: Math.round(components.pm2_5), unit: 'µg/m³', desc: 'Fine Particles' },
        { label: 'PM10', value: Math.round(components.pm10), unit: 'µg/m³', desc: 'Coarse Particles' },
        { label: 'NO₂', value: Math.round(components.no2), unit: 'µg/m³', desc: 'Nitrogen Dioxide' },
        { label: 'O₃', value: Math.round(components.o3), unit: 'µg/m³', desc: 'Ozone' }
    ];

    elements.airQuality.innerHTML = `
        <div class="aq-card fade-in aq-main" style="border-color: ${aqiColors[aqi]}; background: linear-gradient(135deg, ${aqiColors[aqi]}15 0%, rgba(0,212,255,0.05) 100%);">
            <div class="aq-main-content">
                <div>
                    <div class="aq-label">🌍 Air Quality Index</div>
                    <div class="aq-scale">${aqi}/5</div>
                    <div class="aq-status" style="color: ${aqiColors[aqi]};">${aqiLevels[aqi]}</div>
                    <div style="font-size: 14px; color: var(--text-primary); margin-top: 12px; line-height: 1.5; font-weight: 500;">${aqiDescriptions[aqi]}</div>
                </div>
                <div class="aq-scale-bar">
                    <div class="aq-scale-item" style="background: #51cf66;" title="Good">1</div>
                    <div class="aq-scale-item" style="background: #74c0fc;" title="Fair">2</div>
                    <div class="aq-scale-item" style="background: #ffd43b; color: #000;" title="Moderate">3</div>
                    <div class="aq-scale-item" style="background: #ff922b;" title="Poor">4</div>
                    <div class="aq-scale-item ${aqi === 5 ? 'active' : ''}" style="background: #ff6b6b;" title="Very Poor">5</div>
                </div>
            </div>
        </div>
        ${pollutants.map(p => `
            <div class="aq-card fade-in">
                <div class="aq-label">${p.label}</div>
                <div class="aq-value">${p.value}</div>
                <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 8px;">${p.unit}</div>
                <div style="font-size: 13px; color: var(--text-primary); font-weight: 500;">${p.desc}</div>
            </div>
        `).join('')}
    `;
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

    const labels = data.map(item => {
        const date = new Date(item.dt * 1000);
        return date.getHours() + ':00';
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

    const labels = data.map(item => {
        const date = new Date(item.dt * 1000);
        return date.getHours() + ':00';
    });

    const humidity = data.map(item => item.main.humidity);
    const precipitation = data.map(item => (item.rain ? item.rain['3h'] : 0));

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

// Load Default Location (New York)
async function loadDefaultLocation() {
    try {
        await fetchWeatherData(40.7128, -74.0060); // New York coordinates
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

function startDayNightMonitoring() {
    // Clear any existing interval
    if (dayNightMonitoringInterval) {
        clearInterval(dayNightMonitoringInterval);
    }
    
    // Check for day/night transition every minute
    dayNightMonitoringInterval = setInterval(() => {
        if (state.sunrise && state.sunset && state.currentTheme === 'auto') {
            const currentTimeOfDay = themeManager.getCurrentTimeOfDay(state.sunrise, state.sunset);
            
            // If the time of day has changed, update the theme
            if (currentTimeOfDay !== state.currentTimeOfDay) {
                const seasonTheme = themeManager.getAutoTheme(state.currentLocation.lat);
                themeManager.applyTheme(seasonTheme, currentTimeOfDay);
                showNotification(`Switched to ${currentTimeOfDay} theme ✨`);
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
