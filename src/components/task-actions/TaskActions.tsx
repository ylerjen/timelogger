import { Button } from "primereact/button";
import { WorkingStateType } from '../../models/WorkingState';
import './TaskActions.css';

interface Props {
    workingState: WorkingStateType;
    onStartWorkClick: () => void;
    onEndWorkClick: () => void;
    onPauseWorkClick: () => void;
    onContinueWorkClick: () => void;
}

export function TaskActions(p: Props): JSX.Element {
    const onStartWorkClick = () => '';
    if (WorkingStateType.off === p.workingState) {
        return (<div>
            <Button label="Start work" icon="pi pi-play" onClick={onStartWorkClick} />
        </div>);
    } else if (p.workingState === WorkingStateType.pausing) {
        return (<div>
            <Button label="Continue" icon="pi pi-play" onClick={p.onContinueWorkClick} />
        </div>);
    } else {
        return (<div>
            <Button label="End work" icon="pi pi-power-off" onClick={p.onEndWorkClick} />
            <Button label="Pause work" icon="pi pi-pause" onClick={p.onPauseWorkClick} />
        </div>);
    }
}
