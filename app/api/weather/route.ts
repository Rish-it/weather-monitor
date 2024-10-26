import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { fetchWeatherData } from '@/lib/weather';

const prisma = new PrismaClient();
const cities = ["Delhi", "Mumbai", "Chennai", "Bangalore", "Kolkata", "Hyderabad"];

export async function GET() {
  try {
    // Fetch weather data for all cities
    const weatherData = await Promise.all(cities.map(city => fetchWeatherData(city)));

    // Store each weather data point in the database if data is not null
    await Promise.all(
      weatherData.map(async (data) => {
        if (data) {
          const existingEntry = await prisma.weather.findFirst({
            where: {
              city: data.city,
              dt: new Date(data.dt * 1000), // Ensure we're matching the same date
            },
          });

          if (!existingEntry) {
            await prisma.weather.create({
              data: {
                city: data.city,
                main: data.main,
                temp: data.temp,
                feels_like: data.feels_like,
                dt: new Date(data.dt * 1000), // Convert UNIX timestamp to JavaScript Date
              },
            });
          }
        }
      })
    );

    return NextResponse.json({ success: true, data: weatherData });
  } catch (error) {
    console.error("Error storing weather data:", error);
    return NextResponse.json({ error: "Failed to fetch and store weather data" }, { status: 500 });
  }
}
