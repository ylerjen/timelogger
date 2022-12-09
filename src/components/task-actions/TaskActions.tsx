import { Button } from "primereact/button";
import './TaskActions.css';

interface Props {
    isWorking: boolean;
    isPausing: boolean;
    onStartWorkClick: () => void;
    onEndWorkClick: () => void;
    onPauseWorkClick: () => void;
    onContinueWorkClick: () => void;
}

export function TaskActions(p: Props): JSX.Element {
    const onStartWorkClick = () => '';
    if (!p.isWorking && !p.isPausing) {
        return (<div>
            <Button label="Start work" icon="pi pi-play" onClick={onStartWorkClick} />
        </div>);
    } else if (p.isPausing) {
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
