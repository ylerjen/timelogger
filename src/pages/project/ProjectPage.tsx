import React from 'react';
import { DataTableRowEditCompleteParams } from 'primereact/datatable';
import { Task } from '../../models/Task';
import { TaskList } from '../../components/task-list/TaskList';
import { getAllTasks, saveTask } from '../../services/project-service';

interface Prop { } // eslint-disable-line

interface State {
    taskList: Array<Task>;
}

export class ProjectPage extends React.Component<Prop, State> {
    state: State = { taskList: [] };

    componentDidMount(): void {
        getAllTasks().then(taskList => this.setState({ taskList }));
    }

    editTask(e: DataTableRowEditCompleteParams): void {
        const task: Task = e.newData;
        const taskToUpdate = this.state.taskList.find(t => t.id === task.id);
        if (!taskToUpdate) {
            return;
        }
        taskToUpdate.color = task.color;
        taskToUpdate.name = task.name;
        saveTask(taskToUpdate).then(
            t => this.setState(s => ({
                taskList: [...s.taskList],
            }))
        );
    }

    render(): JSX.Element {
        return (
            <section>
                <h1>Projects page</h1>
                <TaskList tasks={this.state.taskList} editTask={this.editTask.bind(this)}></TaskList>
            </section>
        );
    }
}
