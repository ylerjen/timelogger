import { InputText } from 'primereact/inputtext';
import { ColorPicker, ColorPickerChangeParams } from 'primereact/colorpicker';
import { DataTable, DataTableRowEditCompleteParams } from 'primereact/datatable';
import { Column, ColumnEditorOptions, ColumnBodyOptions } from 'primereact/column';
import { Task } from '../../models/Task';
import { PAUSE } from '../../services/db-service';
import { Button } from 'primereact/button';

export interface Prop {
    withArchived: boolean;
    tasks: Array<Task>;
    editTask: (e: DataTableRowEditCompleteParams) => void;
    deleteTask: (id: number) => void;
}

export function TaskList(prop: Prop): JSX.Element {
    function textEditor(options: ColumnEditorOptions) {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback?.((e.target as HTMLInputElement).value)} />;
    }

    function colorEditor(options: ColumnEditorOptions) {
        const changeCallback = (e: ColorPickerChangeParams) => {
            let value = (e.target as HTMLInputElement).value;
            value = value ? '#' + value : value;
            options.editorCallback?.(value);
        };
        return <ColorPicker value={options.value} onChange={changeCallback} />;
    }

    const deleteTemplate = (rowData: Task, _column: ColumnBodyOptions) => {
        return <div>
            <Button onClick={() => prop.deleteTask(rowData.id!)} className="p-button p-component p-button-rounded p-button-danger p-button-text p-button-icon-only" icon="pi pi-trash"></Button>
        </div>;
    };

    const colorViewerTpl = (rowData: any, _options: ColumnBodyOptions) =>
        <span style={{ display: 'inline-block', width: '1em', height: '1em', backgroundColor: rowData.color }} title={rowData.value} className="product-image" />;

    const tasksToShow = prop.tasks.filter(t => {
        let condition = t.id !== PAUSE.id;
        if (!prop.withArchived) {
            condition = condition && !t.isArchived;
        }
        return condition;
    });

    return (
        <DataTable value={tasksToShow} editMode="row" dataKey="id" onRowEditComplete={prop.editTask} responsiveLayout="scroll">
            <Column field="id" header="id"></Column>
            <Column field="name" header="Name" editor={(options) => textEditor(options)}></Column>
            <Column field="color" body={colorViewerTpl} header="Color" editor={(options) => colorEditor(options)}></Column>
            <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
            <Column body={deleteTemplate}></Column>
        </DataTable>
    );
}
