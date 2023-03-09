import { TimeLog } from '../models/TimeLog';
import { getTaskById } from './project-service';
import { deleteDbTimeLog, getDbTimelogs, PAUSE, upsertDbTimeLog } from './db-service';
import { mapEntityToTimelog, mapTimeLogToEntity } from '../mappers/TimelogMapper';

/**
 * Delete an existing time log identified by its id
 * @param logId - the id of the log to delete
 * @returns an empty promise
 */
export async function deleteLogItem(logId: number): Promise<void> {
    return await deleteDbTimeLog(logId);
}

/**
 * Starts a task by id
 * @param taskId - the id of the task to start
 * @returns a promise of the started pause log
 */
export function startTask(taskId: number): Promise<void | TimeLog> {
    if (!taskId) {
        return Promise.resolve();
    }
    const entity = mapTimeLogToEntity({
        start: new Date(),
        taskId,
    });

    return upsertDbTimeLog(entity).then(mapEntityToTimelog);
}

/**
 * Stop a given task in progress
 * @returns an empty promise
 */
export function endTask(log: TimeLog | undefined): Promise<void | TimeLog> {
    if (!log) {
        return Promise.resolve();
    }
    log.end = new Date();
    return upsertDbTimeLog(mapTimeLogToEntity(log)).then(mapEntityToTimelog);
}

/**
 * Starts a pause log
 * @returns a promise of the started pause log
 */
export function startPause(): Promise<void | TimeLog> {
    return startTask(PAUSE.id!);
}

/**
 * Stop a pause in progress
 * @returns an empty promise
 */
export async function endPause(): Promise<void> {
    const logs = await getTimeLogs();
    const pauseLog = logs.find(l => !l.end && l.taskId === PAUSE.id);
    if (!pauseLog) {
        return;
    }
    await endTask(pauseLog);
    const lastLog = logs.find(l => l.end?.getHours() === pauseLog.start.getHours() && l.end.getMinutes() === pauseLog.start.getMinutes());
    if (!lastLog) {
        return;
    }
    await startTask(lastLog.taskId);
}

/**
 * Change the task of an existing time log
 * @param logId - the id of the log to update
 * @param newTaskId - the new task id to set
 * @returns the empty promise
 */
export async function changeTaskForEntry(logId: number, newTaskId: number): Promise<TimeLog | undefined> {
    const logs = await getTimeLogs();
    const log = logs.find(l => l.id === logId);
    if (!log) {
        return;
    }
    log.taskId = newTaskId;
    const entity = await upsertDbTimeLog(mapTimeLogToEntity(log));
    const l = mapEntityToTimelog(entity);
    l.task = await getTaskById(newTaskId);
    return l;
}

/**
 * Get all time logs related to a given date filter
 * @param date - the date (day) of which we want to get the time log
 * @returns the promise of matched time logs
 */
export function getTimeLogs(date = new Date(), type?: 'daily' | 'monthly'): Promise<Array<TimeLog>> {
    return getDbTimelogs(date, type).then(logs => logs.map(mapEntityToTimelog));
}

export function changeLogTime(log: TimeLog, startDate?: Date, endDate?: Date): Promise<TimeLog> {
    if (startDate) {
        log.start = startDate;
    }

    if (endDate) {
        log.end = endDate;
    }

    if (startDate || endDate) {
        return upsertDbTimeLog(mapTimeLogToEntity(log)).then(mapEntityToTimelog);
    }
    return Promise.resolve(log);
}
