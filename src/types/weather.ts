export interface WeatherData {
    id: number;
    city: string;
    temp: number;
    description: string;
    timestamp: string;
}

// Добавим новый тип для текущей погоды (без id и timestamp)
export interface CurrentWeather {
    city: string;
    temp: number;
    description: string;
}