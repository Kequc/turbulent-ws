import * as WebSocket from 'ws';
import Storage from './storage';

interface AppOptions {
    wss: WebSocket.Server,
    storage: Storage
}

export default class App {
    wss: WebSocket.Server;
    storage: Storage;

    constructor({ wss, storage }: AppOptions) {
        this.wss = wss;
        this.storage = storage;

        this.wss.on('connection', (ws: WebSocket) => {
            ws.on('message', this.onMessage);
        });
    }

    onMessage (message: string) {

    }

    broadcast (message: string) {
        this.wss.clients.forEach((client) => {
            if (client.readyState !== WebSocket.OPEN) return;
            client.send(message);
        });
    }
}
