import { EventEmitter } from 'events';
import Reminder from './reminder';

export default class Scheduler extends EventEmitter {
    add ({ time, notice }: Reminder): void {
        const now = Date.now();
        if (time > now) {
            setTimeout(() => {
                this.emit('notice', notice);
            }, time - now)
        }
    }
}
