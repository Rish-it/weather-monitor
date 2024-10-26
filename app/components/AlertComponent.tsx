"use client";
import { useEffect, useState } from 'react';

const AlertComponent = () => {
    const [alerts, setAlerts] = useState<string[]>([]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        socket.onmessage = (event) => {
            setAlerts((prevAlerts) => [...prevAlerts, event.data]);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket Client Disconnected');
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h2>Alerts</h2>
            <ul>
                {alerts.map((alert, index) => (
                    <li key={index}>{alert}</li>
                ))}
            </ul>
        </div>
    );
};

export default AlertComponent;
