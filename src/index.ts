import * as http from 'http';
import * as WebSocket from 'ws';
import App from './app';
import Storage from './storage';

// constants
const PORT: number = 1337;
const FILE_PATH: string = '../store.json';

// setup
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const storage = new Storage({ filePath: FILE_PATH });
const app = new App({ wss, storage });

// start server
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
