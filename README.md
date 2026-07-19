<div align="center">
  <br>
  <h1>🌤️ WeatherNow</h1>
  <p><strong>A Modern, Accessible Weather Dashboard</strong></p>
  <p>
    <img alt="Version" src="https://img.shields.io/badge/version-2.2.0-blue?style=flat-square">
    <img alt="JavaScript" src="https://img.shields.io/badge/vanilla-JS-f7df1e?style=flat-square&logo=javascript">
    <img alt="OpenWeatherMap" src="https://img.shields.io/badge/powered%20by-OpenWeatherMap-orange?style=flat-square">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-green?style=flat-square">
  </p>
  <br>
</div>

---

**WeatherNow** is a production-quality weather dashboard that delivers real-time weather data through a clean, responsive interface. Built entirely with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build tools, no bloat.

Search any city worldwide for current conditions, hourly snapshots, a 5-day forecast, air quality data, and immersive CSS weather animations. Designed with accessibility at its core and performance as a priority.

---

## 📸 Screenshots

> _Screenshots coming soon. The app includes a beautiful light/dark theme, animated weather effects, and a responsive grid layout._

| Light Theme | Dark Theme | Mobile |
|:---:|:---:|:---:|
| _Preview_ | _Preview_ | _Preview_ |

---

## ✨ Features

### 📊 Weather Data
- **Current Conditions** — Temperature, feels-like, humidity, wind speed & direction, atmospheric pressure, visibility, sunrise/sunset
- **Hourly Forecast** — Scrollable 24-hour breakdown with drag-to-scroll, custom scrollbar, and keyboard navigation
- **5-Day Forecast** — Daily high/low temperatures, weather icons, and conditions in a responsive card grid
- **Air Quality Index** — AQI level with color-coded gauge bar and pollutant breakdown (PM2.5, PM10, O₃, NO₂, SO₂, CO)

### 🎨 User Experience
- **🌙 Dark / Light Theme** — Toggle with saved preference in Local Storage
- **🌡️ Temperature Unit Toggle** — Switch between Celsius and Fahrenheit, preference persists
- **🕐 Recent Search History** — Last 5 cities stored locally, clickable to re-search with individual delete and clear all
- **📍 Current Location** — One-click weather for your position via Geolocation API
- **🎬 Weather Animations** — Dynamic CSS animations for sunny, rainy, snowy, cloudy, stormy, and foggy conditions (day & night)
- **⌨️ Keyboard Shortcuts** — `Ctrl+/` to focus search, `Escape` to clear input, arrow keys to navigate hourly forecast

### ♿ Accessibility
- **ARIA Live Regions** — Screen reader announcements for weather data, errors, loading states, and preference changes
- **Skip-to-Content Link** — Keyboard-first navigation
- **Roving Tabindex** — Hourly forecast cards with full keyboard control (arrow keys, Home, End)
- **Dynamic ARIA Labels** — Buttons update their labels to reflect current state (theme mode, temperature unit)
- **Focus Management** — Search results shift focus to weather display automatically
- **Semantic HTML** — Proper landmarks, headings, and roles throughout
- **Reduced Motion Support** — Respects `prefers-reduced-motion` OS setting

### ⚡ Performance
- **Zero Dependencies** — No frameworks, no libraries, no build step
- **Lazy-Loaded Images** — Weather icons load only when visible
- **Optimized Animations** — CSS `will-change` and `transform` for GPU-accelerated rendering
- **Shimmer Loading Skeletons** — Instant visual feedback while data loads, matching real content layout
- **Local Storage Caching** — Preferences and history survive page refreshes

### 📱 Responsive Design
- **Desktop (1200px+)** — Expanded layouts with 3-column detail grids
- **Tablet (768px+)** — Adjusted card sizes, 2-3 column forecasts
- **Mobile (480px-)** — Full-width layouts, touch-friendly targets, stacked cards, scrollable sections
- **Small Phones (360px)** — Compact everything, no horizontal overflow

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic document structure, ARIA landmarks |
| **CSS3** | Custom properties, Grid, Flexbox, animations, responsive design |
| **Vanilla JavaScript (ES6+)** | Modular architecture, async/await, DOM manipulation |
| **OpenWeatherMap API** | Current weather, 5-day forecast, air pollution data |
| **Browser Local Storage** | Persistent preferences (theme, unit, search history) |
| **Geolocation API** | One-click current location weather |
| **ResizeObserver / AbortController** | Dynamic scrollbar sync, event cleanup |

---

## 📁 Project Structure

```
weathernow/
│
├── index.html              # Entry point with semantic HTML
├── vercel.json             # Vercel deployment configuration
├── version.txt             # Application version
│
├── css/
│   └── style.css           # Complete stylesheet (themes, responsive, animations)
│
├── js/
│   ├── api.js              # OpenWeatherMap API requests & data processing
│   ├── storage.js          # Local Storage CRUD operations
│   ├── ui.js               # DOM rendering, skeletons, animations, announcements
│   └── app.js              # App initialization, event handlers, state management
│
└── README.md               # Documentation (this file)
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A free API key from [OpenWeatherMap](https://openweathermap.org/appid)

### 1. Get Your API Key
1. Go to [openweathermap.org/appid](https://openweathermap.org/appid)
2. Sign up for a free account
3. Navigate to **API Keys** and copy your key

### 2. Configure
Open `js/api.js` and replace the key in the `API_CONFIG` object:

```javascript
const API_CONFIG = {
    KEY: 'your-actual-api-key-here',  // ← Paste your key here
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    ICON_URL: 'https://openweathermap.org/img/wn',
    UNITS: 'metric',
    LANG: 'en'
};
```

### 3. Run Locally

**Option A — Direct (simple)**
Open `index.html` in your browser.

**Option B — Local server (recommended)**
```bash
# Python
python -m http.server 8000

# Node.js
npx live-server

# VS Code
# Install "Live Server" extension → right-click index.html → "Open with Live Server"
```
Then open `http://localhost:8000`.

---

## 🌐 Deployment

### Vercel (Recommended)
The project includes a pre-configured `vercel.json`. Deploy in one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/Sujoyzz7/WeatherNow)

Or via CLI:
```bash
npm i -g vercel
cd weathernow
vercel
```

### GitHub Pages
1. Push to GitHub
2. Go to **Settings → Pages**
3. Select `main` branch, `/ (root)` folder
4. Published at `https://<username>.github.io/WeatherNow/`

### Netlify
Drag and drop the project folder onto [Netlify Drop](https://app.netlify.com/drop), or connect your GitHub repository.

---

## ⌨️ Usage

| Action | How |
|---|---|
| **Search a city** | Type name → press `Enter` or click **Search** |
| **Toggle °C / °F** | Click the **°C ↔ °F** button in the weather card |
| **Toggle dark mode** | Click the 🌙/☀️ button in the header |
| **Your location** | Click the 📍 button (browser permission required) |
| **Revisit a city** | Click a city in **Recent Searches** |
| **Delete a search** | Click the **×** on a recent search item |
| **Clear all history** | Click the **Clear All** button |
| **Navigate hourly forecast** | Drag with mouse, use arrow keys, click nav arrows, or drag the custom scrollbar |
| **Focus search** | `Ctrl+/` (or `Cmd+/` on Mac) |
| **Clear search** | `Escape` when focused on search input |

---

## 🧪 Testing Checklist

- [ ] Valid city search (e.g., "Dhaka", "London", "Tokyo")
- [ ] Invalid city search → "City not found" error
- [ ] Empty search → "Please enter a city name"
- [ ] Theme toggle → persists on refresh
- [ ] Temperature unit toggle → persists on refresh
- [ ] Recent searches → clickable, deletable, clearable
- [ ] Current location → works with browser permission
- [ ] Hourly forecast drag/scroll → mouse drag, arrow keys, nav buttons, scrollbar drag
- [ ] Air quality → gauge renders with correct color
- [ ] Loading skeletons → shimmer animation appears on search
- [ ] Accessibility → Tab through all elements, screen reader announcements
- [ ] Mobile responsive → test at 360px, 480px, 768px, 1024px, 1200px+
- [ ] Print styles → `Ctrl+P` hides interactive elements

---

## 📄 API Reference

This app uses the [OpenWeatherMap API](https://openweathermap.org/api):

| Endpoint | Usage |
|---|---|
| `/data/2.5/weather?q={city}` | Current weather by city name |
| `/data/2.5/forecast?q={city}` | 5-day / 3-hour forecast |
| `/data/2.5/air_pollution?lat={lat}&lon={lon}` | Air Quality Index |

All requests use `units=metric` (Celsius). Fahrenheit conversion is handled client-side.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

---

## 📄 License

This project is open source under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for the free weather and air pollution API
- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter) for the beautiful typeface
- [Vercel](https://vercel.com/) for seamless static hosting

---

<div align="center">
  <br>
  <p>
    Built with ❤️ using vanilla JavaScript<br>
    <sub>WeatherNow v2.2.0 — A frontend portfolio project</sub>
  </p>
  <br>
</div>
