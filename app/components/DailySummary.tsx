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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Set mounted to true only on the client side

        const fetchDailySummary = async () => {
            try {
                const response = await fetch('/api/dailySummary');
                const data = await response.json();

                if (response.ok) {
                    setSummaries(data.data);
                } else {
                    setError(data.error || 'Failed to fetch daily summary');
                }
            } catch {
                setError('An error occurred while fetching the daily summary');
            }
        };

        fetchDailySummary();
    }, []);

    if (!isMounted) return null; // Avoid rendering on the server

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

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
                {summaries.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {summaries.map((summary) => (
                            <div key={summary.city} className="bg-white bg-opacity-10 backdrop-blur-sm p-4 text-white rounded-lg shadow-md transition-transform transform hover:scale-105">
                                <h3 className="text-xl text-white font-semibold">{summary.city}</h3>
                                <p className="text-white">Avg Temperature: {summary.averageTemperature.toFixed(2)}°C</p>
                                <p className="text-white">Max Temperature: {summary.maxTemperature.toFixed(2)}°C</p>
                                <p className="text-white">Min Temperature: {summary.minTemperature.toFixed(2)}°C</p>
                                <p className="text-white">Dominant Condition: {summary.dominantCondition}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center">Loading...</p>
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
