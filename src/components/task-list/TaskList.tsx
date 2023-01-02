import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ColorPicker } from 'primereact/colorpicker';
import { DataTable, DataTableRowEditCompleteParams } from 'primereact/datatable';
import { Task } from '../../models/Task';
import { PAUSE } from '../../services/db-service';

export interface Prop {
    tasks: Array<Task>;
    editTask: (e: DataTableRowEditCompleteParams) => void;
}

export function TaskList(prop: Prop): JSX.Element {
    const textEditor = (options: ColumnEditorOptions) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback?.((e.target as HTMLInputElement).value)} />;
    }

    const colorEditor = (options: ColumnEditorOptions) => {
        return <ColorPicker value={options.value} onChange={(e) => options.editorCallback?.((e.target as HTMLInputElement).value)}/>
    }

    return (
        <DataTable value={prop.tasks.filter(t => t.id !== PAUSE.id)} editMode="row" dataKey="id" onRowEditComplete={prop.editTask} responsiveLayout="scroll">
            <Column field="id" header="#"></Column>
            <Column field="name" header="Name" editor={(options) => textEditor(options)}></Column>
            <Column field="color" header="Color" editor={(options) => colorEditor(options)}></Column>
            <Column field="projectId" header="Project id"></Column>
            <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable>
    );
}
