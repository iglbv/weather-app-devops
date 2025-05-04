import React from 'react';

function WeatherDisplay({ weather }) {
    if (!weather) return null;

    const getTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString();
    };

    return (
        <div className="weather-display">
            <h2>
                {weather.name}, {weather.sys.country}
                <img
                    src={`https://flagcdn.com/w20/${weather.sys.country.toLowerCase()}.png`}
                    alt={`Flag of ${weather.sys.country}`}
                />
            </h2>
            <div className="weather-main">
                <div className="weather-temp">
                    <img
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        alt={weather.weather[0].description}
                    />
                    <span>{Math.round(weather.main.temp)}°C</span>
                </div>
                <div className="weather-details">
                    <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
                    <p>{weather.weather[0].description}</p>
                    <p>Humidity: {weather.main.humidity}%</p>
                    <p>Wind: {weather.wind.speed} m/s</p>
                    <p>Pressure: {weather.main.pressure} hPa</p>
                    <p>Sunrise: {getTime(weather.sys.sunrise)}</p>
                    <p>Sunset: {getTime(weather.sys.sunset)}</p>
                </div>
            </div>
        </div>
    );
}

export default WeatherDisplay;