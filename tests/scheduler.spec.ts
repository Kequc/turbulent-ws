import Scheduler from '../src/scheduler';
import { genReminder } from './test_helpers';

jest.useFakeTimers();

describe('Scheduler', function () {
    let scheduler: Scheduler;
    let emitSpy;

    beforeEach(function () {
        scheduler = new Scheduler();
        emitSpy = jest.spyOn(scheduler, 'emit');
        jest.clearAllMocks();
    });

    describe('add', function () {
        it('should set a timeout', function () {
            const reminder = genReminder('Test notice', 1000);
            scheduler.add(reminder);

            expect(setTimeout).toHaveBeenCalledTimes(1);

            jest.advanceTimersByTime(1000 + 100); // should have run by now

            expect(emitSpy).toHaveBeenCalledTimes(1);
            expect(emitSpy).toHaveBeenCalledWith('notice', reminder.notice);
        });

        it('should ignore out of date times', function () {
            const reminder = genReminder('Test notice', -1000);
            scheduler.add(reminder);

            expect(setTimeout).toHaveBeenCalledTimes(0);
        });

    });
});
