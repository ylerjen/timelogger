import { intervalToDuration } from 'date-fns';

/**
 * Calculate the interval between 2 datetimes
 * @param start - the start date
 * @param end - the end date. If not passed, now() is used
 * @param absoluteValue 
 * @returns the interval as readable string
 */
export function timeDifference(start: Date, end = new Date()): string {
    const diff = intervalToDuration({end, start});

    const h = diff.hours ?? 0;
    let m = (diff.minutes ?? 0).toString();
    m = m.padStart(2, '0');

    return `${h}h ${m}m`;
}
