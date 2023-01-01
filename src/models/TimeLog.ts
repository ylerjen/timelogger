import { Task } from "./Task";

export interface TimeLog {
    id: number,
    task: Task;
    start: Date;
    end?: Date;
    
}
