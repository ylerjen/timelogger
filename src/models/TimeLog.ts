import { Task } from './Task';

/**
 * Timelog like used in the app
 */
export interface TimeLog {
    id?: number;
    task?: Task;
    taskId: number;
    start: Date;
    end?: Date;
}
