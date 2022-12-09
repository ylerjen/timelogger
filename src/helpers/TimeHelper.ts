import { intervalToDuration } from 'date-fns';

/**
 * Calculate the interval between 2 datetimes
 * @param start - the start date
 * @param end - the end date. If not passed, now() is used
 * @param absoluteValue 
 * @returns the interval as readable string
 */
export function timeDifference(start: Date, end = new Date()): Duration {
    const diff = intervalToDuration({end, start});
    const hours = diff.hours ?? 0;
    const minutes = (diff.minutes ?? 0);
    return {hours, minutes};
}

export function formatTimeDiff(duration: Duration): string {
    const h = duration.hours ?? 0;
    const m = (duration.minutes ?? 0).toString().padStart(2, '0');
    return `${h}h ${m}m`;
}
