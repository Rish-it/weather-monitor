"use client";
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
    Filler, // Import Filler for the fill option
} from 'chart.js';

// Register necessary scales and components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler);

interface WeatherChartProps {
    data: {
        labels: string[];
        temperatures: number[];
        maxTemperatures: number[];
        minTemperatures: number[];
    };
}

const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Average Temperature (°C)',
                data: data.temperatures,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Max Temperature (°C)',
                data: data.maxTemperatures,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
            {
                label: 'Min Temperature (°C)',
                data: data.minTemperatures,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Daily Weather Summary',
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default WeatherChart;
