import Dexie from 'dexie';
import { lastDayOfMonth } from 'date-fns';
import { Task } from '../models/Task';
import { Project } from '../models/Project';
import { TimeLog } from '../models/TimeLog';

export const PAUSE: Task = { id: 0, name: 'Pause', color: 'white' };

class TimeloggerDb extends Dexie {
    timelogs!: Dexie.Table<TimeLog, number>;
    projects!: Dexie.Table<Project, number>;
    tasks!: Dexie.Table<Task, number>;

    constructor() {
        super('Timelogger');

        // Declare tables, IDs and indexes
        this.version(1).stores({
            projects: '++id, name, color',
            tasks: '++id, name, color, projectId',
            timelogs: '++id, datetime, taskId',
        });        
    }
}

const db = new TimeloggerDb();

// addTask(PAUSE).then().catch();
// addTask({ id: 1, name: 'ABC', color: 'cyan' }).then().catch();
// addTask({ id: 2, name: 'XYZ', color: 'green' }).then().catch();

// const timeLogs: Array<TimeLog> = [
//     { id: 1, taskId: 1, start: new Date(2022, 10, 7, 8, 30), end: new Date(2022, 10, 7, 11, 0)},
//     { id: 2, taskId: 2, start: new Date(2022, 10, 7, 11, 0), end: new Date(2022, 10, 7, 12, 0)},
//     { id: 3, taskId: 0, start: new Date(2022, 10, 7, 12, 0), end: new Date(2022, 10, 7, 13, 0)},
//     { id: 4, taskId: 1, start: new Date(2022, 10, 7, 13, 0)},
// ];
// timeLogs.forEach(l => addDbTimeLog(l).then().catch());

export function getProjects(): Promise<Array<Project>> {
    return db.projects.toArray();
}

export function getTasks(): Promise<Array<Task>> {
    return db.tasks.toArray();  
}

export function addProject(project: Project): Promise<Project> {
    return db.projects.add(project)
        .then(id => {
            project.id = id;
            return project;
        });
}

export async function upsertTask(task: Task): Promise<Task> {
    const id = await db.tasks.put(task);
    task.id = id;
    return task;
}

// TIME LOGS


export function getDbTimelogs(forDate: Date = new Date(), type: 'daily' | 'monthly' = 'daily'): Promise<Array<TimeLog>> {
    return db.timelogs.toArray();
    
    const query = db.timelogs.where('datetime');
    const lowerBound = new Date(forDate.getTime());
    let upperBound = new Date(forDate.getTime());
    if (type === 'monthly') {
        lowerBound.setHours(0, 0, 0, 0);
        upperBound.setHours(23, 59, 59, 999);
    } else {
        lowerBound.setDate(1);
        lowerBound.setHours(0, 0, 0, 0);
        upperBound = lastDayOfMonth(upperBound);
        upperBound.setHours(23, 59, 59, 999);
    }
    return query.between({ datetime: lowerBound }, { datetime: upperBound }).toArray();
}

export async function upsertDbTimeLog(log: TimeLog): Promise<TimeLog> {
    const id = await db.timelogs.put(log);
    log.id = id;
    return log;
}

export function deleteDbTimeLog(logId: number): Promise<void> {
    return db.timelogs.delete(logId);
}
