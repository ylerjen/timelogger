import { TimeLog } from '../models/TimeLog';
import { getTaskById } from './project-service';
import { deleteDbTimeLog, getDbTimelogs, PAUSE, upsertDbTimeLog } from './db-service';

export async function deleteLogItem(logId: number): Promise<void> {
    return await deleteDbTimeLog(logId);
}

export function startTask(taskId: number): Promise<void | TimeLog> {
    if (!taskId) {
        return Promise.resolve();
    }
    const dbTimeLog: TimeLog = {
        start: new Date(),
        taskId,
    };
    return upsertDbTimeLog(dbTimeLog);
}

export function endTask(log: TimeLog): Promise<void | TimeLog> {
    if (!log) {
        Promise.resolve();
    }
    log.end = new Date();
    return upsertDbTimeLog(log);
}

export function startPause(): Promise<void | TimeLog> {
    return startTask(PAUSE.id!);
}

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

export async function changeTaskForEntry(logId: number, newTaskId: number): Promise<void> {
    const logs = await getTimeLogs();
    const entry = logs.find(l => l.id === logId);
    if (!entry) {
        return;
    }
    entry.task = getTaskById(newTaskId);
}

export function getTimeLogs(date = new Date()): Promise<Array<TimeLog>> {
    return getDbTimelogs(date);
}
