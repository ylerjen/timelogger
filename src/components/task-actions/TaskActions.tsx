import { Button } from "primereact/button";
import { TimeLog } from "../../models/TimeLog";
import { PAUSE } from "../../services/db-service";
import './TaskActions.css';

interface Props {
    timelogs: Array<TimeLog>;
    onStartWorkClick: () => void;
    onEndWorkClick: () => void;
    onPauseWorkClick: () => void;
    onContinueWorkClick: () => void;
}

export function TaskActions(p: Props): JSX.Element {
    const isPausing = p.timelogs.some(t => t.taskId === PAUSE.id && !t.end);
    const isWorking = p.timelogs.some(t => t.taskId !== PAUSE.id && !t.end);
    if (isWorking) {
        return (<div>
            <Button label="End work" icon="pi pi-power-off" onClick={p.onEndWorkClick} />
            <Button label="Pause work" icon="pi pi-pause" onClick={p.onPauseWorkClick} />
        </div>);
    } else if (isPausing) {
        return (<div>
            <Button label="Continue" icon="pi pi-play" onClick={p.onContinueWorkClick} />
        </div>);
    } else {
        return (<div>
            <Button label="Start work" icon="pi pi-play" onClick={p.onStartWorkClick} />
        </div>);
    }
}
