"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FocusCards } from './components/ui/focus-card';
import DailySummaryButton from './components/DailySummary';

// Mapping of city names to their respective image URLs
const cityImages: { [key: string]: string } = {
    Delhi: '/delhi.jpg',
    Mumbai: '/mumbai.jpg',
    Chennai: '/chennai.jpg',
    Bangalore: '/bangalore.jpg', // Make sure this image exists in your public folder
    Kolkata: '/kolkata.jpg',
    Hyderabad: '/hyderabad.jpg',
};

const Home: React.FC = () => {
    const [weatherData, setWeatherData] = useState<any[]>([]);
    const apiKey = 'a3c19ed6b404caad423f7a5ac8a418f3'; // Your OpenWeatherMap API key
    const cities = Object.keys(cityImages); // Use keys from cityImages to ensure we get all cities

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const results = await Promise.all(
                    cities.map(async (city) => {
                        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
                        console.log(`API response for ${city}:`, response.data); // Log the API response for each city
                        return response.data;
                    })
                );
                setWeatherData(results);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        fetchWeatherData();
    }, [apiKey]);

    // Construct cards for FocusCards with appropriate images
    const cards = weatherData.map(data => {
        const cityName = data.name; // Get the city name from the API response
        console.log(`City name received from API: ${cityName}`); // Log the city name
        
        const imageSrc = cityImages[cityName] || cityImages['Bangalore'] || '/default.jpg'; // Use Bangalore image if the API returns Bangalore
        console.log(`Image source for ${cityName}: ${imageSrc}`); // Log the image source

        return {
            title: `${cityName}: ${data.main.temp}°C`,
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
