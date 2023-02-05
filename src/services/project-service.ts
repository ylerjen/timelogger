import { Task } from '../models/Task';
import { getTasks, upsertTask, getTaskById as getDbTaskById } from './db-service';

export function getTaskById(taskId: number): Promise<Task | undefined> {
    return getDbTaskById(taskId);
}

export function getAllTasks(): Promise<Array<Task>> {
    return getTasks();
}

export function saveTask(task: Task): Promise<Task> {
    return upsertTask(task);
}
