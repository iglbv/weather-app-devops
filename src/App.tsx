import { useState } from 'react';
import { useDatabase } from './hooks/useDatabase';
import { WeatherCard } from './components/WeatherCard';
import { CityForm } from './components/CityForm';
import './App.css';

function App() {
  const [userId] = useState(1);
  const { cities, loading, createCity, editCity, removeCity } = useDatabase(userId);

  const handleAddCity = async (cityName: string) => {
    try {
      await createCity(cityName);
    } catch (error) {
      console.error('Error adding city:', error);
    }
  };

  const handleEditCity = async (id: number, newName: string) => {
    try {
      await editCity(id, newName);
    } catch (error) {
      console.error('Error editing city:', error);
    }
  };

  const handleDeleteCity = async (id: number) => {
    try {
      await removeCity(id);
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };

  if (loading && cities.length === 0) {
    return <div>Loading cities...</div>;
  }

  return (
    <div className="app">
      <h1>Weather App</h1>
      <CityForm onSubmit={handleAddCity} />
      <div className="weather-grid">
        {cities.map((city) => (
          <WeatherCard
            key={city.id}
            cityName={city.name}
            cityId={city.id}
            onDelete={handleDeleteCity}
            onEdit={handleEditCity}
          />
        ))}
      </div>
    </div>
  );
}

export default App;