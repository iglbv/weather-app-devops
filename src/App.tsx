import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { WeatherData, CurrentWeather } from './types/weather';

function App() {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [history, setHistory] = useState<WeatherData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCity, setEditCity] = useState('');


  const fetchWeatherHistory = async () => {
    try {
      const response = await axios.get('/api/weather/history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const addWeatherToHistory = async (data: CurrentWeather) => {
    try {
      const response = await axios.post('/api/weather', data);
      setHistory([response.data, ...history]);
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const updateWeatherInHistory = async (id: number, city: string) => {
    try {
      const response = await axios.put(`/api/weather/${id}`, { city });
      setHistory(history.map(item =>
        item.id === id ? { ...item, city: response.data.city } : item
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating history:', error);
    }
  };

  const deleteWeatherFromHistory = async (id: number) => {
    try {
      await axios.delete(`/api/weather/${id}`);
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting from history:', error);
    }
  };

  const getWeather = async () => {
    if (!city.trim()) return;

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
      );

      const weatherData: CurrentWeather = {
        city: response.data.name,
        temp: response.data.main.temp,
        description: response.data.weather[0].description
      };

      setCurrentWeather(weatherData);

      // При добавлении в историю преобразуем в нужный тип
      await addWeatherToHistory(weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      alert('City not found');
    }
  };

  useEffect(() => {
    fetchWeatherHistory();
  }, []);

  const startEditing = (item: WeatherData) => {
    setEditingId(item.id);
    setEditCity(item.city);
  };

  const saveEdit = () => {
    if (editingId && editCity.trim()) {
      updateWeatherInHistory(editingId, editCity);
    }
  };

  return (
    <div className="app">
      <h1>Weather App</h1>

      <div className="search">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          onKeyDown={(e) => e.key === 'Enter' && getWeather()}
        />
        <button onClick={getWeather}>Get Weather</button>
      </div>

      {currentWeather && (
        <div className="current-weather">
          <h2>Current Weather in {currentWeather.city}</h2>
          <p>Temperature: {currentWeather.temp}°C</p>
          <p>Description: {currentWeather.description}</p>
        </div>
      )}

      <div className="history">
        <h2>Search History</h2>
        {history.length === 0 ? (
          <p>No history yet</p>
        ) : (
          <ul>
            {history.map(item => (
              <li key={item.id}>
                {editingId === item.id ? (
                  <>
                    <input
                      type="text"
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                    />
                    <button onClick={saveEdit}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span>
                      {item.city} - {item.temp}°C ({item.description}) -
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                    <div>
                      <button onClick={() => startEditing(item)}>Edit</button>
                      <button onClick={() => deleteWeatherFromHistory(item.id)}>Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;