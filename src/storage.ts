import * as fs from 'fs';
import Reminder from './reminder';
import Logger from './logger';

interface StorageOptions {
    filePath: string;
    logger: Logger;
}

export default class Storage {
    filePath: string;
    logger: Logger;

    constructor ({ filePath, logger }: StorageOptions) {
        this.filePath = filePath;
        this.logger = logger;
    }

    async read (): Promise<Array<Reminder>> {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf8');
            const reminders = JSON.parse(data);
            if (!Array.isArray(reminders)) throw new Error('Storage file must contain an array');
            const now = Date.now();
            return reminders.filter(reminder => reminder.time > now);
        } catch (err) {
            this.logger.warn(err.message);
            return [];
        }
    }

    async save (reminders: Array<Reminder>): Promise<void> {
        try {
            const now = Date.now();
            const data = JSON.stringify(reminders.filter(reminder => reminder.time > now));
            await fs.promises.writeFile(this.filePath, data, 'utf8')
        } catch (err) {
            this.logger.warn(err.message);
        }
    }

    async add (reminder: Reminder): Promise<void> {
        const reminders = await this.read();
        reminders.push(reminder);
        await this.save(reminders);
    }
}
