import { InputText } from 'primereact/inputtext';
import { ColorPicker, ColorPickerChangeParams } from 'primereact/colorpicker';
import { DataTable, DataTableRowEditCompleteParams } from 'primereact/datatable';
import { Column, ColumnEditorOptions, ColumnBodyOptions } from 'primereact/column';
import { Task } from '../../models/Task';
import { PAUSE } from '../../services/db-service';

export interface Prop {
    tasks: Array<Task>;
    editTask: (e: DataTableRowEditCompleteParams) => void;
}

export function TaskList(prop: Prop): JSX.Element {
    function textEditor(options: ColumnEditorOptions) {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback?.((e.target as HTMLInputElement).value)} />;
    }

    function colorEditor(options: ColumnEditorOptions) {
        const changeCallback = (e: ColorPickerChangeParams) => {
            // const value = options.editorCallback?.((e.target as HTMLInputElement).value);
            let value = (e.target as HTMLInputElement).value;
            value = value ? '#' + value : value;
            options.editorCallback?.(value);
        };
        return <ColorPicker value={options.value} onChange={changeCallback} />;
    }

    const colorViewerTpl = (rowData: any, options: ColumnBodyOptions) =>
        <span style={{ display: 'inline-block', width: '1em', height: '1em', backgroundColor: rowData.color }} title={rowData.value} className="product-image" />;

    return (
        <DataTable value={prop.tasks.filter(t => t.id !== PAUSE.id)} editMode="row" dataKey="id" onRowEditComplete={prop.editTask} responsiveLayout="scroll">
            <Column field="id" header="id"></Column>
            <Column field="name" header="Name" editor={(options) => textEditor(options)}></Column>
            <Column field="color" body={colorViewerTpl} header="Color" editor={(options) => colorEditor(options)}></Column>
            <Column field="projectId" header="Project id"></Column>
            <Column rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
        </DataTable>
    );
}
