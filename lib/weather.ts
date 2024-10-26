import axios from 'axios';

export async function fetchWeatherData(city: string) {
  const apiKey = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    const weatherData = response.data;

    if (!weatherData || !weatherData.main) {
      console.error(`No weather data found for ${city}`);
      return null;
    }

    const tempCelsius = weatherData.main.temp - 273.15;
    const feelsLikeCelsius = weatherData.main.feels_like - 273.15;

    return {
      city,
      main: weatherData.weather[0].main,
      temp: tempCelsius,
      feels_like: feelsLikeCelsius,
      dt: weatherData.dt,
    };
  } catch (error) {
    console.error(`Error fetching data for ${city}:`, error);
    return null;
  }
}
