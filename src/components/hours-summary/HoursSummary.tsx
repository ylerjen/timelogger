import { countPausedDurationInSeconds, countSuppTimeDurationInSeconds, countWorkedDurationInSeconds, formatTimeDiff, transformSecondsIntoDuration } from '../../helpers/TimeHelper';
import { TimeLog } from '../../models/TimeLog';
import './HoursSummary.css';

interface Prop {
    timeLogs: Array<TimeLog>;
}

export function HoursSummary(prop: Prop): JSX.Element {
    const workedDuration = transformSecondsIntoDuration(countWorkedDurationInSeconds(prop.timeLogs));
    const pausedDuration = transformSecondsIntoDuration(countSuppTimeDurationInSeconds(prop.timeLogs));
    const suppTimeDuration = transformSecondsIntoDuration(countPausedDurationInSeconds(prop.timeLogs));

    return (
        <div className="resume-zone">
            <div className='resume-col'>
                <div className="time-resume">{formatTimeDiff(workedDuration)}</div>
                <div className="label-resume">Worked</div>
            </div>
            <div className='resume-col'>
                <div className="time-resume">{formatTimeDiff(pausedDuration)}</div>
                <div className="label-resume">Supp.</div>
            </div>
            <div className='resume-col'>
                <div className="time-resume">{formatTimeDiff(suppTimeDuration)}</div>
                <div className="label-resume">Paused</div>
            </div>
        </div>
    );
}
