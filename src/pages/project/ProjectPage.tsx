import React from "react";
import { DataTableRowEditCompleteParams } from "primereact/datatable";
import { Task } from "../../models/Task";
import { TaskList } from "../../components/task-list/TaskList";
import { getAllTasks } from "../../services/project-service";

interface Prop {

}

interface State {
    taskList: Array<Task>;
}

export class ProjectPage extends React.Component<Prop, State>  {

    state = { taskList: [] };

    componentDidMount(): void {
        getAllTasks().then(taskList => this.setState({taskList}));
    }

    editTask(e: DataTableRowEditCompleteParams): void {
        console.log(e);
    }

    render(): JSX.Element {
        return (
            <section>
                <h1>Projects page</h1>
                <TaskList tasks={this.state.taskList } editTask={this.editTask.bind(this)}></TaskList>
            </section>
        );
    }
}
