import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { getTasks, upsertTask } from "./db-service";

const project1: Readonly<Project> = { id: 1, name: 'Timelogger' } as const;
const project2: Readonly<Project> = { id: 2, name: 'Other' } as const;
const task1: Readonly<Task> = { id: 1, name: 'ABC1', color: '#9C27B0', project: project1 } as const;
const task2: Readonly<Task> = { id: 2, name: 'DEF2', color: '#673AB7', project: project1 } as const;
const task3: Readonly<Task> = { id: 3, name: 'GHI3', color: '#607D8B', project: project1 } as const;
const task4: Readonly<Task> = { id: 4, name: 'Meetings', color: '#FF9800', project: project2 } as const;
const task5: Readonly<Task> = { id: 5, name: 'Interview', color: '#9C27B0', project: project2 } as const;

const tasks: Array<Task> = [task1, task2, task3, task4, task5];

function findById(id: number) {
    return (item: Task | Project) => item.id === id;
}

export function getAllProjects(): Array<Project> {
    let projects: Array<Project> = tasks.filter(t => !!t.project).map(t => t.project as Project);
    return [...new Set(projects)];
}

export function getTasksInProject(projectId: number): Array<Task> {
    return tasks.filter(t => t.project?.id === projectId);
}

export function getProjectById(projectId: number): Project {
    const projects = getAllProjects();
    return projects.find(findById(projectId)) || projects[0];
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
