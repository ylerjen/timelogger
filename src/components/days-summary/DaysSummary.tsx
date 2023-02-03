import { countWorkedDurationInSeconds, formatTimeDiff, groupLogsByDay, groupLogsByTasks, transformSecondsIntoDuration } from '../../helpers/TimeHelper';
import { TimeLog } from '../../models/TimeLog';

export interface Prop {
    timelogs: Array<TimeLog>;
}

export function DaysSummary(p: Prop): JSX.Element {
    const daysLogged: Array<[string, Array<TimeLog>]> = [];
    groupLogsByDay(p.timelogs).forEach((val, key) => daysLogged.push([key, val]));

    return <table>
        <thead><tr><th>Day</th><th>Hours</th></tr></thead>
        <tbody>{daysLogged.map(arr => <tr key={arr[0]}>
            <td>{arr[0]}</td>
            <td>{formatTimeDiff(transformSecondsIntoDuration(countWorkedDurationInSeconds(arr[1])))}</td>
        </tr>)}
        </tbody>
    </table>;
}
