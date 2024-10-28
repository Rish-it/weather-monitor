"use client";
import React, { useEffect, useState } from 'react';
import WeatherChart from './weatherChart';

interface DailySummaryData {
    city: string;
    averageTemperature: number;
    maxTemperature: number;
    minTemperature: number;
    dominantCondition: string;
}

const DailySummary: React.FC = () => {
    const [summaries, setSummaries] = useState<DailySummaryData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDailySummary = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/dailySummary');
                const data = await response.json();

                if (response.ok) {
                    setSummaries(data.data);
                } else {
                    setError(data.error || 'Failed to fetch daily summary');
                }
            } catch (err) {
                console.error("Error fetching daily summary:", err);
                setError('An error occurred while fetching the daily summary');
            } finally {
                setLoading(false);
            }
        };

        fetchDailySummary();
    }, []);

    const chartData = {
        labels: summaries.map((summary) => summary.city),
        temperatures: summaries.map((summary) => summary.averageTemperature),
        maxTemperatures: summaries.map((summary) => summary.maxTemperature),
        minTemperatures: summaries.map((summary) => summary.minTemperature),
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6">Daily Summary</h2>
            <div className="bg-black bg-opacity-10 backdrop-blur-md p-6 rounded-lg shadow-lg border border-opacity-10">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="h-40 bg-gray-200 animate-pulse rounded-lg"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500">
                        <p>{error}</p>
                        <p>Please check back later for today&#39;s weather summary!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {summaries.map((summary) => (
                            <div key={summary.city} className="bg-white bg-opacity-10 backdrop-blur-sm p-4 text-white rounded-lg shadow-md transition-transform transform hover:scale-105">
                                <h3 className="text-xl text-white font-semibold">{summary.city}</h3>
                                <p>Avg Temperature: {summary.averageTemperature.toFixed(2)}°C</p>
                                <p>Max Temperature: {summary.maxTemperature.toFixed(2)}°C</p>
                                <p>Min Temperature: {summary.minTemperature.toFixed(2)}°C</p>
                                <p>Dominant Condition: {summary.dominantCondition}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {summaries.length > 0 && (
                <div className="mt-6">
                    <WeatherChart data={chartData} />
                </div>
            )}
        </div>
    );
};

export default DailySummary;
