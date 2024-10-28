import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface WeatherData {
    city: string;
    main: string;
    temp: number;
    feels_like: number;
    dt: Date;
}

interface DailySummary {
    city: string;
    averageTemperature: number;
    maxTemperature: number;
    minTemperature: number;
    dominantCondition: string;
}

function calculateDailySummary(data: WeatherData[]): DailySummary | null {
    if (!data.length) return null;

    const avgTemp = data.reduce((acc: number, curr: WeatherData) => acc + curr.temp, 0) / data.length;
    const maxTemp = Math.max(...data.map((item: WeatherData) => item.temp));
    const minTemp = Math.min(...data.map((item: WeatherData) => item.temp));
    const dominantCondition = getDominantCondition(data);

    return {
        city: data[0].city,  // Assuming all entries in data have the same city
        averageTemperature: avgTemp,
        maxTemperature: maxTemp,
        minTemperature: minTemp,
        dominantCondition,
    };
}

function getDominantCondition(data: WeatherData[]) {
    const conditionCount: { [key: string]: number } = {};

    data.forEach((item: WeatherData) => {
        const condition = item.main;
        conditionCount[condition] = (conditionCount[condition] || 0) + 1;
    });
    
    // Return the condition with the highest count
    return Object.keys(conditionCount).reduce((a, b) => conditionCount[a] > conditionCount[b] ? a : b);
}

export async function GET() {
    try {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        // Fetch weather data for the day
        const dailyData: WeatherData[] = await prisma.weather.findMany({
            where: {
                dt: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
        });

        // Log the fetched daily data
        console.log("Fetched Daily Data:", dailyData);

        // Check if any data was fetched
        if (dailyData.length === 0) {
            console.warn("No weather data found for today.");
            return NextResponse.json({ error: "No weather data found for today." }, { status: 404 });
        }

        // Group data by city
        const cityGroups: { [key: string]: WeatherData[] } = {};
        dailyData.forEach((item) => {
            if (!cityGroups[item.city]) {
                cityGroups[item.city] = [];
            }
            cityGroups[item.city].push(item);
        });

        // Log grouped data
        console.log("City Groups:", cityGroups);

        // Calculate aggregates for each city
        const summaries: DailySummary[] = [];
        for (const city in cityGroups) {
            const summary = calculateDailySummary(cityGroups[city]);
            if (summary) {
                summaries.push(summary);
            }
        }

        // Log the summaries
        console.log("Daily Summaries:", summaries);

        // Return the summaries
        return NextResponse.json({ success: true, data: summaries });
    } catch (error) {
        console.error("Error generating daily summary:", error);
        return NextResponse.json({ error: "Failed to generate daily summary" }, { status: 500 });
    }
}
