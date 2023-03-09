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
import { getAllTasks } from '../../services/project-service';
import { changeLogTime, changeTaskForEntry, deleteLogItem, endPause, endTask, getTimeLogs, startPause, startTask } from '../../services/time-service';
import { Task } from '../../models/Task';
import { notifyMe } from '../../services/notification.service';
import { TimeManager } from '../../components/time-manager/TimeManager';
import './TodayPage.css';

interface State {
    /**
     * Inform whether the modal is visible or not
     */
    isTaskSwitchVisible: boolean;
    /**
     * Inform whether the modal to change time is visible or not
     */
    isTimeManagerVisible: boolean;
    /**
     * All the existing timelogs for the day
     */
    timeLogs: Array<TimeLog>;
    /**
     * All tasks available
     */
    tasks: Array<Task>;
    /**
     * Timestamp to update the UI every minutes and keep times up to date
     */
    timestamp: number;
    /**
     * Menu item of the task button clicked
     */
    taskChangeMenu: Array<MenuItem>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Prop {
}

export class TodayPage extends React.Component<Prop, State> {
    now = Date.now();

    state: State;

    menu = React.createRef<Menu>();

    processedEntry: number | null = null;

    timer: NodeJS.Timer | undefined;

    /**
     * This property will hold the callback to be called when select task modal is closed
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    dialogCallback: (taskId: number) => void = (_taskId: number) => { };

    constructor(props: Prop) {
        super(props);
        this.state = {
            isTaskSwitchVisible: false,
            isTimeManagerVisible: false,
            timeLogs: [],
            tasks: [],
            timestamp: Date.now(),
            taskChangeMenu: [],
        };
    }

    componentDidMount(): void {
        this.fetchTasks().then(this.fetchLogs.bind(this));
        this.timer = setInterval(() => this.setState({ timestamp: Date.now() }), 60 * 1000);
    }

    componentWillUnmount(): void {
        this.timer = void 0;
    }

    menuItemsFactory(logEntryId: number): Array<MenuItem> {
        return [
            {
                label: 'Change Task',
                icon: 'pi pi-pencil',
                command: () => {
                    this.processedEntry = logEntryId;
                    this.dialogCallback = this.changeTask;
                    this.setState({
                        isTaskSwitchVisible: true,
                    });
                },
            },
            {
                label: 'Edit Working Time',
                icon: 'pi pi-clock',
                command: () => {
                    this.processedEntry = logEntryId;
                    this.setState({
                        isTimeManagerVisible: true,
                    });
                },
            },
            { label: 'Split Up', icon: 'pi pi-clone', command: () => notifyMe('hell00') },
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
            isTaskSwitchVisible: true,
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
            isTaskSwitchVisible: true,
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
                    isTaskSwitchVisible: false,
                });
                this.fetchLogs();
            });
    }

    changeTask(taskId: number): void {
        debugger; // eslint-disable-line no-debugger
        if (this.processedEntry === null) {
            return;
        }
        changeTaskForEntry(this.processedEntry, taskId)
            .then(log => {
                this.setState({
                    isTaskSwitchVisible: false,
                });
                this.fetchLogs();
                this.processedEntry = null;
            });
    }

    startTask(taskId: number): void {
        startTask(taskId).then(savedLog => {
            if (!savedLog) {
                return;
            }
            this.setState({
                isTaskSwitchVisible: false,
            });
            this.fetchLogs();
        });
    }

    hideTaskSwitch(): void {
        this.setState({
            isTaskSwitchVisible: false,
        });
        this.processedEntry = null;
    }

    closeTimeManager(): void {
        this.setState({
            isTimeManagerVisible: false,
        });
        this.processedEntry = null;
    }

    changeTimeLogHours(start: Date, end: Date): void {
        console.log({ start, end });

        const log = this.state.timeLogs.find(l => l.id === this.processedEntry);
        if (!log) {
            this.processedEntry = null;
            return;
        }

        changeLogTime(log, start, log.end ? end : void 0)
            .then(log => {
                this.setState({
                    isTimeManagerVisible: false,
                });
                this.fetchLogs();
                this.processedEntry = null;
            });
    }

    render(): JSX.Element {
        return <section>
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
                    opposite={(item: TimeLog) => <div className="task-info">{item.task?.name}</div>}
                    content={(log: TimeLog) =>
                        <div className="timeline-content">
                            <div className="task-info">
                                <div>{formatTimeDiff(timeDifference(log.start, log.end))}</div>
                                <div className="muted">
                                    <span>{format(log.start, 'HH:mm')}</span> - <span>{log.end ? format(log.end, 'HH:mm') : 'OPEN'}</span>
                                </div>
                            </div>
                            <div className="today-task-actions">
                                <Button
                                    label="Show"
                                    icon="pi pi-bars"
                                    className='p-button p-component p-button-rounded p-button-outlined p-button-icon-only'
                                    onClick={event => {
                                        this.setState({ taskChangeMenu: this.menuItemsFactory(log.id!) });
                                        this.menu.current?.toggle(event);
                                    }}
                                />
                            </div>
                        </div>
                    }
                />
                <Menu model={this.state.taskChangeMenu} popup ref={this.menu} />
            </div>
            <Button icon="pi pi-plus" label="Add Working Hours" className="p-button-secondary p-button-text" />
            <Dialog header="Header"
                visible={this.state.isTaskSwitchVisible}
                style={{ width: '50vw' }} /*('displayBasic')}*/
                onHide={this.hideTaskSwitch.bind(this)}>
                <TaskSelector selectedCallback={this.dialogCallback.bind(this)} tasklist={this.state.tasks}></TaskSelector>
            </Dialog>

            <Dialog header="Header"
                visible={this.state.isTimeManagerVisible}
                style={{ width: '50vw' }}
                onHide={this.closeTimeManager.bind(this)}>
                <TimeManager
                    start={new Date()} end={new Date()}
                    onSave={this.changeTimeLogHours.bind(this)}
                    onCancel={this.closeTimeManager.bind(this)}
                />
            </Dialog>
        </section>;
    }
}
