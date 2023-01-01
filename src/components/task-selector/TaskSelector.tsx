import { CascadeSelect } from 'primereact/cascadeselect';
import { SelectItemOptionsType } from 'primereact/selectitem';
import { getAllProjects, getTasksInProject } from '../../services/project-service';

export interface Prop {
    selectedCallback: (taskId: number) => void;
}

export function TaskSelector(p: Prop): JSX.Element {
    const projects = getAllProjects();
    let tasks: SelectItemOptionsType = [];
    projects.forEach(p => {
        const projectTasks = getTasksInProject(p.id!);

        const pEntry = {
            name: p.name,
            code: p.id,
            tasks: projectTasks.map(t => ({ name: t.name, code: t.id })),
        }
        tasks.push(pEntry as any)
    });
 
    let selectedCity: SelectItemOptionsType | undefined;
    function setSelectedCity(val: SelectItemOptionsType) {
        selectedCity = val;
        p.selectedCallback((val as any).code);
    }

    return (
        <div>
            <CascadeSelect
                value={selectedCity}
                options={tasks}
                optionLabel={"name"}
                optionGroupLabel={"name"}
                optionGroupChildren={['tasks']}
                style={{ minWidth: '14rem' }}
                placeholder={"Select a Task"}
                onChange={event => setSelectedCity(event.value)} />
        </div>
    );
}
