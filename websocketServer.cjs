"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWebSocketAlert = void 0;
// websocketServer.ts
var ws_1 = require("ws");
var wss = new ws_1.WebSocketServer({ port: 8080 });
var alertClients = new Set();
wss.on('connection', function (ws) {
    console.log('Client connected');
    alertClients.add(ws);
    ws.on('close', function () {
        alertClients.delete(ws);
        console.log('Client disconnected');
    });
});
// Export the WebSocket server instance
var sendWebSocketAlert = function (userId, message) {
    alertClients.forEach(function (client) {
        if (client instanceof ws_1.WebSocket && client.readyState === ws_1.WebSocket.OPEN) {
            client.send(JSON.stringify({ userId: userId, message: message }));
        }
    });
};
exports.sendWebSocketAlert = sendWebSocketAlert;
console.log('WebSocket server is running on ws://localhost:8080');
