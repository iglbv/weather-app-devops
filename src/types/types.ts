export interface WeatherData {
    id: number;
    city: string;
    temp: number;
    description: string;
    icon: string;
    humidity: number;
    wind: number;
}

export interface City {
    id: number;
    name: string;
    user_id: number;
}