import { useState, useRef, LegacyRef } from 'react';
import { format } from 'date-fns';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Timeline } from 'primereact/timeline';
import { TaskActions } from '../../components/task-actions/TaskActions';
import { timeDifference } from '../../helpers/TimeHelper';
import './TodayPage.css';
 

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
    let menuItems = [
        {label: 'Change Task', icon: 'pi pi-pencil'},
        {label: 'Edit Working Time', icon: 'pi pi-clock'},
        {label: 'Split Up', icon: 'pi pi-clone'},
        {label: 'Delete', icon: 'pi pi-trash'}
    ];

    const events = [
        { project: 'VA', task: 'PRJ128', start: new Date(2022, 10, 7, 8, 30), end: new Date(2022, 10, 7, 11, 0), color: '#9C27B0' },
        { project: 'VA', task: 'Meeting', start: new Date(2022, 10, 7, 11, 0), end: new Date(2022, 10, 7, 12, 0), color: '#673AB7' },
        { project: 'VA', task: 'Pause', start: new Date(2022, 10, 7, 12, 0), end: new Date(2022, 10, 7, 13, 0), color: '#FF9800' },
        { project: 'VA', task: 'PRJ128', start: new Date(2022, 10, 7, 13, 0), color: '#607D8B' }
    ];

    let menu= useRef(null);

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
                marker={(item) => <i className="pi pi-circle-fill" style={{ color: item.color }}></i>}
                opposite={(item) => <div><div className='muted'>{item.project}</div><div>{item.task}</div></div>}
                content={(item) => 
                <div className="timeline-content">
                    <div>
                        <div className="muted"><span>{format(item.start, 'HH:mm')}</span> - <span>{item.end ? format(item.end, 'HH:mm') : 'OPEN'}</span></div>
                        <div>{timeDifference(item.start, item.end)}</div>
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
