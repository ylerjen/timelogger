import { Task } from '../models/Task';
import { getTasks, upsertTask } from './db-service';

const task1: Readonly<Task> = { id: 1, name: 'ABC1', color: '#9C27B0' } as const;
const task2: Readonly<Task> = { id: 2, name: 'DEF2', color: '#673AB7' } as const;
const task3: Readonly<Task> = { id: 3, name: 'GHI3', color: '#607D8B' } as const;
const task4: Readonly<Task> = { id: 4, name: 'Meetings', color: '#FF9800' } as const;
const task5: Readonly<Task> = { id: 5, name: 'Interview', color: '#9C27B0' } as const;

const tasks: Array<Task> = [task1, task2, task3, task4, task5];

function findById(id: number) {
    return (item: Task) => item.id === id;
}

export function getTaskById(taskId: number): Task {
    return tasks.find(findById(taskId)) || tasks[0];
}

export function getAllTasks(): Promise<Array<Task>> {
    return getTasks();
}

export function saveTask(task: Task): Promise<Task> {
    return upsertTask(task);
}
