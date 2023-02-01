import { TimeLog } from '../models/TimeLog';
import { TimeLogEntity } from '../models/TimeLogEntity';

export function mapTimeLogToEntity(t: TimeLog): TimeLogEntity {
    return {
        id: t.id,
        start: t.start.getTime(),
        end: t.end ? t.end.getTime() : void 0,
        taskId: t.taskId,
    };
}

export function mapEntityToTimelog(t: TimeLogEntity): TimeLog {
    return {
        id: t.id,
        start: new Date(t.start),
        end: t.end ? new Date(t.end) : void 0,
        taskId: t.taskId,
    };
}
