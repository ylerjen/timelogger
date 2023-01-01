import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Task } from '../../models/Task';

export interface Prop {
    tasks: Array<Task>;
}

export function TaskList(prop: Prop): JSX.Element {
    return (
    <div>
hello
        <DataTable value={prop.tasks}>
            <Column field="id" header="#"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="color" header="Color"></Column>
            <Column field="projectId" header="Project id"></Column>
        </DataTable>
    </div>
    );
}
