async function getWeather() {
    let city = document.getElementById("city").value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    // Step 1: Get latitude & longitude of the city
    let geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    let geoData = await geoRes.json();

    if (!geoData.results) {
        alert("City not found!");
        return;
    }

    let lat = geoData.results[0].latitude;
    let lon = geoData.results[0].longitude;

    // Step 2: Get real weather using latitude & longitude
    let weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    );

    let weatherData = await weatherRes.json();
    let weather = weatherData.current_weather;

    // Displaying results
    document.getElementById("temp").innerHTML = `🌡️ ${weather.temperature}°C`;
    document.getElementById("details").innerHTML =
        `💨 Wind: ${weather.windspeed} km/h<br>⌚ Time: ${weather.time}`;
}
