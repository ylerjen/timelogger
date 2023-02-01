/**
 * DB entity of a timelog
 */
export interface TimeLogEntity {
    id?: number;
    taskId: number;
    start: number;
    end?: number;
}
