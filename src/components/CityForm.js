import React, { useState } from 'react';

function CityForm({ onAddCity, onFetchWeather }) {
    const [city, setCity] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            onAddCity(city);
            setCity('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="city-form">
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
                required
            />
            <button type="submit">Add City</button>
        </form>
    );
}

export default CityForm;