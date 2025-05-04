import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherDisplay from './components/WeatherDisplay';
import CityList from './components/CityList';
import CityForm from './components/CityForm';
import './styles.css';

const OPENWEATHER_API_KEY = 'd5b9892542a831a20e5cde81df11674e';

function App() {
  const [weather, setWeather] = useState(null);
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await axios.get('/api/cities');
      setCities(response.data);
    } catch (err) {
      setError('Failed to fetch cities');
      console.error(err);
    }
  };

  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=ru`
      );
      setWeather(response.data);
      setCurrentCity(city);
    } catch (err) {
      setError('City not found');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const addCity = async (city) => {
    try {
      const response = await axios.post('/api/cities', { name: city });
      setCities([...cities, response.data]);
      fetchWeather(city);
    } catch (err) {
      if (err.response?.data?.error === 'City already exists') {
        setError('This city is already in your list');
        fetchWeather(city);
      } else {
        setError('Failed to add city');
      }
    }
  };

  const updateCity = async (id, oldName, newName) => {
    try {
      await axios.put(`/api/cities/${id}`, { name: newName });
      const updatedCities = cities.map(city =>
        city.id === id ? { ...city, name: newName } : city
      );
      setCities(updatedCities);
      if (currentCity === oldName) {
        fetchWeather(newName);
      }
    } catch (err) {
      setError('Failed to update city');
    }
  };

  const deleteCity = async (id, cityName) => {
    try {
      await axios.delete(`/api/cities/${id}`);
      const updatedCities = cities.filter(city => city.id !== id);
      setCities(updatedCities);
      if (currentCity === cityName) {
        setWeather(null);
        setCurrentCity('');
      }
    } catch (err) {
      setError('Failed to delete city');
    }
  };

  return (
    <div className="app">
      <h1>Weather App</h1>

      <CityForm
        onAddCity={addCity}
        onFetchWeather={fetchWeather}
      />

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <WeatherDisplay weather={weather} />

      <CityList
        cities={cities}
        currentCity={currentCity}
        onSelectCity={(city) => fetchWeather(city.name)}
        onUpdateCity={updateCity}
        onDeleteCity={deleteCity}
      />
    </div>
  );
}

export default App;