import { formatTimeDiff } from "../../helpers/TimeHelper";
import { countPausedDuration, countWorkedDuration } from "../../services/time-service";

export function HoursSummary(prop: any): JSX.Element {
    return (
        <div className="resume-zone">
            <div className='resume-col'>
                <div className="time-resume">{formatTimeDiff(countWorkedDuration(prop.timeLogs))}</div>
                <div className="label-resume">Worked</div>
            </div>
            <div className='resume-col'>
                <div className="time-resume">{formatTimeDiff(countPausedDuration(prop.timeLogs))}</div>
                <div className="label-resume">Paused</div>
            </div>
        </div>
    );
}
