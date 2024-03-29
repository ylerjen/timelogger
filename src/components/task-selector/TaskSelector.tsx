import { Dropdown } from 'primereact/dropdown';
import { Task } from '../../models/Task';

export interface Prop {
    selectedCallback: (taskId: number) => void;
    tasklist: Array<Task>;
}

export function TaskSelector(p: Prop): JSX.Element {
    let selectedTask: Task | undefined;

    function setSelectedTask(task: Task) {
        selectedTask = task;
        p.selectedCallback(task.id!);
    }

    return (
        <div>
            <Dropdown
                value={selectedTask}
                options={p.tasklist.filter(t => !t.isArchived)}
                optionLabel="name"
                style={{ minWidth: '14rem' }}
                placeholder={'Select a Task'}
                onChange={event => setSelectedTask(event.value)} />
        </div>
    );
}
