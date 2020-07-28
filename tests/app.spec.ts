import * as WebSocket from 'ws';
import App from '../src/app';
import Scheduler from '../src/scheduler';
import Storage from '../src/storage';
import { eraseStorage, genReminder, genError, genApp, setStorage } from './test_helpers';

const FILE_PATH = '../store_test_app.json';

describe('App', function () {
    let app: App;

    beforeEach(function () {
        app = genApp(FILE_PATH);
    });

    afterEach(async function () {
        await eraseStorage(FILE_PATH);
    });

    describe('constructor', function () {
        it('should set all attributes', function () {
            expect(app.wss).toEqual(expect.any(WebSocket.Server));
            expect(app.storage).toEqual(expect.any(Storage));
            expect(app.scheduler).toEqual(expect.any(Scheduler));
        });
    });

    describe('onMessage', function () {
        let wsMock;

        beforeEach(function () {
            wsMock = {
                send: jest.fn()
            };
        });

        it('should return an error when invalid request', function () {
            app.onMessage(wsMock, '{invalidjson');

            expect(wsMock.send).toHaveBeenCalledTimes(1);
            expect(wsMock.send).toHaveBeenCalledWith(genError('Invalid request'));
        });

        it('should return an error when missing method parameter', function () {
            app.onMessage(wsMock, JSON.stringify({ params: { weird: 'json' } }));

            expect(wsMock.send).toHaveBeenCalledTimes(1);
            expect(wsMock.send).toHaveBeenCalledWith(genError('Invalid request format'));
        });

        it('should return an error when missing params parameter', function () {
            app.onMessage(wsMock, JSON.stringify({ method: 'add_reminder' }));

            expect(wsMock.send).toHaveBeenCalledTimes(1);
            expect(wsMock.send).toHaveBeenCalledWith(genError('Invalid request format'));
        });

        it('should return an error when method does not exist', function () {
            app.onMessage(wsMock, JSON.stringify({ method: 'does_not_exist', params: { weird: 'json' } }));

            expect(wsMock.send).toHaveBeenCalledTimes(1);
            expect(wsMock.send).toHaveBeenCalledWith(genError('Invalid method: does_not_exist'));
        });
    });

    describe('startup', function () {
        let schedulerAddSpy;

        beforeEach(function () {
            schedulerAddSpy = jest.spyOn(app.scheduler, 'add');
        });

        it('should bring the scheduler back up to date', async function () {
            const reminders = [
                genReminder('Test notice 1', -1000),
                genReminder('Test notice 2')
            ];
            await setStorage(FILE_PATH, JSON.stringify(reminders));

            await app.startup()

            expect(schedulerAddSpy).toHaveBeenCalledTimes(1);
            expect(schedulerAddSpy).toHaveBeenCalledWith(reminders[1]);
        });
    });
});
