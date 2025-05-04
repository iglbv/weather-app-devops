import axios from 'axios';

const OPENWEATHER_API_KEY = 'd5b9892542a831a20e5cde81df11674e';

export const fetchWeather = async (city: string): Promise<any> => {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        return {
            city: response.data.name,
            temp: response.data.main.temp,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            humidity: response.data.main.humidity,
            wind: response.data.wind.speed
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        throw error;
    }
};