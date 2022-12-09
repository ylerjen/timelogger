import { Task } from "./Task";

export interface TimeLog {
    task: Task;
    start: Date;
    end?: Date;
    
}
