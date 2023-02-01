import React from 'react';
import { format } from 'date-fns';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import { MenuItem } from 'primereact/menuitem';
import { TimeLog } from '../../models/TimeLog';
import { TaskActions } from '../../components/task-actions/TaskActions';
import { TaskSelector } from '../../components/task-selector/TaskSelector';
import { HoursSummary } from '../../components/hours-summary/HoursSummary';
import { formatTimeDiff, timeDifference } from '../../helpers/TimeHelper';
import { PAUSE } from '../../services/db-service';
import { getAllTasks } from '../../services/project-service';
import { changeTaskForEntry, deleteLogItem, endPause, endTask, getTimeLogs, startPause, startTask } from '../../services/time-service';
import { Task } from '../../models/Task';
import './TodayPage.css';

interface State {
    /**
     * Inform whether the modal is visible or not
     */
    isVisible: boolean;
    /**
     * All the existing timelogs for the day
     */
    timeLogs: Array<TimeLog>;
    /**
     * All tasks available
     */
    tasks: Array<Task>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Prop {
}

export class TodayPage extends React.Component<Prop, State> {
    isVisible = false;

    now = Date.now();

    state: State;

    menu: any;

    processedEntry: number | null = null;

    /**
     * This property will hold the callback to be called when select task modal is closed
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dialogCallback: (taskId: number) => void = (_taskId: number) => { };

    constructor(props: Prop) {
        super(props);
        this.menu = React.createRef();
        this.state = {
            isVisible: false,
            timeLogs: [],
            tasks: [],
        };
    }

    componentDidMount(): void {
        this.fetchTasks().then(this.fetchLogs.bind(this));
    }

    menuItemsFactory(logEntryId: number): Array<MenuItem> {
        return [
            {
                label: 'Change Task' + logEntryId,
                icon: 'pi pi-pencil',
                command: () => {
                    this.processedEntry = logEntryId;
                    this.dialogCallback = this.changeTask;
                    this.setState({
                        isVisible: true,
                    });
                },
            },
            { label: 'Edit Working Time', icon: 'pi pi-clock' },
            { label: 'Split Up', icon: 'pi pi-clone' },
            {
                label: 'Delete',
                icon: 'pi pi-trash',
                command: () => {
                    this.deleteTimeLog(logEntryId);
                    this.setState(s => ({
                        timeLogs: s.timeLogs.filter(l => l.id !== logEntryId),
                    }));
                },
            },
        ];
    }

    fetchLogs(tasks?: Array<Task>): void {
        if (!tasks) {
            tasks = this.state.tasks || [];
        }

        getTimeLogs(new Date())
            .then(timeLogs => {
                timeLogs = this.setTasksInLogs(tasks!, timeLogs);
                this.setState({ timeLogs });
            });
    }

    fetchTasks(): Promise<Array<Task>> {
        return getAllTasks()
            .then(tasks => {
                const timeLogs = this.setTasksInLogs(this.state.tasks, this.state.timeLogs);
                this.setState({ tasks, timeLogs });
                return Promise.resolve(tasks);
            });
    }

    setTasksInLogs(tasks: Array<Task>, logs: Array<TimeLog>): Array<TimeLog> {
        if (!tasks.length || !logs.length) {
            return [];
        }
        return logs.map(log => {
            log.task = tasks.find(t => t.id === log.taskId);
            return log;
        });
    }

    getCurrentWorkingLog(): TimeLog | undefined {
        return this.state.timeLogs.find(l => !l.end);
    }

    deleteTimeLog(logId: number): void {
        deleteLogItem(logId);
        this.fetchLogs();
    }

    onStartWorkClick(): void {
        this.dialogCallback = this.startTask;
        this.setState({
            isVisible: true,
        });
    }

    onEndWorkClick(): void {
        const log = this.getCurrentWorkingLog();
        if (!log) {
            return;
        }
        endTask(log).then(savedLog => {
            if (savedLog) {
                this.fetchLogs();
            }
        });
    }

    onPauseWorkClick(): void {
        startPause().then(savedLog => {
            if (savedLog) {
                this.fetchLogs();
            }
        });
    }

    onContinueWorkClick(): void {
        endPause().then(() => this.fetchLogs());
    }

    onStopAndStartNewTaskClick(): void {
        this.dialogCallback = this.stopCurrentTaskAndStartNew;
        this.setState({
            isVisible: true,
        });
    }

    stopCurrentTaskAndStartNew(taskId: number): void {
        const currentLog = this.getCurrentWorkingLog();

        endTask(currentLog)
            .then(() => startTask(taskId))
            .then(savedLog => {
                if (!savedLog) {
                    return;
                }
                this.setState({
                    isVisible: false,
                });
                this.fetchLogs();
            });
    }

    changeTask(taskId: number): void {
        if (this.processedEntry === null) {
            return;
        }
        changeTaskForEntry(this.processedEntry, taskId);
        this.setState({
            isVisible: false,
        });
        this.fetchLogs();
        this.processedEntry = null;
    }

    startTask(taskId: number): void {
        startTask(taskId).then(savedLog => {
            if (!savedLog) {
                return;
            }
            this.setState({
                isVisible: false,
            });
            this.fetchLogs();
        });
    }

    hideDialog(): void {
        this.setState({
            isVisible: false,
        });
    }

    render(): JSX.Element {
        const projectInfo = (log: TimeLog) => log.taskId === PAUSE.id ? '' : <span className='muted'>{/*log.task.project?.name ||*/ 'XXX'}</span>;
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
                    onChangeTask={this.onStopAndStartNewTaskClick.bind(this)}
                    timelogs={this.state.timeLogs}
                ></TaskActions>
            </div>
            <div className="today-timeline">
                <Timeline value={this.state.timeLogs}
                    marker={(item: TimeLog) => <i className="pi pi-circle-fill" style={{ color: item.task?.color }}></i>}
                    opposite={(item: TimeLog) => <div className="task-info">{projectInfo(item)}<span>{item.task?.name}</span></div>}
                    content={(log: TimeLog) =>
                        <div className="timeline-content">
                            <div className="task-info">
                                <div className="muted"><span>{format(log.start, 'HH:mm')}</span> - <span>{log.end ? format(log.end, 'HH:mm') : 'OPEN'}</span></div>
                                <div>{formatTimeDiff(timeDifference(log.start, log.end))}</div>
                            </div>
                            <div className="today-task-actions">
                                <Menu model={this.menuItemsFactory(log.id!)} popup ref={this.menu} />
                                <Button label="Show" icon="pi pi-bars" className='p-button p-component p-button-rounded p-button-outlined p-button-icon-only' onClick={(event) => (this.menu.current as any).toggle(event)} />
                            </div>
                        </div>
                    }
                />
            </div>
            <Button icon="pi pi-plus" label="Add Working Hours" className="p-button-secondary p-button-text" />
            <Dialog header="Header" visible={this.state.isVisible} style={{ width: '50vw' }} /*('displayBasic')}*/ onHide={this.hideDialog.bind(this)}>
                <TaskSelector selectedCallback={this.dialogCallback.bind(this)} tasklist={this.state.tasks}></TaskSelector>
            </Dialog>
        </section>);
    }
}
