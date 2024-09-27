const API_KEY = "1f0868ad4687f50e1fb0345863ecf1b0";
const BASE_API_URL = "https://api.openweathermap.org/data/2.5/weather";

const content = {
    mainGrid: document.querySelector(".grid-item.full-width"),
    locationName: document.querySelector(".location"),
    temp: document.querySelector(".temp"),
    unit: document.querySelector(".unit"),
    desc: document.querySelector(".desc"),
    max: document.querySelector(".max"),
    min: document.querySelector(".min"),
    feelsLike: document.querySelector(".feels-like"),
    humidity: document.querySelector(".humidity"),
    windSpeed: document.querySelector(".wind-speed"),
    pressure: document.querySelector(".pressure"),
    weatherImage: document.querySelector(".weather-image"),
};

const searchForm = document.querySelector(".search-form");
searchForm.addEventListener("submit", onSearchFormSubmit);

async function onSearchFormSubmit(e) {
    e.preventDefault();

    const locationName = searchForm.search.value.trim();
    if (!locationName) {
        alert("Please enter a city, state or country name.");
        return;
    }

    const unitType = "metric"; // Always use metric for simplicity

    try {
        const data = await getWeatherByLocation(locationName, unitType);

        if (data.cod === "404") {
            alert("Location not found.");
            return;
        }

        displayWeatherData(data);
    } catch (error) {
        console.error("Error on form submit.", error);
    }

    searchForm.reset();
}

async function getWeatherByLocation(locationName, unitType) {
    const apiUrl = `${BASE_API_URL}?q=${locationName}&appid=${API_KEY}&units=${unitType}`;
    return await fetchData(apiUrl);
}

async function fetchData(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching data.", error);
        alert("Failed to fetch weather data. Please try again later.");
        throw error;
    }
}

function displayWeatherData(data) {
    const { weather, main, wind, sys, name } = data;

    content.locationName.textContent = name;
    content.temp.textContent = main.temp.toFixed(2);
    content.unit.textContent = "°C";
    content.desc.textContent = weather[0].description;
    content.max.textContent = `${main.temp_max} °C`;
    content.min.textContent = `${main.temp_min} °C`;
    content.feelsLike.textContent = `${main.feels_like} °C`;
    content.humidity.textContent = `${main.humidity}%`;
    content.windSpeed.textContent = `${wind.speed} m/s`;
    content.pressure.textContent = `${main.pressure} hPa`;
    content.weatherImage.src = `https://refinedguides.com/weather-app/img/${weather[0].icon}.png`;

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const isDayTime = currentTimestamp >= sys.sunrise && currentTimestamp <= sys.sunset;

    content.mainGrid.classList.toggle("day-time", isDayTime);
    content.mainGrid.classList.toggle("night-time", !isDayTime);
}
