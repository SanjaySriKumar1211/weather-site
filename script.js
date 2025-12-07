const API_KEY = "YOUR_API_KEY_HERE"; // 🚨 Replace
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityInput = document.getElementById("city-input");
const searchButton = document.getElementById("search-button");
const weatherCard = document.querySelector(".current-weather-card");

// --- Helper function to get the current time/date ---
function getFormattedDateTime() {
    return new Date().toLocaleDateString('en-US', {
        weekday: 'long', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: true 
    });
}

// --- Main Fetch Function ---
async function checkWeather(city) {
    try {
        const response = await fetch(CURRENT_URL + city + `&appid=${API_KEY}`);
        
        if (!response.ok) {
            document.querySelector(".error").style.display = "block";
            weatherCard.style.display = "none";
            // Hide all other sections too
            document.querySelector(".details-grid").style.display = "none";
            document.querySelector(".forecast-section").style.display = "none";
            return;
        }

        const data = await response.json();
        
        // --- 1. Update Primary Current Weather Display ---
        document.querySelector(".city-name").innerHTML = `${data.name}, ${data.sys.country}`;
        document.querySelector(".date-time").innerHTML = getFormattedDateTime();
        document.querySelector(".temp").innerHTML = `${Math.round(data.main.temp)}°`;
        document.querySelector(".description").innerHTML = data.weather[0].description.toUpperCase();
        
        // Min/Max Temperature
        document.querySelector(".temp-high").innerHTML = `H: ${Math.round(data.main.temp_max)}°`;
        document.querySelector(".temp-low").innerHTML = `L: ${Math.round(data.main.temp_min)}°`;
        
        // Update weather icon (You need logic to map 'data.weather[0].main' to your SVG/PNG files)
        // Example: data.weather[0].main will be "Clouds", "Rain", "Clear"
        const iconName = data.weather[0].main.toLowerCase();
        document.querySelector(".weather-icon").src = `icons/${iconName}.svg`; // Assuming you have SVG icons

        // --- 2. Update Detailed Metrics Grid ---
        document.getElementById("feels-like").innerHTML = `${Math.round(data.main.feels_like)}°C`;
        document.getElementById("humidity").innerHTML = `${data.main.humidity}%`;
        document.getElementById("wind-speed").innerHTML = `${data.wind.speed} km/h ${getWindDirection(data.wind.deg)}`;
        document.getElementById("pressure").innerHTML = `${data.main.pressure} hPa`;
        document.getElementById("visibility").innerHTML = `${(data.visibility / 1000).toFixed(0)} km`;
        // UV Index is not in the basic 'weather' endpoint, it requires the 'One Call API' or another specific API call.
        // For now, you can set a placeholder or make an additional call for professional details.
        document.getElementById("uv-index").innerHTML = "N/A (API Key Upgrade)";

        // --- 3. Display Everything ---
        weatherCard.style.display = "block";
        document.querySelector(".error").style.display = "none";
        document.querySelector(".details-grid").style.display = "grid";
        // Call a separate function to fetch the 5-day forecast
        fetchForecast(data.coord.lat, data.coord.lon);

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to convert wind degrees to a compass direction (UX Improvement)
function getWindDirection(deg) {
    if (deg > 337.5) return 'N';
    if (deg > 292.5) return 'NW';
    if (deg > 247.5) return 'W';
    if (deg > 202.5) return 'SW';
    if (deg > 157.5) return 'S';
    if (deg > 112.5) return 'SE';
    if (deg > 67.5) return 'E';
    if (deg > 22.5) return 'NE';
    return 'N';
}

// Event Listeners
searchButton.addEventListener("click", () => {
    checkWeather(cityInput.value.trim());
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkWeather(cityInput.value.trim());
    }
});

// --- Placeholder for the 5-Day Forecast function ---
async function fetchForecast(lat, lon) {
    // Note: OpenWeatherMap Free Tier has a 5-day / 3-hour forecast. 
    // The implementation here is a conceptual placeholder.
    document.querySelector(".forecast-section").style.display = "block";
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    // ... Fetch logic and loop to create day-forecast divs ...
}
