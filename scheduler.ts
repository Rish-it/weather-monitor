// Scheduler.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { fetchWeatherData } from '@/lib/weather';
import { checkAndTriggerAlerts } from '@/lib/alertService'; // Import alert service

const prisma = new PrismaClient();
const cities = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];

export async function GET() {
  try {
    const weatherData = await Promise.all(cities.map(city => fetchWeatherData(city)));

    await Promise.all(
      weatherData
        .filter(data => data !== null) // Keep only valid data
        .map(async (data) => {
          await prisma.weather.create({
            data: {
              city: data.city,
              main: data.main,
              temp: data.temp,
              feels_like: data.feels_like,
              dt: new Date(data.dt * 1000), // Convert UNIX timestamp to Date
            },
          });
          
          // Check for alerts after storing each weather data point
          await checkAndTriggerAlerts(data.city, data.temp);
        })
    );

    return NextResponse.json({ success: true, data: weatherData });
  } catch (error) {
    console.error("Error storing weather data:", error);
    return NextResponse.json({ error: "Failed to fetch and store weather data" }, { status: 500 });
  }
}
