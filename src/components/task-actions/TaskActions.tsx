import { Button } from 'primereact/button';
import { TimeLog } from '../../models/TimeLog';
import { PAUSE } from '../../services/db-service';
import './TaskActions.css';

interface Props {
    timelogs: Array<TimeLog>;
    onStartWorkClick: () => void;
    onEndWorkClick: () => void;
    onPauseWorkClick: () => void;
    onContinueWorkClick: () => void;
    onChangeTask: () => void;
}

export function TaskActions(p: Props): JSX.Element {
    const isPausing = p.timelogs.some(t => t.taskId === PAUSE.id && !t.end);
    const isWorking = p.timelogs.some(t => t.taskId !== PAUSE.id && !t.end);
    if (isWorking) {
        return <div>
            <div><Button label="Change Task" icon="pi pi-pencil" className="mb-2" onClick={p.onChangeTask} /></div>
            <Button label="End work" icon="pi pi-power-off" className="me-2" onClick={p.onEndWorkClick} />
            <Button label="Pause work" icon="pi pi-pause" onClick={p.onPauseWorkClick} />
        </div>;
    } else if (isPausing) {
        return (
            <Button label="Continue" icon="pi pi-play" onClick={p.onContinueWorkClick} />
        );
    }

    return (
        <Button label="Start work" icon="pi pi-play" onClick={p.onStartWorkClick} />
    );
}
