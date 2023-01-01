import React from 'react';
import { format } from 'date-fns';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { MenuItem } from 'primereact/menuitem';
import { TaskActions } from '../../components/task-actions/TaskActions';
import { TaskSelector } from '../../components/task-selector/TaskSelector';
import { formatTimeDiff, timeDifference } from '../../helpers/TimeHelper';
import { TimeLog } from '../../models/TimeLog';
import { WorkingStateType } from '../../models/WorkingState';
import { changeTaskForEntry, endPause, endTask, getTimeLogs, startPause, startTask } from '../../services/time-service';
import { HoursSummary } from '../../components/hours-summary/hours-summary';
import './TodayPage.css';

interface State {
    isVisible: boolean;
    workingState: WorkingStateType;
    timeLogs: Array<TimeLog>;
}

interface Prop {
}

export class TodayPage extends React.Component<Prop, State> {
    isVisible = false;

    now = Date.now();

    state: State;

    menu: any;

    processedEntry = 0;

    constructor(props: Prop) {
        super(props);
        this.menu = React.createRef();
        this.state = {
            isVisible: false,
            workingState: WorkingStateType.off,
            timeLogs: getTimeLogs(),
        };
    }

    menuItemsFactory(entryId: number): Array<MenuItem> {
        return [
            {
                label: 'Change Task' + entryId,
                icon: 'pi pi-pencil',
                command: () => {
                    this.processedEntry = entryId;
                    this.setState({
                        ...this.state,
                        isVisible: true,
                    });
                },
            },
            { label: 'Edit Working Time', icon: 'pi pi-clock' },
            { label: 'Split Up', icon: 'pi pi-clone' },
            { label: 'Delete', icon: 'pi pi-trash' }
        ];
    }

    onStartWorkClick(): void {
        startTask(1);
        this.setState({
            ...this.state,
            workingState: WorkingStateType.working,
        });
    }

    onEndWorkClick(): void {
        endTask();
        this.setState({
            ...this.state,
            workingState: WorkingStateType.off,
        });
    }

    onPauseWorkClick(): void {
        startPause();
        this.setState({
            ...this.state,
            workingState: WorkingStateType.pausing,
        });
    }

    onContinueWorkClick(): void {
        endPause();
        this.setState({
            ...this.state,
            workingState: WorkingStateType.working,
        });
    }

    changeTask(taskId: number): void {
        changeTaskForEntry(this.processedEntry, taskId);

        console.log('new logs', getTimeLogs())

        this.setState({
            ...this.state,
            isVisible: false,
            timeLogs: getTimeLogs(),

        });
        this.processedEntry = 0;
    }

    render(): JSX.Element {
        return (<section>
            <h1>Today</h1>
            <h2 className='today-date'>{format(this.now, 'dd-MM-Y')}</h2>
            <HoursSummary timeLogs={this.state.timeLogs}></HoursSummary>
            <div className="today-actions">
                <TaskActions
                    onContinueWorkClick={this.onContinueWorkClick.bind(this)}
                    onEndWorkClick={this.onEndWorkClick.bind(this)}
                    onPauseWorkClick={this.onPauseWorkClick.bind(this)}
                    onStartWorkClick={this.onStartWorkClick.bind(this)}
                    workingState={this.state.workingState}
                ></TaskActions>
            </div>
            <div className="today-timeline">
                <Timeline value={this.state.timeLogs}
                    marker={(item: TimeLog) => <i className="pi pi-circle-fill" style={{ color: item.task.color }}></i>}
                    opposite={(item: TimeLog) => <div><div className='muted'>{item.task.project?.name || 'XXX'}</div><div>{item.task.name}</div></div>}
                    content={(item: TimeLog) =>
                        <div className="timeline-content">
                            <div>
                                <div className="muted"><span>{format(item.start, 'HH:mm')}</span> - <span>{item.end ? format(item.end, 'HH:mm') : 'OPEN'}</span></div>
                                <div>{formatTimeDiff(timeDifference(item.start, item.end))}</div>
                            </div>
                            <div className="today-task-actions">
                                <Menu model={this.menuItemsFactory(item.id)} popup ref={this.menu} />
                                <Button label="Show" icon="pi pi-bars" className='p-button p-component p-button-rounded p-button-outlined p-button-icon-only' onClick={(event) => (this.menu.current as any).toggle(event)} />
                            </div>
                        </div>}
                />
            </div>
            <Button icon="pi pi-plus" label="Add Working Hours" className="p-button-secondary p-button-text" />
            <Dialog header="Header" visible={this.state.isVisible} style={{ width: '50vw' }} /*('displayBasic')}*/ onHide={() => this.setState({
                ...this.state,
                isVisible: false,
            })}>
                <TaskSelector selectedCallback={this.changeTask.bind(this)}></TaskSelector>
            </Dialog>
        </section>);
    }
}
