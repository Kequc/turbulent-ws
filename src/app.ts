import * as WebSocket from 'ws';
import AddReminder from './methods/add_reminder';
import Scheduler from './scheduler';
import Storage from './storage';

interface AppOptions {
    wss: WebSocket.Server;
    storage: Storage;
    scheduler: Scheduler;
}

const METHODS = {
    'add_reminder': new AddReminder()
};

function parseMessage (message: string): any {
    try {
        return JSON.parse(message);
    } catch (err) {
        return { err };
    }
}

function validateRequest ({ err, method, params }: any): string|null {
    if (err) return 'Invalid request';
    if (!method || !params) return 'Invalid request format';
    if (!METHODS.hasOwnProperty(method)) return `Invalid method: ${method}`;
    return METHODS[method].validate(params);
}

export default class App {
    wss: WebSocket.Server;
    storage: Storage;
    scheduler: Scheduler;

    constructor({ wss, storage, scheduler }: AppOptions) {
        this.wss = wss;
        this.storage = storage;
        this.scheduler = scheduler;

        this.wss.on('connection', (ws: WebSocket) => {
            ws.on('message', (message: string) => {
                this.onMessage(ws, message);
            });
        });

        this.scheduler.on('notice', (notice: string) => {
            this.broadcast(JSON.stringify({ notice }));
        });
    }

    onMessage (ws: WebSocket, message: string) {
        const request = parseMessage(message);
        const error = validateRequest(request);
        if (error) {
            ws.send(JSON.stringify({ error }));
        } else {
            METHODS[request.method].process(this, request.params);
        }
    }

    async startup () {
        const reminders = await this.storage.read();
        reminders.forEach((reminder) => {
            this.scheduler.add(reminder)
        });
    }

    broadcast (message: string) {
        this.wss.clients.forEach((client) => {
            if (client.readyState !== WebSocket.OPEN) return;
            client.send(message);
        });
    }
}
