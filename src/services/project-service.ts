import { Project } from "../models/Project";
import { Task } from "../models/Task";

const task1: Task = { id: 1, name: 'Task 1' };
const project1: Project = { id: 1, name: 'Project 1', tasks: [task1] };
const projects: Array<Project> = [project1];

export function getAllProjects(): Array<Project> {
    return projects;
}

export function getTasksByProject(projectId: number): Array<Task> {
    return project1.tasks;
}
