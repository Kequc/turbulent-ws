import Logger from '../src/logger';
import Storage from '../src/storage';
import { eraseStorage, genReminder, genLogger, setStorage, readStorage } from './test_helpers';

describe('Storage', function () {
    const FILE_PATH = './store_test_storage.json';

    let logger: Logger;
    let storage: Storage;

    beforeEach(function () {
        logger = genLogger();
        storage = new Storage({ filePath: FILE_PATH, logger });
    });

    afterEach(async function () {
        await eraseStorage(FILE_PATH);
    });

    describe('constructor', function () {
        it('should accept a file path', function () {
            expect(storage.filePath).toEqual(FILE_PATH);
        });
    });

    describe('read', function () {
        it('should recover when file does not exist', async function () {
            const result = await storage.read();
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(0);
        });

        it('should return file contents when populated', async function () {
            const reminders = [
                genReminder('Test notice')
            ];
            await setStorage(FILE_PATH, JSON.stringify(reminders));

            const result = await storage.read();
            expect(result).toEqual(reminders);
        });

        it('should ignore expired contents', async function () {
            const reminders = [
                genReminder('Test notice 1', -1000),
                genReminder('Test notice 2')
            ];
            await setStorage(FILE_PATH, JSON.stringify(reminders));

            const result = await storage.read();
            expect(result).toEqual([reminders[1]]);
        });
    });

    describe('save', function () {
        it('should save file contents', async function () {
            const reminders = [
                genReminder('Test notice')
            ];
            await storage.save(reminders);

            const data = await readStorage(FILE_PATH);
            const result = JSON.parse(data);
            expect(result).toEqual(reminders);
        });

        it('should save over file contents', async function () {
            const reminders1 = [
                genReminder('Test notice 1')
            ];
            await setStorage(FILE_PATH, JSON.stringify(reminders1));

            const reminders2 = [
                genReminder('Test notice 2')
            ];
            await storage.save(reminders2);

            const data = await readStorage(FILE_PATH);
            const result = JSON.parse(data);
            expect(result).toEqual(reminders2);
        });

        it('should discard expired contents', async function () {
            const reminders = [
                genReminder('Test notice 1', -1000),
                genReminder('Test notice 2')
            ];
            await storage.save(reminders);

            const data = await readStorage(FILE_PATH);
            const result = JSON.parse(data);
            expect(result).toEqual([reminders[1]]);
        });
    });

    describe('add', function () {
        it('should persist a reminder when file does not exist', async function () {
            const reminder = genReminder('Test notice');
            await storage.add(reminder);

            const data = await readStorage(FILE_PATH);
            const result = JSON.parse(data);
            expect(result).toEqual([reminder]);
        })

        it('should persist a reminder when file already exists', async function () {
            const reminders = [
                genReminder('Test notice 1'),
                genReminder('Test notice 2')
            ];
            await setStorage(FILE_PATH, JSON.stringify(reminders));

            const reminder = genReminder('Test notice 2');
            await storage.add(reminder);

            const data = await readStorage(FILE_PATH);
            const result = JSON.parse(data);
            expect(result).toEqual([reminders[0], reminders[1], reminder]);
        })
    });
});
