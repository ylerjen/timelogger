import { useState } from 'react';
import { format } from 'date-fns';
import { Timeline } from 'primereact/timeline';
import { TaskActions } from '../../components/task-actions/TaskActions';
import './TodayPage.css';
import { timeDifference } from '../../helpers/TimeHelper';

export function TodayPage() {

    // const s = useState({ isWorking: false, isPausing: false });
    const s = {
        isWorking: true,
        isPausing: false,
        onStartWorkClick: () => {
            alert('start work');
        },
        onEndWorkClick: () => {
            alert('start work');
        },
        onPauseWorkClick: () => {
            alert('start work');
        },
        onContinueWorkClick: () => {
            alert('start work');
        }
    };


    const events = [
        { project: 'VA', task: 'PRJ128', start: new Date(2022,10,7,8,30), end: new Date(2022,10,7,11, 0), color: '#9C27B0' },
        { project: 'VA', task: 'Meeting', start: new Date(2022,10,7,11,0), end: new Date(2022,10,7,12,0), color: '#673AB7' },
        { project: 'VA', task: 'Pause', start: new Date(2022,10,7,12,0), end: new Date(2022,10,7,13,0), color: '#FF9800' },
        { project: 'VA', task: 'PRJ128', start: new Date(2022,10,7,13,0), color: '#607D8B' }
    ];

    return (<section>
        <h1>Today</h1>
        <div className="resume-zone">
            <div className='resume-col'>
                <div className="time-resume">0h 00m</div>
                <div className="label-resume">Worked</div>
            </div>
            <div className='resume-col'>
                <div className="time-resume">0h 00m</div>
                <div className="label-resume">Paused</div>
            </div>
        </div>
        <div className="today-actions">
            <TaskActions {...s}></TaskActions>
        </div>
        <div className="today-timeline">
            <Timeline value={events}
                marker={(item) => <i className="pi pi-circle-fill" style={{color: item.color}}></i>}
                opposite={(item) => <div><div className='muted'>{item.project}</div><div>{item.task}</div></div>}
                content={(item) => <div><div className='muted'><span>{format(item.start, 'HH:mm')}</span> - <span>{item.end ? format(item.end, 'HH:mm') : 'OPEN'}</span></div><div>{timeDifference(item.start, item.end)}</div></div>}
            />
        </div>
    </section>);
}
