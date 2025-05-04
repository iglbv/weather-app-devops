import React, { useState } from 'react';

function CityList({ cities, currentCity, onSelectCity, onUpdateCity, onDeleteCity }) {
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    const handleUpdate = (city) => {
        if (editName.trim()) {
            onUpdateCity(city.id, city.name, editName);
            setEditingId(null);
            setEditName('');
        }
    };

    return (
        <div className="city-list">
            <h2>Saved Cities</h2>
            {cities.length === 0 ? (
                <p>No cities saved yet</p>
            ) : (
                <ul>
                    {cities.map(city => (
                        <li key={city.id} className={city.name === currentCity ? 'active' : ''}>
                            {editingId === city.id ? (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="New city name"
                                    />
                                    <button onClick={() => handleUpdate(city)}>Save</button>
                                    <button onClick={() => setEditingId(null)}>Cancel</button>
                                </div>
                            ) : (
                                <div className="city-item">
                                    <span onClick={() => onSelectCity(city)}>{city.name}</span>
                                    <div className="actions">
                                        <button onClick={() => {
                                            setEditingId(city.id);
                                            setEditName(city.name);
                                        }}>
                                            Edit
                                        </button>
                                        <button onClick={() => onDeleteCity(city.id, city.name)}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CityList;