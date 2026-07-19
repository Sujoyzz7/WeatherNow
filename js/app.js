/* ============================================================
   app.js - Application Entry Point
   Initializes the app, connects modules, and handles events
   ============================================================ */

// ============================================
// APPLICATION STATE
// ============================================

const AppState = {
    currentCity: '',
    isFetching: false,
    unit: 'C',
    init() {
        this.unit = loadUnit();
        return this;
    }
};

// ============================================
// DOM READY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initializes the entire application.
 * Sets up UI, loads saved preferences, renders history, and binds events.
 */
function initApp() {
    // Initialize modules
    UI.init();
    AppState.init();

    // Apply saved theme
    const savedTheme = loadTheme();
    applyTheme(savedTheme);

    // Apply saved unit
    AppState.unit = loadUnit();

    // Render recent searches
    const searches = loadSearches();
    renderRecentSearches(searches);

    // Bind all event listeners
    bindEvents();

    // Check for geolocation support (but don't auto-request)
    checkGeolocationSupport();
}

// ============================================
// EVENT BINDING
// ============================================

/**
 * Binds all event listeners for the application.
 */
function bindEvents() {
    const { searchForm, searchInput, locationBtn, recentList } = UI.elements;

    // Search form submission (covers both button click and Enter key)
    searchForm.addEventListener('submit', handleSearchSubmit);

    // Current location button
    locationBtn.addEventListener('click', handleCurrentLocation);

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', handleThemeToggle);

    // Recent searches (delegated clicks)
    recentList.addEventListener('click', handleRecentSearchClick);
    recentList.addEventListener('click', handleRecentSearchDelete);
    recentList.addEventListener('click', handleClearAll);

    // Custom event: unit toggle from ui.js
    document.addEventListener('toggle-unit', handleUnitToggle);

    // Keyboard shortcut: Ctrl+/ to focus search
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            searchInput.focus();
        }
        // Escape to clear search
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.blur();
        }
    });

    // Update footer year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// ============================================
// EVENT HANDLERS
// ============================================

/**
 * Handles the search form submission.
 * Validates input, shows loading, fetches weather, and renders results.
 * @param {Event} e - Submit event
 */
async function handleSearchSubmit(e) {
    e.preventDefault();

    if (AppState.isFetching) return;

    const city = UI.elements.searchInput.value.trim();

    // Validate: empty input
    if (!city) {
        showError('Please enter a city name');
        UI.elements.searchInput.focus();
        return;
    }

    // Initiate the search
    await performSearch(city);
}

/**
 * Performs a city search: fetches weather data and updates UI.
 * @param {string} city - City name to search for
 */
async function performSearch(city) {
    if (!city) return;

    AppState.isFetching = true;
    AppState.currentCity = city;

    // Show loading state
    showLoading();
    hideError();

    try {
        // Fetch weather data
        const weatherData = await fetchWeatherData(city);

        // Add to search history
        const updatedSearches = addSearch(city);
        renderRecentSearches(updatedSearches);

        // Render the weather display
        renderWeatherData(weatherData, AppState.unit);

    } catch (error) {
        console.error('Search error:', error);
        showError(error.message || 'Unable to fetch weather data. Please try again later.');
        UI.elements.weatherDisplay.hidden = true;
    } finally {
        AppState.isFetching = false;
        hideLoading();
    }
}

/**
 * Handles the "Get Current Location" button click.
 * Uses the browser Geolocation API to get coordinates and fetches weather.
 */
async function handleCurrentLocation() {
    if (AppState.isFetching) return;

    // Check if geolocation is available
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    AppState.isFetching = true;

    // Show loading
    showLoading();
    hideError();

    // Get current position
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const weatherData = await fetchWeatherDataByCoords(latitude, longitude);

                // Update state
                AppState.currentCity = weatherData.current.city;

                // Add to search history
                const updatedSearches = addSearch(weatherData.current.city);
                renderRecentSearches(updatedSearches);

                // Set the search input value
                UI.elements.searchInput.value = weatherData.current.city;

                // Render
                renderWeatherData(weatherData, AppState.unit);

            } catch (error) {
                console.error('Location fetch error:', error);
                showError(error.message || 'Unable to fetch weather data for your location.');
            } finally {
                AppState.isFetching = false;
            }
        },
        (error) => {
            AppState.isFetching = false;
            let message = 'Unable to access your location.';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    message = 'Location access was denied. Please enable it in your browser settings.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    message = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    message = 'The request to get your location timed out.';
                    break;
            }
            showError(message);
            hideLoading();
        },
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes cache
        }
    );
}

/**
 * Handles clicks on recent search items (city name).
 * Delegated from the parent container.
 * @param {Event} e - Click event
 */
function handleRecentSearchClick(e) {
    const item = e.target.closest('.recent-item');
    if (!item) return;

    const city = item.dataset.city;
    if (!city) return;

    // Set the search input value
    UI.elements.searchInput.value = city;

    // Perform the search
    performSearch(city);
}

/**
 * Handles clicks on individual delete buttons in recent searches.
 * @param {Event} e - Click event
 */
function handleRecentSearchDelete(e) {
    const deleteBtn = e.target.closest('.recent-item__delete');
    if (!deleteBtn) return;

    const city = deleteBtn.dataset.city;
    if (!city) return;

    e.stopPropagation();

    // Remove the city from storage
    const updatedSearches = removeSearch(city);
    renderRecentSearches(updatedSearches);
}

/**
 * Handles clicks on the "Clear All" button in recent searches.
 * @param {Event} e - Click event
 */
function handleClearAll(e) {
    const clearBtn = e.target.closest('.recent-item__clear');
    if (!clearBtn) return;

    e.stopPropagation();

    // Clear all searches
    clearSearches();
    renderRecentSearches([]);
}

/**
 * Handles the theme toggle button click.
 */
function handleThemeToggle() {
    const newTheme = toggleTheme();
    applyTheme(newTheme);
}

/**
 * Handles the unit toggle custom event.
 * Toggles between Celsius and Fahrenheit.
 */
function handleUnitToggle() {
    const newUnit = toggleUnit();
    AppState.unit = newUnit;
    rerenderWithUnit(newUnit);
}

// ============================================
// GEOLOCATION CHECK
// ============================================

/**
 * Checks if geolocation is supported and logs availability.
 * Does not request permission automatically.
 */
function checkGeolocationSupport() {
    if (!navigator.geolocation) {
        console.info('Geolocation not available. "Current Location" feature disabled.');
        const locationBtn = UI.elements.locationBtn;
        locationBtn.disabled = true;
        locationBtn.title = 'Geolocation not supported';
        locationBtn.style.opacity = '0.4';
        locationBtn.style.cursor = 'not-allowed';
    }
}

// ============================================
// PUBLIC API (for debugging / console access)
// ============================================

// Expose key functions for debugging purposes
window.__WeatherNow = {
    state: AppState,
    search: performSearch,
    refresh: () => {
        if (AppState.currentCity) {
            performSearch(AppState.currentCity);
        }
    },
    clearHistory: () => {
        clearSearches();
        renderRecentSearches([]);
    }
};
