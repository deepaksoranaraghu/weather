const apiKey = '193d8d944e05ec31f4bca5dd1baaac80'; // Replace with your OpenWeatherMap API key
const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weather-condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const weatherInfo = document.querySelector('.weather-info');
const background = document.querySelector('.background');
const loadingSpinner = document.querySelector('.loading-spinner');
const autocompleteSuggestions = document.getElementById('autocomplete-suggestions');
const weatherIcon = document.getElementById('weather-icon');

// Autocomplete function
cityInput.addEventListener('input', async () => {
    const query = cityInput.value;
    if (query.length > 2) {
        const suggestions = await fetchAutocompleteSuggestions(query);
        displayAutocompleteSuggestions(suggestions);
    } else {
        autocompleteSuggestions.style.display = 'none';
    }
});

async function fetchAutocompleteSuggestions(query) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error);
        return [];
    }
}

function displayAutocompleteSuggestions(suggestions) {
    autocompleteSuggestions.innerHTML = '';
    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.textContent = `${suggestion.name}, ${suggestion.country}`;
        div.addEventListener('click', () => {
            cityInput.value = `${suggestion.name}, ${suggestion.country}`;
            autocompleteSuggestions.style.display = 'none';
            fetchWeather(suggestion.name);
        });
        autocompleteSuggestions.appendChild(div);
    });
    autocompleteSuggestions.style.display = 'block';
}

// Fetch and display weather
searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
    }
});

async function fetchWeather(city) {
    try {
        loadingSpinner.style.display = 'block';
        weatherInfo.style.display = 'none';
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            alert('City not found. Please try again.');
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    } finally {
        loadingSpinner.style.display = 'none';
    }
}

function displayWeather(data) {
    // Display weather data
    cityName.textContent = data.name;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    weatherCondition.textContent = `Condition: ${data.weather[0].description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
    pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
    visibility.textContent = `Visibility: ${data.visibility / 1000} km`;
    sunrise.textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
    sunset.textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
    weatherIcon.innerHTML = `<i class="fas fa-${getWeatherIcon(data.weather[0].main)}"></i>`;
    weatherInfo.style.display = 'block';

    // Set background based on weather condition
    const weather = data.weather[0].main.toLowerCase();
    background.className = 'background';
    if (weather.includes('rain')) {
        background.classList.add('rainy');
    } else if (weather.includes('clear')) {
        background.classList.add('sunny');
    } else if (weather.includes('cloud')) {
        background.classList.add('cloudy');
    } else if (weather.includes('snow')) {
        background.classList.add('snowy');
    } else {
        background.classList.add('default');
    }
}

// Get weather icon based on condition
function getWeatherIcon(condition) {
    switch (condition.toLowerCase()) {
        case 'clear':
            return 'sun';
        case 'rain':
            return 'cloud-rain';
        case 'clouds':
            return 'cloud';
        case 'snow':
            return 'snowflake';
        default:
            return 'cloud';
    }
}