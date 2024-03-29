import { intervalToDuration, Duration, minutesToMilliseconds, hoursToMilliseconds, setHours, setMinutes, setSeconds, formatISO9075 } from 'date-fns';
import { TimeLog } from '../models/TimeLog';
import { PAUSE } from '../services/db-service';

/**
 * Calculate the interval between 2 datetimes
 * @param start - the start date
 * @param end - the end date. If not passed, now() is used
 * @returns the interval as readable string
 */
export function timeDifference(start: Date, end = new Date()): Duration {
    const diff = intervalToDuration({ end, start });
    const hours = diff.hours ?? 0;
    const minutes = diff.minutes ?? 0;
    return { hours, minutes };
}

export function formatTimeDiff(duration: Duration): string {
    const h = duration.hours ?? 0;
    const m = (duration.minutes ?? 0).toString().padStart(2, '0');
    return `${h}h ${m}m`;
}

/**
 * Count the worked task duration in seconds
 * @param logs - the list of logs
 * @param taskId - an optional task id if we want to count some tasks only
 * @returns the number of worked seconds
 */
export function countTasksDurationInSeconds(logs: Array<TimeLog>, taskId?: number): number {
    const totalSeconds = logs
        .filter(l => !taskId || taskId === l.taskId)
        .map(log => {
            const start = log.start;
            const end = log.end ?? new Date();
            const durationInSeconds = getTimeBetweenDatesInSeconds(start, end);
            return durationInSeconds;
        })
        .reduce((previousVal = 0, currentVal) => previousVal + currentVal);
    return totalSeconds;
}

export function countPausedDurationInSeconds(logs: Array<TimeLog>): number {
    const pauseLogs = getPausedLogs(logs);
    if (!pauseLogs.length) {
        return 0;
    }
    return countTasksDurationInSeconds(pauseLogs);
}

export function countWorkedDurationInSeconds(logs: Array<TimeLog>): number {
    const workedLogs = getWorkedLogs(logs);
    if (!workedLogs.length) {
        return 0;
    }
    return countTasksDurationInSeconds(workedLogs);
}

export function countDailyWorkableTimeInSeconds(): number {
    const ms = hoursToMilliseconds(8) + minutesToMilliseconds(24);
    return ms / 1000;
}

export function countSuppTimeDurationInSeconds(logs: Array<TimeLog>): number {
    return countWorkedDurationInSeconds(logs) - countDailyWorkableTimeInSeconds();
}

export function getWorkedLogs(logs: Array<TimeLog>): Array<TimeLog> {
    return logs.filter(log => log.taskId !== PAUSE.id);
}

export function getPausedLogs(logs: Array<TimeLog>): Array<TimeLog> {
    return logs.filter(log => log.taskId === PAUSE.id);
}

/**
 * Calculate the milliseconds between 2 dates
 * @param date1 - the first date to count the diff from
 * @param date2 - the second date to count the diff from
 * @returns - the duration object
 */
export function getTimeBetweenDatesInSeconds(date1: Date, date2: Date): number {
    // Convertir les dates en milliseconds
    const date1InMs = date1.getTime();
    const date2InMs = date2.getTime();

    // Calculer la différence entre les dates en milliseconds
    return Math.abs(date2InMs - date1InMs) / 1000;
}

/**
 * Transform a value in milliseconds to a duration object (days, hours, minutes,...)
 * @param timeInMs - the time in ms that we want to converate into duration
 * @returns the calculated duration
 */
export function transformSecondsIntoDuration(timeDiffInSeconds: number): Duration {
    const isNegativeValue = timeDiffInSeconds < 0;

    if (isNegativeValue) {
        timeDiffInSeconds = -timeDiffInSeconds;
    }

    // Calculer les secondes
    const seconds = Math.floor(timeDiffInSeconds % 60);

    // Convertir la différence en minutes
    const timeDiffInMinutes = timeDiffInSeconds / 60;

    // Calculer les minutes
    const minutes = Math.floor(timeDiffInMinutes % 60);

    // Convertir la différence en heures
    const timeDiffInHours = timeDiffInMinutes / 60;

    // Calculer les heures
    const hours = Math.floor(timeDiffInHours % 24);

    // Convertir la différence en jours
    const timeDiffInDays = timeDiffInHours / 24;

    // Calculer les jours
    const days = Math.floor(timeDiffInDays);

    // Retourner un objet avec les valeurs en jours, heures, minutes et secondes
    return {
        days,
        hours,
        minutes,
        seconds,
    };
}

export function groupLogsByDay(logs: Array<TimeLog>): Map<string, Array<TimeLog>> {
    const obj = new Map();
    logs.forEach(l => {
        const dateString = formatISO9075(l.start, { representation: 'date' });
        if (!obj.has(dateString)) {
            obj.set(dateString, []);
        }
        obj.get(dateString).push(l);
    });
    return obj;
}

/**
 * Groups some logs by task in a Map having the taskId has key and logs as values
 * @param logs - the logs to group
 * @returns a map of grouped logs
 */
export function groupLogsByTasks(logs: Array<TimeLog>): Map<string, Array<TimeLog>> {
    const obj = new Map();
    logs.forEach(l => {
        if (!obj.has(l.taskId)) {
            obj.set(l.taskId, []);
        }
        obj.get(l.taskId).push(l);
    });
    return obj;
}
