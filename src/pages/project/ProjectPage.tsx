import React from "react";
import { TaskList } from "../../components/task-list/TaskList";
import { Task } from "../../models/Task";
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

    render(): JSX.Element {
        return (
            <section>
                <h1>Projects page</h1>
                <TaskList tasks={this.state.taskList }></TaskList>
            </section>
        );
    }
}
