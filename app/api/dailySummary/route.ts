import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface WeatherData {
    city: string;
    main: string;
    temp: number;
    feels_like: number;
    dt: Date; // Ensure this is of type Date, which is what Prisma uses
}

interface DailySummary {
    city: string;
    averageTemperature: number;
    maxTemperature: number;
    minTemperature: number;
    dominantCondition: string;
}

// Calculate daily summary for a city based on the weather data
function calculateDailySummary(data: WeatherData[]): DailySummary | null {
    if (!data.length) return null;

    const totalTemp = data.reduce((acc, curr) => acc + curr.temp, 0);
    const avgTemp = totalTemp / data.length;
    const maxTemp = Math.max(...data.map(item => item.temp));
    const minTemp = Math.min(...data.map(item => item.temp));
    const dominantCondition = getDominantCondition(data);

    return {
        city: data[0].city,
        averageTemperature: avgTemp,
        maxTemperature: maxTemp,
        minTemperature: minTemp,
        dominantCondition,
    };
}

// Get the dominant weather condition based on frequency
function getDominantCondition(data: WeatherData[]) {
    const conditionCount: { [key: string]: number } = {};

    data.forEach(item => {
        const condition = item.main;
        conditionCount[condition] = (conditionCount[condition] || 0) + 1;
    });

    // Return the condition with the highest count
    return Object.keys(conditionCount).reduce((a, b) => conditionCount[a] > conditionCount[b] ? a : b);
}

export async function GET() {
    try {
        const today = new Date();
        // Adjust to UTC for start and end of day
        const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999));

        // Log the start and end of the day
        console.log("Start of Day (UTC):", startOfDay);
        console.log("End of Day (UTC):", endOfDay);

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
        if (!dailyData.length) {
            console.warn("No weather data found for today.");
            return NextResponse.json({ error: "No weather data found for today." }, { status: 404 });
        }

        // Group data by city
        const cityGroups: { [key: string]: WeatherData[] } = {};
        dailyData.forEach(item => {
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
