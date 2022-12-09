import { useState, useRef, LegacyRef } from 'react';
import { format } from 'date-fns';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Timeline } from 'primereact/timeline';
import { TaskActions } from '../../components/task-actions/TaskActions';
import { formatTimeDiff, timeDifference } from '../../helpers/TimeHelper';
import './TodayPage.css';
import { TimeLog } from '../../models/TimeLog';
import { countPausedDuration, countWorkedDuration, endTask, getTimeLogs, startTask } from '../../services/time-service';
 
export function TodayPage() {
    // const s = useState({ isWorking: false, isPausing: false });
    const s = {
        isWorking: true,
        isPausing: false,
        onStartWorkClick: () => {
            startTask(1);
        },
        onEndWorkClick: () => {
            endTask();
        },
        onPauseWorkClick: () => {
            alert('start work');
        },
        onContinueWorkClick: () => {
            alert('start work');
        }
    };
    let menuItems = [
        {label: 'Change Task', icon: 'pi pi-pencil'},
        {label: 'Edit Working Time', icon: 'pi pi-clock'},
        {label: 'Split Up', icon: 'pi pi-clone'},
        {label: 'Delete', icon: 'pi pi-trash'}
    ];

    const timeLogs: Array<TimeLog> = getTimeLogs();

    let menu= useRef(null);

    return (<section>
        <h1>Today</h1>
        <div className="resume-zone">
            <div className='resume-col'>
                <div className="time-resume">{formatTimeDiff(countWorkedDuration(timeLogs))}</div>
                <div className="label-resume">Worked</div>
            </div>
            <div className='resume-col'>
                <div className="time-resume">{formatTimeDiff(countPausedDuration(timeLogs))}</div>
                <div className="label-resume">Paused</div>
            </div>
        </div>
        <div className="today-actions">
            <TaskActions {...s}></TaskActions>
        </div>
        <div className="today-timeline">
            <Timeline value={timeLogs}
                marker={(item: TimeLog) => <i className="pi pi-circle-fill" style={{ color: item.task.color }}></i>}
                opposite={(item: TimeLog) => <div><div className='muted'>{item.task.project?.name || 'XXX'}</div><div>{item.task.name}</div></div>}
                content={(item: TimeLog) => 
                <div className="timeline-content">
                    <div>
                        <div className="muted"><span>{format(item.start, 'HH:mm')}</span> - <span>{item.end ? format(item.end, 'HH:mm') : 'OPEN'}</span></div>
                        <div>{formatTimeDiff(timeDifference(item.start, item.end))}</div>
                    </div>
                    <div className="today-task-actions">                        
                        <Menu model={menuItems} popup ref={menu} />
                        <Button label="Show" icon="pi pi-bars" className='p-button p-component p-button-rounded p-button-outlined p-button-icon-only' onClick={(event) => (menu.current as any).toggle(event)}/>
                    </div>
                </div>}
            />
        </div>
        <Button icon="pi pi-plus" label="Add Working Hours" className="p-button-secondary p-button-text" />
    </section>);
}
