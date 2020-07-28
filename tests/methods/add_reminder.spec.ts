import AddReminder from '../../src/methods/add_reminder';
import App from '../../src/app';
import { eraseStorage, genReminder, genApp } from '../test_helpers';
import Reminder from '../../src/reminder';

const FILE_PATH = '../store_test_reminder.json';

describe('AddReminder', function () {
    let addReminder: AddReminder;

    beforeEach(function () {
        addReminder = new AddReminder();
    });

    describe('validate', function () {
        it('should return error is time is not a number', function () {
            const reminder = genReminder('Test notce');
            reminder.time = undefined;

            expect(addReminder.validate(reminder)).toEqual(expect.any(String));
        });

        it('should return error if time is in the past', function () {
            const reminder = genReminder('Test notce', -1000);

            expect(addReminder.validate(reminder)).toEqual(expect.any(String));
        });

        it('should return an error if notice is not a string', function () {
            const reminder = genReminder(undefined);

            expect(addReminder.validate(reminder)).toEqual(expect.any(String));
        });

        it('sould return null for valid reminder', function () {
            const reminder = genReminder('Test notce');

            expect(addReminder.validate(reminder)).toBeFalsy();
        });
    });

    describe('process', function () {
        let app: App;
        let storageAddSpy;
        let schedulerAddSpy;

        beforeEach(function () {
            app = genApp(FILE_PATH);
            storageAddSpy = jest.spyOn(app.storage, 'add');
            schedulerAddSpy = jest.spyOn(app.scheduler, 'add');
        });

        afterEach(async function () {
            await eraseStorage(FILE_PATH);
        });
    
        it('should add a reminder to storage and scheduler', async function () {
            const reminder = genReminder('Test notce');

            await addReminder.process(app, reminder);

            expect(storageAddSpy).toHaveBeenCalledTimes(1);
            expect(storageAddSpy).toHaveBeenCalledWith(reminder);
            expect(schedulerAddSpy).toHaveBeenCalledTimes(1);
            expect(schedulerAddSpy).toHaveBeenCalledWith(reminder);
        });

        it('should correct for odd floating point numbers', async function () {
            const reminder = genReminder('Test notce', 0.3);

            await addReminder.process(app, reminder);

            const expected: Reminder = {
                time: Math.ceil(reminder.time),
                notice: reminder.notice
            };

            expect(storageAddSpy).toHaveBeenCalledTimes(1);
            expect(storageAddSpy).toHaveBeenCalledWith(expected);
            expect(schedulerAddSpy).toHaveBeenCalledTimes(1);
            expect(schedulerAddSpy).toHaveBeenCalledWith(expected);
        });
    });
});
