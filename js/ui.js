/* ============================================================
   ui.js - User Interface Module
   Handles all DOM manipulation and rendering
   ============================================================ */

// ============================================
// DOM REFERENCES (cached on initialization)
// ============================================

const UI = {
    // Will be populated in init()
    elements: {},

    /**
     * Initializes the UI module by caching DOM references.
     * Called once at app startup.
     */
    init() {
        this.elements = {
            searchForm: document.getElementById('search-form'),
            searchInput: document.getElementById('search-input'),
            searchBtn: document.getElementById('search-btn'),
            errorMessage: document.getElementById('error-message'),
            loading: document.getElementById('loading'),
            weatherDisplay: document.getElementById('weather-display'),
            currentWeather: document.getElementById('current-weather'),
            hourlyForecast: document.getElementById('hourly-forecast'),
            forecast: document.getElementById('forecast'),
            recentSearches: document.getElementById('recent-searches'),
            recentList: document.getElementById('recent-list'),
            emptyState: document.getElementById('empty-state'),
            themeToggle: document.getElementById('theme-toggle'),
            locationBtn: document.getElementById('location-btn')
        };
    }
};

// ============================================
// STATE
// ============================================

let currentWeatherData = null;
let currentForecastData = null;
let currentHourlyData = null;

// ============================================
// LOADING STATE
// ============================================

/**
 * Shows the loading spinner and hides other sections.
 */
function showLoading() {
    const { loading, weatherDisplay, emptyState, errorMessage } = UI.elements;

    hideError();
    emptyState.hidden = true;
    weatherDisplay.hidden = true;
    loading.hidden = false;
}

/**
 * Hides the loading spinner.
 */
function hideLoading() {
    UI.elements.loading.hidden = true;
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Displays an error message to the user.
 * @param {string} message - Error message to display
 */
function showError(message) {
    const { errorMessage } = UI.elements;
    errorMessage.textContent = message || 'Something went wrong. Please try again.';
    errorMessage.hidden = false;
    hideLoading();
}

/**
 * Hides the error message.
 */
function hideError() {
    UI.elements.errorMessage.hidden = true;
}

// ============================================
// EMPTY STATE
// ============================================

/**
 * Shows the empty state (initial welcome view).
 */
function showEmptyState() {
    const { emptyState, weatherDisplay } = UI.elements;
    weatherDisplay.hidden = true;
    emptyState.hidden = false;
    hideLoading();
}

// ============================================
// WEATHER DISPLAY
// ============================================

/**
 * Renders all weather data (current + forecast + hourly) to the page.
 * @param {object} weatherData - { current, forecast, hourly }
 * @param {string} unit - 'C' or 'F'
 */
function renderWeatherData(weatherData, unit) {
    const { weatherDisplay, emptyState } = UI.elements;

    // Store data for unit toggle
    currentWeatherData = weatherData.current;
    currentForecastData = weatherData.forecast;
    currentHourlyData = weatherData.hourly;

    // Hide empty state, show weather display
    emptyState.hidden = true;
    hideLoading();
    hideError();

    // Render each section
    renderCurrentWeather(weatherData.current, unit);
    renderHourlyForecast(weatherData.hourly, unit);
    renderForecast(weatherData.forecast, unit);

    // Show the weather display with animation
    weatherDisplay.hidden = false;

    // Scroll to weather display smoothly
    setTimeout(() => {
        weatherDisplay.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ============================================
// CURRENT WEATHER
// ============================================

/**
 * Renders the current weather card.
 * @param {object} data - Current weather data object
 * @param {string} unit - 'C' or 'F'
 */
function renderCurrentWeather(data, unit) {
    const { currentWeather } = UI.elements;
    const temp = unit === 'F' ? celsiusToFahrenheit(data.temp) : data.temp;
    const feelsLike = unit === 'F' ? celsiusToFahrenheit(data.feelsLike) : data.feelsLike;
    const unitSymbol = unit === 'F' ? '°F' : '°C';
    const windSpeed = unit === 'F' ? kmhToMph(data.windSpeed) : data.windSpeed;
    const windUnit = unit === 'F' ? 'mph' : 'km/h';

    // Format date/time
    const now = new Date(data.dt * 1000);
    const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Wind direction
    const windDir = getWindDirection(data.windDeg);

    // Visibility
    const visibilityKm = (data.visibility / 1000).toFixed(1);

    const html = `
        <div class="current-weather__card">
            <div class="current-weather__header">
                <div class="current-weather__location-group">
                    <h2 class="current-weather__city">${escapeHtml(data.city)}, ${escapeHtml(data.country)}</h2>
                    <p class="current-weather__datetime">${dateStr} &middot; ${timeStr}</p>
                    <p class="current-weather__country">${escapeHtml(data.condition)}</p>
                </div>
                <button class="unit-toggle-btn" id="unit-toggle-btn" aria-label="Toggle temperature unit">
                    °C &nbsp;↔&nbsp; °F
                </button>
            </div>

            <div class="current-weather__main">
                <div class="current-weather__icon-wrapper">
                    <img
                        class="current-weather__icon"
                        src="${data.iconUrl}"
                        alt="${escapeHtml(data.condition)}"
                        width="100"
                        height="100"
                        loading="lazy"
                    >
                </div>
                <div class="current-weather__temp-group">
                    <div class="current-weather__temp">
                        ${temp}<span class="current-weather__temp-unit">${unitSymbol}</span>
                    </div>
                    <p class="current-weather__condition">${escapeHtml(data.condition)}</p>
                </div>
            </div>

            <div class="current-weather__details">
                <div class="weather-detail">
                    <div class="weather-detail__icon" aria-hidden="true">🌡️</div>
                    <div class="weather-detail__info">
                        <span class="weather-detail__label">Feels Like</span>
                        <span class="weather-detail__value">${feelsLike}${unitSymbol}</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail__icon" aria-hidden="true">💧</div>
                    <div class="weather-detail__info">
                        <span class="weather-detail__label">Humidity</span>
                        <span class="weather-detail__value">${data.humidity}%</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail__icon" aria-hidden="true">💨</div>
                    <div class="weather-detail__info">
                        <span class="weather-detail__label">Wind</span>
                        <span class="weather-detail__value">${windSpeed} ${windUnit} ${windDir}</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail__icon" aria-hidden="true">🔽</div>
                    <div class="weather-detail__info">
                        <span class="weather-detail__label">Pressure</span>
                        <span class="weather-detail__value">${data.pressure} hPa</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail__icon" aria-hidden="true">👁️</div>
                    <div class="weather-detail__info">
                        <span class="weather-detail__label">Visibility</span>
                        <span class="weather-detail__value">${visibilityKm} km</span>
                    </div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail__icon" aria-hidden="true">☀️</div>
                    <div class="weather-detail__info">
                        <span class="weather-detail__label">Sunrise / Sunset</span>
                        <span class="weather-detail__value">${formatTimeByOffset(data.sunrise, data.timezone)} / ${formatTimeByOffset(data.sunset, data.timezone)}</span>
                    </div>
                </div>
            </div>

            <!-- Weather condition animation elements -->
            ${getWeatherAnimationHTML(data.animation)}
        </div>
    `;

    currentWeather.innerHTML = html;

    // Add event listener to the unit toggle button inside current weather
    const unitToggleBtn = document.getElementById('unit-toggle-btn');
    if (unitToggleBtn) {
        unitToggleBtn.addEventListener('click', () => {
            // Dispatch a custom event that app.js listens to
            document.dispatchEvent(new CustomEvent('toggle-unit'));
        });
    }
}

// ============================================
// HOURLY FORECAST
// ============================================

/**
 * Renders the hourly forecast section.
 * @param {Array} data - Array of hourly forecast objects (up to 8)
 * @param {string} unit - 'C' or 'F'
 */
function renderHourlyForecast(data, unit) {
    const { hourlyForecast } = UI.elements;
    const unitSymbol = unit === 'F' ? '°F' : '°C';

    if (!data || data.length === 0) {
        hourlyForecast.hidden = true;
        return;
    }

    const cardsHtml = data.map(hour => {
        const temp = unit === 'F' ? celsiusToFahrenheit(hour.temp) : hour.temp;
        return `
            <div class="hourly-card">
                <span class="hourly-card__time">${hour.time}</span>
                <img
                    class="hourly-card__icon"
                    src="${hour.iconUrl}"
                    alt="${escapeHtml(hour.condition)}"
                    width="40"
                    height="40"
                    loading="lazy"
                >
                <span class="hourly-card__temp">${temp}${unitSymbol}</span>
            </div>
        `;
    }).join('');

    hourlyForecast.innerHTML = `
        <div class="section-title">Hourly Forecast</div>
        <div class="hourly-forecast__scroll">
            ${cardsHtml}
        </div>
    `;

    hourlyForecast.hidden = false;
}

// ============================================
// 5-DAY FORECAST
// ============================================

/**
 * Renders the 5-day forecast section.
 * @param {Array} data - Array of daily forecast objects
 * @param {string} unit - 'C' or 'F'
 */
function renderForecast(data, unit) {
    const { forecast } = UI.elements;
    const unitSymbol = unit === 'F' ? '°F' : '°C';

    if (!data || data.length === 0) return;

    const cardsHtml = data.map(day => {
        const tempMax = unit === 'F' ? celsiusToFahrenheit(day.tempMax) : day.tempMax;
        const tempMin = unit === 'F' ? celsiusToFahrenheit(day.tempMin) : day.tempMin;
        return `
            <div class="forecast-card">
                <span class="forecast-card__day">${escapeHtml(day.day)}</span>
                <span class="forecast-card__date">${escapeHtml(day.date)}</span>
                <img
                    class="forecast-card__icon"
                    src="${day.iconUrl}"
                    alt="${escapeHtml(day.condition)}"
                    width="56"
                    height="56"
                    loading="lazy"
                >
                <span class="forecast-card__condition">${escapeHtml(day.condition)}</span>
                <div class="forecast-card__temps">
                    <span class="forecast-card__temp-max">${tempMax}${unitSymbol}</span>
                    <span class="forecast-card__temp-sep">/</span>
                    <span class="forecast-card__temp-min">${tempMin}${unitSymbol}</span>
                </div>
            </div>
        `;
    }).join('');

    forecast.innerHTML = `
        <div class="section-title">5-Day Forecast</div>
        <div class="forecast__grid">
            ${cardsHtml}
        </div>
    `;
}

// ============================================
// RECENT SEARCHES
// ============================================

/**
 * Renders the recent searches list with individual delete and clear all buttons.
 * @param {string[]} searches - Array of city names
 */
function renderRecentSearches(searches) {
    const { recentSearches, recentList } = UI.elements;

    if (!searches || searches.length === 0) {
        recentSearches.hidden = true;
        return;
    }

    const itemsHtml = searches.map(city => `
        <div class="recent-item-wrapper">
            <button class="recent-item" data-city="${escapeHtml(city)}" role="listitem" title="Search ${escapeHtml(city)}">
                ${escapeHtml(city)}
            </button>
            <button
                class="recent-item__delete"
                data-city="${escapeHtml(city)}"
                aria-label="Remove ${escapeHtml(city)} from history"
                title="Remove"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        </div>
    `).join('');

    const clearAllHtml = `
        <button class="recent-item__clear" aria-label="Clear all search history" title="Clear all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Clear All
        </button>
    `;

    recentList.innerHTML = itemsHtml + clearAllHtml;
    recentSearches.hidden = false;
}

// ============================================
// THEME
// ============================================

/**
 * Applies the given theme to the document.
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update the toggle button icon
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Update the meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.content = theme === 'dark' ? '#1A1A2E' : '#2196F3';
    }
}

// ============================================
// INTERNAL HELPERS
// ============================================

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Converts a wind degree to a cardinal direction.
 * @param {number} deg - Wind direction in degrees
 * @returns {string} Cardinal direction (e.g., "N", "NE")
 */
function getWindDirection(deg) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                        'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(deg / 22.5) % 16;
    return directions[index];
}

/**
 * Formats a Unix timestamp with a timezone offset to a time string.
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {number} timezoneOffset - Timezone offset in seconds
 * @returns {string} Formatted time
 */
function formatTimeByOffset(timestamp, timezoneOffset) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const minStr = minutes.toString().padStart(2, '0');
    return `${hour12}:${minStr} ${ampm}`;
}

/**
 * Generates HTML for weather condition CSS animations.
 * @param {string} animationType - Type of animation ('clear', 'rain', 'snow', 'clouds', 'thunder')
 * @returns {string} HTML for animation elements
 */
function getWeatherAnimationHTML(animationType) {
    switch (animationType) {
        case 'clear':
            return '<div class="sun-animation" aria-hidden="true"></div>';
        case 'rain':
            return Array.from({ length: 8 }, () =>
                `<div class="rain-drop" aria-hidden="true" style="left: ${Math.random() * 100}%; animation-delay: ${(Math.random() * 2).toFixed(2)}s; animation-duration: ${(0.8 + Math.random() * 0.6).toFixed(2)}s; height: ${15 + Math.random() * 20}px;"></div>`
            ).join('');
        case 'snow':
            return Array.from({ length: 12 }, () =>
                `<div class="snow-flake" aria-hidden="true" style="left: ${Math.random() * 100}%; animation-delay: ${(Math.random() * 3).toFixed(2)}s; animation-duration: ${(2 + Math.random() * 2).toFixed(2)}s; width: ${4 + Math.random() * 4}px; height: ${4 + Math.random() * 4}px;"></div>`
            ).join('');
        case 'clouds':
            return `
                <div class="cloud-float" aria-hidden="true" style="top: 10%; left: 10%; animation-delay: 0s;"></div>
                <div class="cloud-float" aria-hidden="true" style="top: 30%; right: 15%; animation-delay: -3s; width: 80px; height: 30px;"></div>
            `;
        case 'thunder':
            return `
                <div class="thunder-flash" aria-hidden="true"></div>
                ${Array.from({ length: 6 }, () =>
                    `<div class="rain-drop" aria-hidden="true" style="left: ${Math.random() * 100}%; animation-delay: ${(Math.random() * 2).toFixed(2)}s; animation-duration: ${(0.6 + Math.random() * 0.4).toFixed(2)}s; height: ${15 + Math.random() * 20}px;"></div>`
                ).join('')}
            `;
        default:
            return '';
    }
}

/**
 * Re-renders the currently displayed weather data with a new unit.
 * This is called when the user toggles between °C and °F.
 * @param {string} unit - 'C' or 'F'
 */
function rerenderWithUnit(unit) {
    if (!currentWeatherData) return;

    const weatherData = {
        current: currentWeatherData,
        forecast: currentForecastData,
        hourly: currentHourlyData
    };

    renderWeatherData(weatherData, unit);
}
