import * as fs from 'fs';
import * as WebSocket from 'ws';
import App from '../src/app';
import Logger from '../src/logger';
import Reminder from '../src/reminder';
import Scheduler from '../src/scheduler';
import Storage from '../src/storage';

export async function eraseStorage (filePath: string) {
    try {
        await fs.promises.unlink(filePath);
    } catch (err) {
    }
}

export function genReminder (notice: string, timeOffset: number = 1000): Reminder {
    return { time: Date.now() + timeOffset, notice };
}

export function genError (error: string): string {
    return JSON.stringify({ error });
}

export function genLogger (): Logger {
    return {
        log: () => {},
        warn: () => {}
    };
}

export function genApp (filePath: string) {
    const wss = new WebSocket.Server({ noServer: true });
    const storage = new Storage({ filePath, logger: genLogger() });
    const scheduler = new Scheduler();
    return new App({ wss, storage, scheduler });
}

export async function setStorage (filePath: string, data: string) {
    await fs.promises.writeFile(filePath, data, 'utf8')
}

export async function readStorage (filePath: string): Promise<string> {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return data;
}
