import { countWorkedDurationInSeconds, formatTimeDiff, groupLogsByTasks, transformSecondsIntoDuration } from '../../helpers/TimeHelper';
import { TimeLog } from '../../models/TimeLog';

export interface Prop {
    timelogs: Array<TimeLog>;
}

export function TasksSummary(p: Prop): JSX.Element {
    const byTasks = groupLogsByTasks(p.timelogs);
    const keys = [];
    for (let k of byTasks.keys()) {
        keys.push([k, byTasks.get(k)![0].task?.name]);
    }

    return <table>
        <thead><tr><th>Task</th><th>Hours</th></tr></thead>
        <tbody>{keys.map(k => <tr key={k[0]}>
            <td>{k[1]}</td>
            <td className='pl-5'>{formatTimeDiff(transformSecondsIntoDuration(countWorkedDurationInSeconds(byTasks.get(k[0]!)!)))}</td></tr>)}</tbody>
    </table>;
}
