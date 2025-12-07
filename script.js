async function getWeather() {
    let city = document.getElementById("city").value;

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    // Step 1: Convert CITY → LAT & LON using Open-Meteo Geo API
    let geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    let geoData = await geoRes.json();

    if (!geoData.results) {
        document.getElementById("temp").innerHTML = "City not found";
        document.getElementById("details").innerHTML = "";
        return;
    }

    let lat = geoData.results[0].latitude;
    let lon = geoData.results[0].longitude;

    // Step 2: Get weather using LAT & LON
    let weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );
    let weatherData = await weatherRes.json();

    let temp = weatherData.current_weather.temperature;
    let wind = weatherData.current_weather.windspeed;
    let code = weatherData.current_weather.weathercode;

    const conditions = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Rime Fog",
        51: "Light Drizzle",
        61: "Light Rain",
        80: "Rain Showers",
        95: "Thunderstorm"
    };

    document.getElementById("temp").innerHTML = `${temp}°C`;
    document.getElementById("details").innerHTML =
        `${conditions[code] || "Weather Data"}<br>Wind: ${wind} km/h`;
}
