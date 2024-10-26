import React from 'react';

// Define the props type for the WeatherDisplay component
export type WeatherDisplayProps = {
    location: string;
    temperature: number;
    weatherCondition: string;
};

// Functional component for displaying weather information
const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ location, temperature, weatherCondition }) => {
    return (
        <div className="p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-semibold">{location}</h2>
            <p className="text-lg">Temperature: {temperature}°C</p>
            <p className="text-sm text-gray-600">Condition: {weatherCondition}</p>
        </div>
    );
};

export default WeatherDisplay;
