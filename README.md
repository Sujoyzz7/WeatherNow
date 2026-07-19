# 🌤️ WeatherNow - Modern Weather Dashboard

A beautiful, responsive weather dashboard built with vanilla JavaScript. Search any city to view current weather conditions, hourly forecasts, and a 5-day weather forecast. Features dark mode, temperature unit conversion, recent search history, and current location support.

![WeatherNow Screenshot](assets/images/screenshot.png)

> **Live Demo:** [Coming Soon](#)

---

## ✨ Features

### Core Features
- **🔍 City Search** — Search any city worldwide and get instant weather data
- **🌡️ Current Weather** — Temperature, condition, humidity, wind, pressure, visibility, sunrise/sunset
- **📊 5-Day Forecast** — Daily high/low temperatures with weather icons and conditions
- **🕐 Hourly Forecast** — Scrollable 24-hour forecast
- **🌡️ Unit Toggle** — Switch between Celsius and Fahrenheit with saved preference
- **🌙 Dark Mode** — Toggle between light and dark themes with saved preference
- **📍 Current Location** — Get weather for your current location using Geolocation API
- **🕓 Recent Searches** — Last 5 searched cities stored in Local Storage, clickable to re-search

### Extra Features
- **Weather Animations** — Dynamic CSS animations for different weather conditions (sun, rain, snow, clouds, thunder)
- **Fully Responsive** — Works perfectly on desktop, tablet, and mobile devices
- **Keyboard Shortcuts** — `Ctrl+/` to focus search, `Escape` to clear
- **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation, screen reader support
- **Performance Optimized** — Lazy-loaded images, smooth animations, minimal dependencies

---

## 🛠️ Technologies

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure |
| **CSS3** | Styling, animations, responsive design |
| **Vanilla JavaScript (ES6+)** | Application logic, API integration, DOM manipulation |
| **OpenWeatherMap API** | Weather data source |
| **Local Storage** | Persistent preferences and search history |
| **Geolocation API** | Current location detection |

---

## 📦 Project Structure

```
weather-app/
│
├── index.html              # Main HTML document
├── css/
│   └── style.css           # Complete stylesheet with themes & animations
├── js/
│   ├── api.js              # API requests & data processing
│   ├── storage.js          # Local Storage operations
│   ├── ui.js               # DOM rendering & UI updates
│   └── app.js              # Application initialization & event handling
├── assets/
│   └── icons/              # Custom icons (optional)
└── README.md               # Documentation
```

---

## 🚀 Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A free API key from [OpenWeatherMap](https://openweathermap.org/appid)

### Step 1: Get an API Key
1. Go to [https://openweathermap.org/appid](https://openweathermap.org/appid)
2. Sign up for a free account
3. Navigate to the API Keys section
4. Copy your API key (it looks like: `a1b2c3d4e5f6...`)

### Step 2: Configure the API Key
1. Open `js/api.js` in your code editor
2. Find the `API_CONFIG` object at the top of the file
3. Replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
const API_CONFIG = {
    KEY: 'your-actual-api-key-here',  // ← Replace this
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    ICON_URL: 'https://openweathermap.org/img/wn',
    UNITS: 'metric',
    LANG: 'en'
};
```

### Step 3: Run the Application

#### Option A: Open directly (simple)
Open `index.html` in your browser by double-clicking the file.

#### Option B: Local server (recommended)
Use any local development server:

**Python:**
```bash
python -m http.server 8000
```

**Node.js (with live-server):**
```bash
npx live-server
```

**VS Code:**
Install the **Live Server** extension, right-click `index.html`, and select "Open with Live Server".

Then open `http://localhost:8000` (or your server's URL) in your browser.

---

## ⚙️ Usage

1. **Search for a city** — Type a city name in the search bar and press Enter or click "Search"
2. **View current weather** — See temperature, condition, humidity, wind, pressure, and more
3. **Check the forecast** — Scroll through the hourly and 5-day forecasts
4. **Toggle units** — Click the "°C ↔ °F" button to switch between Celsius and Fahrenheit
5. **Toggle theme** — Click the 🌙/☀️ button to switch between dark and light mode
6. **Use your location** — Click the 📍 button to get weather for your current location
7. **Revisit cities** — Click any city in the "Recent Searches" section

---

## 🌐 API Reference

This application uses the [OpenWeatherMap API](https://openweathermap.org/api):

| Endpoint | Description |
|---|---|
| `api.openweathermap.org/data/2.5/weather` | Current weather data |
| `api.openweathermap.org/data/2.5/forecast` | 5-day / 3-hour forecast data |

Both endpoints are called with `units=metric` to receive Celsius values, which are then converted to Fahrenheit when needed.

---

## 🧪 Testing

Test the following scenarios:

- ✅ Valid city search (e.g., "Dhaka", "London", "Tokyo")
- ✅ Invalid city search (should show "City not found")
- ✅ Empty search (should show "Please enter a city name")
- ✅ Theme switching (light ↔ dark, persists on reload)
- ✅ Temperature conversion (°C ↔ °F, persists on reload)
- ✅ Local Storage persistence (search history survives page refresh)
- ✅ Current location (requires browser permission)
- ✅ Mobile responsiveness (resize the browser or use DevTools)
- ✅ Keyboard navigation (Tab through all interactive elements)

---

## 🌍 Deployment

### GitHub Pages
1. Push the project to a GitHub repository
2. Go to Settings → Pages
3. Select the `main` branch and `/ (root)` folder
4. Your site will be published at `https://<username>.github.io/<repository>/`

### Netlify
1. Drag and drop the project folder onto [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repository for continuous deployment

### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root
3. Follow the prompts to deploy

---

## 🔒 Privacy

- **No tracking**: This app does not collect or transmit any personal data
- **Local Storage only**: Preferences and search history are stored locally in your browser
- **API calls**: Weather data is fetched directly from OpenWeatherMap
- **Geolocation**: Location access is optional and only used when you click the location button

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) for the free weather API
- [Google Fonts - Inter](https://fonts.google.com/specimen/Inter) for the beautiful typeface
- Icons provided by [OpenWeatherMap](https://openweathermap.org/weather-conditions)

---

<div align="center">
    Made with ❤️ by a frontend developer
    <br>
    <sub>WeatherNow — A professional portfolio project</sub>
</div>
