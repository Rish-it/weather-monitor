import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const alertClients: Set<WebSocket> = new Set();

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    alertClients.add(ws);

    ws.on('close', () => {
        alertClients.delete(ws);
        console.log('Client disconnected');
    });
});

// Updated function to accept userId as a number
export const sendAlert = (userId: number, message: string) => {
    alertClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            // Send the alert message along with the userId
            client.send(JSON.stringify({ userId, message }));
        }
    });
};

console.log('WebSocket server is running on ws://localhost:8080');
