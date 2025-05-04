import { useState } from 'react';

interface CityFormProps {
    onSubmit: (cityName: string) => void;
}

export const CityForm = ({ onSubmit }: CityFormProps) => {
    const [cityName, setCityName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cityName.trim()) {
            onSubmit(cityName);
            setCityName('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="Enter city name"
            />
            <button type="submit">Add City</button>
        </form>
    );
};