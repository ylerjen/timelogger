import { Project } from "./Project";

export interface Task {
    id?: number;
    name: string;
    color: string;
    projectId?: number;
    project?: Project;
}
