// websocketServer.ts
import { WebSocketServer, WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const alertClients: Set<WebSocket> = new Set();

wss.on('connection', (ws) => {
    console.log('Client connected');
    alertClients.add(ws);

    ws.on('close', () => {
        alertClients.delete(ws);
        console.log('Client disconnected');
    });
});

// Export the WebSocket server instance
export const sendWebSocketAlert = (userId: string, message: string) => {
    alertClients.forEach((client) => {
        if (client instanceof WebSocket && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ userId, message }));
        }
    });
};

console.log('WebSocket server is running on ws://localhost:8080');
