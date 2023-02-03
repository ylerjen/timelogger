import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import Dexie from 'dexie';
import { Task } from '../models/Task';
import { TimeLogEntity } from '../models/TimeLogEntity';

export const PAUSE: Task = { id: 0, name: 'Pause', color: 'white' };

class TimeloggerDb extends Dexie {
    timelogs!: Dexie.Table<TimeLogEntity, number>;

    tasks!: Dexie.Table<Task, number>;

    constructor() {
        super('Timelogger');

        // Declare tables, IDs and indexes
        this.version(1).stores({
            tasks: '++id',
            timelogs: '++id, start, end',
        });
    }
}

const db = new TimeloggerDb();

// upsertTask(PAUSE).then().catch();
// upsertTask({ id: 1, name: 'ABC', color: 'cyan' }).then().catch();
// upsertTask({ id: 2, name: 'DEF', color: 'green' }).then().catch();
// upsertTask({ id: 3, name: 'GHI', color: 'yellow' }).then().catch();
// upsertTask({ id: 4, name: 'IJK', color: 'red' }).then().catch();
// upsertTask({ id: 5, name: 'LMN', color: 'pink' }).then().catch();

// const timeLogs: Array<TimeLog> = [
//     { id: 1, taskId: 1, start: new Date(2022, 10, 7, 8, 30), end: new Date(2022, 10, 7, 11, 0)},
//     { id: 2, taskId: 2, start: new Date(2022, 10, 7, 11, 0), end: new Date(2022, 10, 7, 12, 0)},
//     { id: 3, taskId: 0, start: new Date(2022, 10, 7, 12, 0), end: new Date(2022, 10, 7, 13, 0)},
//     { id: 4, taskId: 1, start: new Date(2022, 10, 7, 13, 0)},
// ];
// timeLogs.forEach(l => addDbTimeLog(l).then().catch());


export function getTasks(): Promise<Array<Task>> {
    return db.tasks.toArray();
}

export function upsertTask(task: Task): Promise<Task> {
    return db.tasks.put(task).then(id => {
        task.id = id;
        return Promise.resolve(task);
    });
}

// TIME LOGS


export function getDbTimelogs(forDate: Date = new Date(), type: 'daily' | 'monthly' = 'daily'): Promise<Array<TimeLogEntity>> {
    const dayStart = type === 'daily' ? startOfDay(forDate) : startOfMonth(forDate);
    const dayEnd = type === 'daily' ? endOfDay(forDate) : endOfMonth(forDate);

    return db.timelogs
        .where('start')
        .between(dayStart.getTime(), dayEnd.getTime())
        .toArray();
}

export async function upsertDbTimeLog(log: TimeLogEntity): Promise<TimeLogEntity> {
    const id = await db.timelogs.put(log);
    log.id = id;
    return log;
}

export function deleteDbTimeLog(logId: number): Promise<void> {
    return db.timelogs.delete(logId);
}
