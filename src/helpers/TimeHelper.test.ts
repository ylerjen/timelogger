import { TimeLog } from '../models/TimeLog';
import { countDailyWorkableTimeInSeconds, countPausedDurationInSeconds, countSuppTimeDurationInSeconds, countTasksDurationInSeconds, countWorkedDurationInSeconds, formatTimeDiff, getWorkedLogs, groupLogsByDay, groupLogsByTasks, timeDifference } from './TimeHelper';
import { PAUSE } from '../services/db-service';

describe('getWorkedLogs', () => {
    test('should return only worked logs', () => {
        const baseLogs: Array<TimeLog> = [
            { taskId: 1111, start: new Date('2020-10-01T10:00:00'), end: new Date('2020-10-01T11:00:00') },
            { taskId: PAUSE.id!, start: new Date('2020-10-01T11:00:00'), end: new Date('2020-10-01T12:00:00') },
            { taskId: PAUSE.id!, start: new Date('2020-10-01T13:00:00'), end: new Date('2020-10-01T14:00:00') },
            { taskId: 4444, start: new Date('2020-10-01T14:00:00'), end: new Date('2020-10-01T15:00:00') },
        ];
        const workedLogs = getWorkedLogs(baseLogs);
        expect(workedLogs.length).toBe(2);
    });
});


describe('getPausedLogs', () => {
    test('should return only paused logs', () => {
        const baseLogs: Array<TimeLog> = [
            { taskId: 1111, start: new Date('2020-10-01T10:00:00'), end: new Date('2020-10-01T11:00:00') },
            { taskId: PAUSE.id!, start: new Date('2020-10-01T11:00:00'), end: new Date('2020-10-01T12:00:00') },
            { taskId: PAUSE.id!, start: new Date('2020-10-01T13:00:00'), end: new Date('2020-10-01T14:00:00') },
            { taskId: 4444, start: new Date('2020-10-01T14:00:00'), end: new Date('2020-10-01T15:00:00') },
        ];
        const workedLogs = getWorkedLogs(baseLogs);
        expect(workedLogs.length).toBe(2);
    });
});

describe('timeDifference', () => {
    test('should return the interval between 2 dates', () => {
        const startDate = new Date('2020-10-01T10:00:00');
        const endDate = new Date('2020-10-01T12:30:00');
        const diff = timeDifference(startDate, endDate);
        expect(diff.hours).toBe(2);
        expect(diff.minutes).toBe(30);
    });
});

describe('countSuppTimeDurationInSeconds', () => {
    const baseLogs: Array<TimeLog> = [
        { taskId: 1111, start: new Date('2020-10-01T10:00:00'), end: new Date('2020-10-01T19:30:00') },
    ];

    test('should return the supplementary time in seconds', () => {
        const duration = countSuppTimeDurationInSeconds(baseLogs);
        expect(duration).toBe(3960);
    });
});

describe('countDailyWorkableTimeInSeconds', () => {
    test('should return the daily workable time in seconds', () => {
        const duration = countDailyWorkableTimeInSeconds();
        expect(duration).toBe(30240);
    });
});

describe('countWorkedDurationInSeconds', () => {
    const baseLogs: Array<TimeLog> = [
        { taskId: 1111, start: new Date('2020-10-01T10:00:00'), end: new Date('2020-10-01T11:00:00') },
        { taskId: PAUSE.id!, start: new Date('2020-10-01T11:00:00'), end: new Date('2020-10-01T12:00:00') },
        { taskId: PAUSE.id!, start: new Date('2020-10-01T13:00:00'), end: new Date('2020-10-01T14:00:00') },
        { taskId: 4444, start: new Date('2020-10-01T14:00:00'), end: new Date('2020-10-01T15:00:00') },
    ];

    test('should return the worked time in seconds', () => {
        const duration = countWorkedDurationInSeconds(baseLogs);
        expect(duration).toBe(7200);
    });
});

describe('countTasksDurationInSeconds', () => {
    const baseLogs: Array<TimeLog> = [
        { taskId: 1111, start: new Date('2020-10-01T10:00:00'), end: new Date('2020-10-01T11:00:00') },
        { taskId: PAUSE.id!, start: new Date('2020-10-01T11:00:00'), end: new Date('2020-10-01T12:00:00') },
        { taskId: PAUSE.id!, start: new Date('2020-10-01T13:00:00'), end: new Date('2020-10-01T14:00:00') },
        { taskId: 4444, start: new Date('2020-10-01T14:00:00'), end: new Date('2020-10-01T15:00:00') },
    ];

    test('should return the time of all timelogs in seconds', () => {
        const duration = countTasksDurationInSeconds(baseLogs);
        expect(duration).toBe(14400);
    });
});

describe('countPausedDurationInSeconds', () => {
    const baseLogs: Array<TimeLog> = [
        { taskId: 1111, start: new Date('2020-10-01T10:00:00'), end: new Date('2020-10-01T11:00:00') },
        { taskId: PAUSE.id!, start: new Date('2020-10-01T11:00:00'), end: new Date('2020-10-01T12:00:00') },
        { taskId: PAUSE.id!, start: new Date('2020-10-01T13:00:00'), end: new Date('2020-10-01T14:00:00') },
        { taskId: 4444, start: new Date('2020-10-01T14:00:00'), end: new Date('2020-10-01T15:00:00') },
    ];

    test('should return the worked time in seconds', () => {
        const duration = countPausedDurationInSeconds(baseLogs);
        expect(duration).toBe(7200);
    });
});

describe('formatTimeDiff', () => {
    test('should format a given time diff into string', () => {
        const duration = formatTimeDiff({ hours: 8, minutes: 24 });
        expect(duration).toBe('8h 24m');
    });
});

fdescribe('groupLogsByDay', () => {
    test('should group logs by day', () => {
        const logs: Array<TimeLog> = [
            { id: 1, start: new Date(2022, 2, 1), end: new Date(2022, 2, 1), taskId: 1 },
            { id: 2, start: new Date(2022, 2, 1), end: new Date(2022, 2, 1), taskId: 1 },
            { id: 3, start: new Date(2022, 2, 2), end: new Date(2022, 2, 2), taskId: 1 },
        ];

        const groupedResult = groupLogsByDay(logs);
        expect(groupedResult.size).toBe(2);
    });
});

fdescribe('groupLogsByTasks', () => {
    test('should group logs by day', () => {
        const logs: Array<TimeLog> = [
            { id: 1, start: new Date(2022, 2, 1), end: new Date(2022, 2, 1), taskId: 1 },
            { id: 2, start: new Date(2022, 2, 1), end: new Date(2022, 2, 1), taskId: 2 },
            { id: 3, start: new Date(2022, 2, 1), end: new Date(2022, 2, 1), taskId: 1 },
        ];

        const groupedResult = groupLogsByTasks(logs);
        expect(groupedResult.size).toBe(2);
    });
});
