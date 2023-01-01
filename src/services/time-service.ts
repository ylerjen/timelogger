import { addMinutes, hoursToMinutes, intervalToDuration } from "date-fns";
import { timeDifference } from "../helpers/TimeHelper";
import { TimeLog } from "../models/TimeLog";
import { getTaskById, pause } from "./project-service";

const timeLogs: Array<TimeLog> = [
    { id: 111, task: getTaskById(1), start: new Date(2022, 10, 7, 8, 30), end: new Date(2022, 10, 7, 11, 0) },
    { id: 222, task: getTaskById(2), start: new Date(2022, 10, 7, 11, 0), end: new Date(2022, 10, 7, 12, 0) },
    { id: 333, task: getTaskById(0), start: new Date(2022, 10, 7, 12, 0), end: new Date(2022, 10, 7, 13, 0) },
    { id: 444, task: getTaskById(1), start: new Date(2022, 10, 7, 13, 0) }
];

export function startTask(taskId: number): void {
    timeLogs.push({
        id: Date.now(),
        task: getTaskById(taskId),
        start: new Date(),
    })
}

export function endTask(): void {
    const timeLog = timeLogs.find(l => !l.end);
    if (timeLog) {
        timeLog.end = new Date();
    }
}

export function startPause(): void {
    endTask();
    startTask(0)
}

export function endPause(): void {
    const pauseLog = timeLogs.find(l => !l.end && l.task.id === pause.id);
    if (!pauseLog) {
        return;
    }
    const lastLog = timeLogs.find(l => l.end?.getHours() === pauseLog.start.getHours() && l.end.getMinutes() === pauseLog.start.getMinutes())
    endPause();
    if (!lastLog) {
        return;
    }
    startTask(lastLog.task.id);
}

export function changeTaskForEntry(logId: number, newTaskId: number): void {
    const entry = timeLogs.find(l => l.id === logId);
    if (!entry) {
        return;
    }
    entry.task = getTaskById(newTaskId);
}

export function getTimeLogs(date = new Date()): Array<TimeLog> {
    return timeLogs;
}

export function countTasksDuration(logs: Array<TimeLog>): Duration {
    const totalMinutes = logs.map(log => {
        const start = log.start;
        const end = log.end ?? new Date();
        const duration = timeDifference(start, end);
        let minutes = duration.minutes ?? 0;
        const hours = duration.hours ?? 0;
        return minutes + hoursToMinutes(hours);
    }).reduce((previousVal = 0, currentVal, idx, array) => {
        return previousVal + currentVal;
    });
    const start = new Date();
    const end = addMinutes(start, totalMinutes);
    return intervalToDuration({ end, start });
}

export function countPausedDuration(logs: Array<TimeLog>): Duration {
    const pauseLogs = logs.filter(log => log.task.id === pause.id);
    if (!pauseLogs.length) {
        return {};
    }
    return countTasksDuration(pauseLogs);
}

export function countWorkedDuration(logs: Array<TimeLog>): Duration {
    const pauseLogs = logs.filter(log => log.task.id !== pause.id);
    if (!pauseLogs.length) {
        return {};
    }
    return countTasksDuration(pauseLogs);

}
