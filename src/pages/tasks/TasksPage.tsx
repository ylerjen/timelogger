import React from 'react';
import { DataTableRowEditCompleteParams } from 'primereact/datatable';
import { Task } from '../../models/Task';
import { TaskList } from '../../components/task-list/TaskList';
import { getAllTasks, saveTask } from '../../services/project-service';
import { Button } from 'primereact/button';

interface Prop { } //  eslint-disable-line

interface State {
    taskList: Array<Task>;
}

export class TasksPage extends React.Component<Prop, State> {
    state: State = { taskList: [] };

    componentDidMount(): void {
        getAllTasks().then(taskList => this.setState({ taskList }));
    }

    addTask(): void {
        const task: Task = {
            color: '#fff',
            name: 'new task',
        };
        saveTask(task).then(
            t => this.setState(s => ({
                taskList: [
                    ...s.taskList,
                    t,
                ],
            }))
        );
    }

    editTask(e: DataTableRowEditCompleteParams): void {
        const task: Task = e.newData;
        this.updateTask(task.id!, { color: task.color, name: task.name, isArchived: task.isArchived });
    }

    deleteTask(id: number): void {
        this.updateTask(id, { isArchived: true });
    }

    updateTask(id: number, val: Partial<Task>): void {
        const tasklist = this.state.taskList;
        const idx = tasklist.findIndex(t => t.id === id);
        if (idx === -1) {
            return;
        }
        tasklist[idx] = {
            ...tasklist[idx],
            ...val,
        };

        saveTask(tasklist[idx]).then(
            _t => this.setState(s => ({
                taskList: [...s.taskList],
            }))
        );
    }

    render(): JSX.Element {
        return (
            <section>
                <h1>Projects page</h1>
                <Button
                    label="Add new task"
                    icon="pi pi-plus"
                    className='p-button p-component p-button-rounded p-button-outlined'
                    onClick={this.addTask.bind(this)}
                />
                <TaskList
                    withArchived={false}
                    tasks={this.state.taskList}
                    editTask={this.editTask.bind(this)}
                    deleteTask={this.deleteTask.bind(this)}
                ></TaskList>
            </section>
        );
    }
}
