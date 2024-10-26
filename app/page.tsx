"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FocusCards } from './components/ui/focus-card';
import DailySummaryButton from './components/DailySummary';


interface WeatherData {
    name: string; // City name
    main: {
        temp: number; 
        humidity: number; // Humidity
    };
    wind: {
        speed: number; // Wind speed
    };
}

// Mapping of city names to their respective image URLs
const cityImages: { [key: string]: string } = {
    Delhi: '/delhi.jpg',
    Mumbai: '/mumbai.jpg',
    Chennai: '/chennai.jpg',
    Bangalore: '/bangalore.jpg',
    Kolkata: '/kolkata.jpg',
    Hyderabad: '/hyderabad.jpg',
};

const Home: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
    const apiKey = 'a3c19ed6b404caad423f7a5ac8a418f3'; // Your OpenWeatherMap API key
    const cities = Object.keys(cityImages); // Use keys from cityImages to ensure we get all cities

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const results = await Promise.all(
                    cities.map(async (city) => {
                        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                        console.log(`API response for ${city}:`, response.data);
                        return response.data;
                    })
                );
                setWeatherData(results);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchWeatherData();
    }, [cities, apiKey]);

    // Construct cards for FocusCards with appropriate images
    const cards = weatherData.map(data => {
        const cityName = data.name;
        const imageSrc = cityImages[cityName] || cityImages['Bangalore'] || '/default.jpg';

        return {
            title: `${cityName}: ${data.main.temp}°C`,
            humidity: `Humidity: ${data.main.humidity}%`,
            windSpeed: `Wind Speed: ${data.wind.speed} m/s`,
            src: imageSrc,
        };
    });

    return (
        <div>
            <h1 className="text-3xl pb-5 font-bold text-center my-4"> ☀️ Daily Cards ☁️</h1>
            <FocusCards cards={cards} />
            <DailySummaryButton />
        </div>
    );
};

export default Home;
