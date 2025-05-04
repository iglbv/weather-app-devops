import { useState, useEffect } from 'react';
import { fetchWeather } from '../services/weatherService';
import { WeatherData } from '../types/types';
import { FiTrash2, FiEdit } from 'react-icons/fi';

interface WeatherCardProps {
    cityName: string;
    cityId: number;
    onDelete: (id: number) => void;
    onEdit: (id: number, newName: string) => void;
}

export const WeatherCard = ({ cityName, cityId, onDelete, onEdit }: WeatherCardProps) => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newCityName, setNewCityName] = useState(cityName);

    useEffect(() => {
        const loadWeather = async () => {
            try {
                const data = await fetchWeather(cityName);
                setWeather({
                    id: cityId,
                    city: cityName,
                    ...data
                });
                setError(null);
            } catch (err) {
                setError('Failed to load weather data');
            } finally {
                setLoading(false);
            }
        };

        loadWeather();
    }, [cityName, cityId]);

    const handleSave = () => {
        onEdit(cityId, newCityName);
        setIsEditing(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="weather-card">
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={newCityName}
                        onChange={(e) => setNewCityName(e.target.value)}
                    />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <>
                    <h2>{weather?.city}</h2>
                    <div className="weather-info">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather?.icon}@2x.png`}
                            alt={weather?.description}
                        />
                        <p>Temperature: {weather?.temp}°C</p>
                        <p>Humidity: {weather?.humidity}%</p>
                        <p>Wind: {weather?.wind} m/s</p>
                        <p>{weather?.description}</p>
                    </div>
                    <div className="actions">
                        <button onClick={() => setIsEditing(true)}>
                            <FiEdit />
                        </button>
                        <button onClick={() => onDelete(cityId)}>
                            <FiTrash2 />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};