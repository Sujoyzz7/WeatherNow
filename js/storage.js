/* ============================================================
   storage.js - Local Storage Module
   Handles all browser storage operations
   ============================================================ */

// ============================================
// STORAGE KEYS
// ============================================

const STORAGE_KEYS = {
    SEARCHES: 'weathernow_searches',
    THEME: 'weathernow_theme',
    UNIT: 'weathernow_unit'
};

const MAX_SEARCHES = 5;

// ============================================
// SEARCH HISTORY
// ============================================

/**
 * Retrieves the list of recent searched cities from Local Storage.
 * @returns {string[]} Array of city names, newest first
 */
function loadSearches() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SEARCHES);
        if (!data) return [];
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.warn('Failed to load searches from Local Storage:', error);
        return [];
    }
}

/**
 * Saves the list of recent searched cities to Local Storage.
 * Ensures no duplicates and limits to MAX_SEARCHES items.
 * @param {string[]} searches - Array of city names
 */
function saveSearches(searches) {
    try {
        const clean = searches
            .filter(city => city && typeof city === 'string')
            .slice(0, MAX_SEARCHES);
        localStorage.setItem(STORAGE_KEYS.SEARCHES, JSON.stringify(clean));
    } catch (error) {
        console.warn('Failed to save searches to Local Storage:', error);
    }
}

/**
 * Adds a city to the search history.
 * Removes duplicates, keeps the newest entry, limits to MAX_SEARCHES.
 * @param {string} city - City name to add
 * @returns {string[]} Updated list of recent searches
 */
function addSearch(city) {
    if (!city || typeof city !== 'string') return loadSearches();

    const searches = loadSearches();
    // Remove the city if it already exists
    const filtered = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
    // Add the city to the beginning
    filtered.unshift(city);
    // Keep only the most recent MAX_SEARCHES
    const updated = filtered.slice(0, MAX_SEARCHES);
    saveSearches(updated);
    return updated;
}

/**
 * Removes a specific city from the search history.
 * @param {string} city - City name to remove
 * @returns {string[]} Updated list of recent searches
 */
function removeSearch(city) {
    if (!city || typeof city !== 'string') return loadSearches();

    const searches = loadSearches();
    const filtered = searches.filter(s => s.toLowerCase() !== city.toLowerCase());
    saveSearches(filtered);
    return filtered;
}

/**
 * Clears all search history from Local Storage.
 */
function clearSearches() {
    try {
        localStorage.removeItem(STORAGE_KEYS.SEARCHES);
    } catch (error) {
        console.warn('Failed to clear searches from Local Storage:', error);
    }
}

// ============================================
// THEME PREFERENCE
// ============================================

/**
 * Retrieves the saved theme preference.
 * @returns {string} 'dark' or 'light'
 */
function loadTheme() {
    try {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    } catch (error) {
        console.warn('Failed to load theme from Local Storage:', error);
        return 'light';
    }
}

/**
 * Saves the theme preference to Local Storage.
 * @param {string} theme - 'dark' or 'light'
 */
function saveTheme(theme) {
    try {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
        console.warn('Failed to save theme to Local Storage:', error);
    }
}

/**
 * Toggles the current theme preference and saves it.
 * @returns {string} The new theme value ('dark' or 'light')
 */
function toggleTheme() {
    const current = loadTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    saveTheme(next);
    return next;
}

// ============================================
// TEMPERATURE UNIT PREFERENCE
// ============================================

/**
 * Retrieves the saved temperature unit preference.
 * @returns {string} 'C' or 'F'
 */
function loadUnit() {
    try {
        return localStorage.getItem(STORAGE_KEYS.UNIT) || 'C';
    } catch (error) {
        console.warn('Failed to load unit from Local Storage:', error);
        return 'C';
    }
}

/**
 * Saves the temperature unit preference to Local Storage.
 * @param {string} unit - 'C' or 'F'
 */
function saveUnit(unit) {
    try {
        localStorage.setItem(STORAGE_KEYS.UNIT, unit);
    } catch (error) {
        console.warn('Failed to save unit to Local Storage:', error);
    }
}

/**
 * Toggles the temperature unit and saves it.
 * @returns {string} The new unit value ('C' or 'F')
 */
function toggleUnit() {
    const current = loadUnit();
    const next = current === 'C' ? 'F' : 'C';
    saveUnit(next);
    return next;
}

// ============================================
// UTILITY: Check Local Storage availability
// ============================================

/**
 * Checks if Local Storage is available and writable.
 * @returns {boolean} Whether Local Storage is available
 */
function isStorageAvailable() {
    try {
        const testKey = '__weathernow_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}
