import * as http from 'http';
import * as WebSocket from 'ws';

// constants
const PORT: number = 1337;

// setup
const server = http.createServer();
const wss = new WebSocket.Server({ server });

// main
function broadcast (message: string) {
    wss.clients.forEach((client) => {
        if (client.readyState !== WebSocket.OPEN) return;
        client.send(message);
    });
}

// init
wss.on('connection', (ws: WebSocket) => {
    ws.on('message', (message: string) => {
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    ws.send('Hi there, I am a WebSocket server');
});

// start server
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
