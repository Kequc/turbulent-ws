import * as http from 'http';
import * as WebSocket from 'ws';
import App from './app';
import Storage from './storage';
import Scheduler from './scheduler';
import Logger from './logger';

// constants
const PORT: number = 1337;
const FILE_PATH: string = '../store.json';
const logger: Logger = console;

// setup
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const storage = new Storage({ filePath: FILE_PATH, logger });
const scheduler = new Scheduler();
const app = new App({ wss, storage, scheduler });

// start server
server.listen(PORT, async function () {
    await app.startup();
    logger.log(`Server started on port ${PORT}`);
});
