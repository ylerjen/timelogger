import { Task } from "./Task";

export interface TimeLog {
    id?: number;
    task?: Task;
    taskId: number;
    start: Date;
    end?: Date;
}
