import Method from './method';
import App from '../app';
import Reminder from '../reminder';

export default class AddReminder extends Method {
    validate ({ time, notice }: Reminder): string|null {
        if (typeof time !== 'number') {
            return 'Invalid param: Time must be a number';
        }
        if (time <= Date.now()) {
            return 'Invalid param: Time must be in the future';
        }
        if (typeof notice !== 'string') {
            return 'Invalid param: Notice must be a string';
        }
    }
    
    async process (app: App, { time, notice }: Reminder): Promise<void> {
        const reminder: Reminder = {
            time: Math.ceil(time),
            notice: notice
        };

        await app.storage.add(reminder);
        app.scheduler.add(reminder);
    }
}
