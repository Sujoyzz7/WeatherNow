/* ============================================================
   api.js - Weather API Module
   Handles all OpenWeatherMap API requests
   ============================================================ */

// ============================================
// CONFIGURATION
// ============================================

/**
 * OpenWeatherMap API Configuration
 *
 * To use this app, get a free API key at:
 * https://openweathermap.org/appid
 *
 * Replace the placeholder below with your actual API key.
 */
const API_CONFIG = {
    KEY: '9dc6c2f8122c45b2494076b325bbe7f0',        // ← Your OpenWeatherMap API key
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    ICON_URL: 'https://openweathermap.org/img/wn',
    UNITS: 'metric',                  // 'metric' for Celsius, 'imperial' for Fahrenheit
    LANG: 'en'
};

// ============================================
// DATA PROCESSING HELPERS
// ============================================

/**
 * Maps OpenWeatherMap weather condition codes to CSS classes
 * for background animations.
 */
const WEATHER_CONDITIONS = {
    THUNDERSTORM: { group: 'thunderstorm', label: 'Thunderstorm', animation: 'thunder' },
    DRIZZLE:      { group: 'drizzle',      label: 'Drizzle',      animation: 'rain' },
    RAIN:         { group: 'rain',         label: 'Rain',         animation: 'rain' },
    SNOW:         { group: 'snow',         label: 'Snow',         animation: 'snow' },
    ATMOSPHERE:   { group: 'mist',         label: 'Mist',         animation: 'mist' },
    CLEAR:        { group: 'clear',        label: 'Clear',        animation: 'clear' },
    CLOUDS:       { group: 'clouds',       label: 'Cloudy',       animation: 'clouds' }
};

/**
 * Determines the weather condition group from an icon code.
 * @param {string} icon - OpenWeatherMap icon code (e.g. '01d', '10n')
 * @returns {object} Weather condition object
 */
function getWeatherCondition(icon) {
    const code = parseInt(icon.substring(0, 2), 10);

    if (code >= 200 && code < 300) return WEATHER_CONDITIONS.THUNDERSTORM;
    if (code >= 300 && code < 400) return WEATHER_CONDITIONS.DRIZZLE;
    if (code >= 500 && code < 600) return WEATHER_CONDITIONS.RAIN;
    if (code >= 600 && code < 700) return WEATHER_CONDITIONS.SNOW;
    if (code >= 700 && code < 800) return WEATHER_CONDITIONS.ATMOSPHERE;
    if (code === 800)              return WEATHER_CONDITIONS.CLEAR;
    if (code >= 800)               return WEATHER_CONDITIONS.CLOUDS;

    return WEATHER_CONDITIONS.CLEAR;
}

/**
 * Formats a Unix timestamp to a readable time string.
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {string} timezoneOffset - Timezone offset in seconds
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
function formatTime(timestamp, timezoneOffset = 0) {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const minStr = minutes.toString().padStart(2, '0');
    return `${hour12}:${minStr} ${ampm}`;
}

/**
 * Formats a Unix timestamp to a date string.
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Formatted date (e.g., "Mon, 15 Jan")
 */
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Gets the day name from a Unix timestamp.
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} Day name (e.g., "Monday")
 */
function getDayName(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Gets the day as a short label like "Mon", "Tue", etc.
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string} 
 */
function getShortDayName(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/**
 * Formats a date as "DD Month" (e.g., "15 Jan").
 * @param {number} timestamp - Unix timestamp in seconds
 * @returns {string}
 */
function getDateStr(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

/**
 * Checks if the icon represents a night-time condition.
 * @param {string} icon - Icon code
 * @returns {boolean}
 */
function isNightIcon(icon) {
    return icon.endsWith('n');
}

// ============================================
// API REQUEST FUNCTIONS
// ============================================

/**
 * Builds the full icon URL from an icon code.
 * @param {string} iconCode - e.g., "01d"
 * @param {string} [size='@2x'] - Icon size ('@2x' or '')
 * @returns {string} Full icon URL
 */
function getIconUrl(iconCode, size = '@2x') {
    return `${API_CONFIG.ICON_URL}/${iconCode}${size}.png`;
}

/**
 * Fetches current weather data for a given city.
 * @param {string} city - City name
 * @returns {Promise<object>} Current weather data
 * @throws {Error} If city not found or API fails
 */
async function fetchCurrentWeather(city) {
    const url = `${API_CONFIG.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_CONFIG.KEY}&units=${API_CONFIG.UNITS}&lang=${API_CONFIG.LANG}`;

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found');
        }
        throw new Error('Unable to fetch weather data. Please try again later.');
    }

    const data = await response.json();
    return processCurrentWeather(data);
}

/**
 * Fetches current weather data using geographic coordinates.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object>} Current weather data
 * @throws {Error} If API fails
 */
async function fetchWeatherByCoords(lat, lon) {
    const url = `${API_CONFIG.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_CONFIG.KEY}&units=${API_CONFIG.UNITS}&lang=${API_CONFIG.LANG}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Unable to fetch weather data. Please try again later.');
    }

    const data = await response.json();
    return processCurrentWeather(data);
}

/**
 * Fetches the 5-day / 3-hour forecast for a given city.
 * @param {string} city - City name
 * @returns {Promise<Array>} Array of daily forecast objects (5 days)
 * @throws {Error} If API fails
 */
async function fetchForecast(city) {
    const url = `${API_CONFIG.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_CONFIG.KEY}&units=${API_CONFIG.UNITS}&lang=${API_CONFIG.LANG}`;

    const response = await fetch(url);

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City not found');
        }
        throw new Error('Unable to fetch weather data. Please try again later.');
    }

    const data = await response.json();
    return processForecast(data);
}

/**
 * Fetches the 5-day / 3-hour forecast using geographic coordinates.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Array>} Array of daily forecast objects (5 days)
 * @throws {Error} If API fails
 */
async function fetchForecastByCoords(lat, lon) {
    const url = `${API_CONFIG.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_CONFIG.KEY}&units=${API_CONFIG.UNITS}&lang=${API_CONFIG.LANG}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Unable to fetch weather data. Please try again later.');
    }

    const data = await response.json();
    return processForecast(data);
}

/**
 * Fetches air quality data for given coordinates.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<object|null>} Air quality data or null on failure
 */
async function fetchAirQuality(lat, lon) {
    const url = `${API_CONFIG.BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_CONFIG.KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return processAirQuality(data);
    } catch (error) {
        console.warn('Failed to fetch air quality:', error);
        return null;
    }
}

/**
 * Processes raw air pollution API response into a clean object.
 * @param {object} data - Raw API response
 * @returns {object} Processed air quality data
 */
function processAirQuality(data) {
    const item = data.list[0];
    const aqi = item.main.aqi;
    const components = item.components;

    const labels = {
        1: { label: 'Good', color: '#10B981', icon: '😊' },
        2: { label: 'Fair', color: '#F59E0B', icon: '🙂' },
        3: { label: 'Moderate', color: '#F97316', icon: '😐' },
        4: { label: 'Poor', color: '#EF4444', icon: '😷' },
        5: { label: 'Very Poor', color: '#8B5CF6', icon: '🤢' }
    };

    return {
        aqi,
        label: labels[aqi]?.label || 'Unknown',
        color: labels[aqi]?.color || '#9CA3AF',
        icon: labels[aqi]?.icon || '❓',
        components: {
            co: components.co.toFixed(1),
            no: components.no.toFixed(2),
            no2: components.no2.toFixed(1),
            o3: components.o3.toFixed(1),
            so2: components.so2.toFixed(1),
            pm2_5: components.pm2_5.toFixed(1),
            pm10: components.pm10.toFixed(1),
            nh3: components.nh3.toFixed(2)
        }
    };
}

/**
 * Fetches both current weather and forecast for a city in parallel.
 * Also fetches air quality data using coordinates from the weather response.
 * @param {string} city - City name
 * @returns {Promise<{current: object, forecast: Array, hourly: Array, airQuality: object|null}>}
 */
async function fetchWeatherData(city) {
    const [current, forecast] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city)
    ]);

    // Fetch air quality using coordinates from current weather
    let airQuality = null;
    if (current.lat && current.lon) {
        airQuality = await fetchAirQuality(current.lat, current.lon);
    }

    return {
        current,
        forecast: forecast.daily,
        hourly: forecast.hourly,
        airQuality
    };
}

/**
 * Fetches both current weather and forecast using coordinates in parallel.
 * Also fetches air quality data.
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<{current: object, forecast: Array, hourly: Array, airQuality: object|null}>}
 */
async function fetchWeatherDataByCoords(lat, lon) {
    const [current, forecast, airQuality] = await Promise.all([
        fetchWeatherByCoords(lat, lon),
        fetchForecastByCoords(lat, lon),
        fetchAirQuality(lat, lon)
    ]);

    return {
        current,
        forecast: forecast.daily,
        hourly: forecast.hourly,
        airQuality
    };
}

// ============================================
// DATA PROCESSING FUNCTIONS
// ============================================

/**
 * Processes the raw current weather API response into a clean object.
 * @param {object} data - Raw API response
 * @returns {object} Processed current weather data
 */
function processCurrentWeather(data) {
    const condition = getWeatherCondition(data.weather[0].icon);

    return {
        lat: data.coord.lat,
        lon: data.coord.lon,
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDeg: data.wind.deg,
        visibility: data.visibility,
        condition: data.weather[0].description,
        conditionMain: condition.label,
        icon: data.weather[0].icon,
        iconUrl: getIconUrl(data.weather[0].icon),
        conditionGroup: condition.group,
        animation: condition.animation,
        isNight: isNightIcon(data.weather[0].icon),
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        timezone: data.timezone,
        dt: data.dt,
        clouds: data.clouds ? data.clouds.all : 0
    };
}

/**
 * Processes the raw 5-day/3-hour forecast API response.
 * Groups 3-hour intervals into daily forecasts and extracts hourly data.
 * @param {object} data - Raw API response from forecast endpoint
 * @returns {object} { daily: Array, hourly: Array }
 */
function processForecast(data) {
    const dailyMap = new Map();
    const hourlyData = [];

    data.list.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toISOString().split('T')[0];

        // Collect hourly data (next 24 hours)
        if (hourlyData.length < 8) {
            const condition = getWeatherCondition(item.weather[0].icon);
            hourlyData.push({
                dt: item.dt,
                time: formatTime(item.dt, data.city.timezone),
                temp: Math.round(item.main.temp),
                icon: item.weather[0].icon,
                iconUrl: getIconUrl(item.weather[0].icon, ''),
                condition: item.weather[0].description,
                conditionGroup: condition.group
            });
        }

        // Group by day for daily forecast
        if (!dailyMap.has(dayKey)) {
            dailyMap.set(dayKey, {
                dt: item.dt,
                day: getDayName(item.dt),
                shortDay: getShortDayName(item.dt),
                date: getDateStr(item.dt),
                temps: [],
                icons: [],
                conditions: [],
                descriptions: []
            });
        }

        const dayData = dailyMap.get(dayKey);
        dayData.temps.push(item.main.temp);
        dayData.icons.push(item.weather[0].icon);
        dayData.conditions.push(item.weather[0].main);
        dayData.descriptions.push(item.weather[0].description);
    });

    // Process daily data
    const daily = [];
    dailyMap.forEach((dayData, key) => {
        const mostFrequentIcon = getMostFrequent(dayData.icons);
        const mostFrequentCondition = getMostFrequent(dayData.conditions);
        const condition = getWeatherCondition(mostFrequentIcon);

        daily.push({
            dt: dayData.dt,
            day: dayData.day,
            shortDay: dayData.shortDay,
            date: dayData.date,
            tempMax: Math.round(Math.max(...dayData.temps)),
            tempMin: Math.round(Math.min(...dayData.temps)),
            icon: mostFrequentIcon,
            iconUrl: getIconUrl(mostFrequentIcon),
            condition: mostFrequentCondition,
            description: getMostFrequent(dayData.descriptions),
            conditionGroup: condition.group
        });
    });

    // Limit to 5 days, skipping today if it's a partial day
    const result = daily.slice(0, 5);

    return {
        daily: result,
        hourly: hourlyData
    };
}

/**
 * Returns the most frequent item in an array.
 * Used to determine the dominant weather condition for a day.
 * @param {Array} arr - Array of items
 * @returns {*} Most frequent item
 */
function getMostFrequent(arr) {
    const freq = {};
    let maxFreq = 0;
    let mostFrequent = arr[0];

    arr.forEach(item => {
        freq[item] = (freq[item] || 0) + 1;
        if (freq[item] > maxFreq) {
            maxFreq = freq[item];
            mostFrequent = item;
        }
    });

    return mostFrequent;
}

// ============================================
// HELPER FUNCTION (for temperature conversion)
// ============================================

/**
 * Converts Celsius to Fahrenheit.
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9 / 5) + 32);
}

/**
 * Converts Fahrenheit to Celsius.
 * @param {number} fahrenheit - Temperature in Fahrenheit
 * @returns {number} Temperature in Celsius
 */
function fahrenheitToCelsius(fahrenheit) {
    return Math.round((fahrenheit - 32) * 5 / 9);
}

/**
 * Converts wind speed from km/h to mph.
 * @param {number} kmh - Wind speed in km/h
 * @returns {number} Wind speed in mph
 */
function kmhToMph(kmh) {
    return Math.round(kmh * 0.621371);
}
