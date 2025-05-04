import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'

interface WeatherData {
  id?: number;
  city: string;
  temp: number;
  description: string;
  timestamp?: string;
}

const OPENWEATHER_API_KEY = 'd5b9892542a831a20e5cde81df11674e';

function App() {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [history, setHistory] = useState<WeatherData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editCity, setEditCity] = useState('');

  // Подключение к PostgreSQL (в реальном приложении это должно быть на бэкенде)
  const config = {
    connectionString: "postgres://golubev:6gjs6lie@rc1a-ifib83e5rn7qyi7f.mdb.yandexcloud.net:6432/weather",
    ssl: {
      rejectUnauthorized: true,
      ca: "/home/golubev/.postgresql/root.crt",
    },
  };

  // В реальном приложении эти функции должны вызывать API вашего бэкенда
  const fetchWeatherHistory = async () => {
    // Здесь должен быть запрос к вашему бэкенду
    // Пример: const response = await axios.get('/api/weather/history');
    // setHistory(response.data);

    // Заглушка для демонстрации
    const mockHistory: WeatherData[] = [
      { id: 1, city: 'Moscow', temp: 20, description: 'Cloudy', timestamp: '2023-05-01' },
      { id: 2, city: 'London', temp: 15, description: 'Rainy', timestamp: '2023-05-02' },
    ];
    setHistory(mockHistory);
  };

  const addWeatherToHistory = async (data: WeatherData) => {
    // Здесь должен быть запрос к вашему бэкенду
    // await axios.post('/api/weather', data);
    setHistory([...history, { ...data, id: history.length + 1 }]);
  };

  const updateWeatherInHistory = async (id: number, data: Partial<WeatherData>) => {
    // await axios.put(`/api/weather/${id}`, data);
    setHistory(history.map(item => item.id === id ? { ...item, ...data } : item));
    setEditingId(null);
  };

  const deleteWeatherFromHistory = async (id: number) => {
    // await axios.delete(`/api/weather/${id}`);
    setHistory(history.filter(item => item.id !== id));
  };

  const getWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );

      const weatherData: WeatherData = {
        city: response.data.name,
        temp: response.data.main.temp,
        description: response.data.weather[0].description
      };

      setCurrentWeather(weatherData);
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
    setEditingId(item.id!);
    setEditCity(item.city);
  };

  const saveEdit = () => {
    if (editingId) {
      updateWeatherInHistory(editingId, { city: editCity });
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
                </>
              ) : (
                <>
                  {item.city} - {item.temp}°C ({item.description})
                  <button onClick={() => startEditing(item)}>Edit</button>
                  <button onClick={() => deleteWeatherFromHistory(item.id!)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;