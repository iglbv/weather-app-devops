import { useState, useEffect } from 'react';
import { City } from '../types/types';
import { getCities, addCity, updateCity, deleteCity } from '../services/dbService';

export const useDatabase = (userId: number) => {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCities();
    }, [userId]);

    const fetchCities = async () => {
        setLoading(true);
        try {
            const data = await getCities(userId);
            setCities(data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setLoading(false);
        }
    };

    const createCity = async (name: string) => {
        try {
            const newCity = await addCity(name, userId);
            setCities([...cities, newCity]);
        } catch (error) {
            console.error('Error adding city:', error);
            throw error;
        }
    };

    const editCity = async (id: number, newName: string) => {
        try {
            const updatedCity = await updateCity(id, newName);
            setCities(cities.map(city => city.id === id ? updatedCity : city));
        } catch (error) {
            console.error('Error updating city:', error);
            throw error;
        }
    };

    const removeCity = async (id: number) => {
        try {
            await deleteCity(id);
            setCities(cities.filter(city => city.id !== id));
        } catch (error) {
            console.error('Error deleting city:', error);
            throw error;
        }
    };

    return { cities, loading, createCity, editCity, removeCity };
};