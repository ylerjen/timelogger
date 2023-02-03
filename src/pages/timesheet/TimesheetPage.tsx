import { Component } from 'react';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { PrimeIcons } from 'primereact/api';
import { addMonths, format } from 'date-fns';
import { TimeLog } from '../../models/TimeLog';
import { HoursSummary } from '../../components/hours-summary/HoursSummary';
import { getTimeLogs } from '../../services/time-service';
import { groupLogsByDay } from '../../helpers/TimeHelper';
import './TimesheetPage.css';
import { TasksSummary } from '../../components/tasks-summary/TasksSummary';
import { getAllTasks } from '../../services/project-service';
import { Task } from '../../models/Task';
import { DaysSummary } from '../../components/days-summary/DaysSummary';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props { }

interface State {
    timesheetDate: Date;
    timelogs: Array<TimeLog>;
    isLoading: boolean;
    tasks: Array<Task>;
}

export class TimesheetPage extends Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        const today = new Date();
        this.state = {
            timesheetDate: today,
            timelogs: [],
            isLoading: true,
            tasks: [],
        };
    }

    componentDidMount(): void {
        getAllTasks().then(tasks => {
            this.setState({ tasks });
            this.refreshList(this.state.timesheetDate);
        });
    }

    gotoMonth(offset: number): void {
        const monthDate = addMonths(this.state.timesheetDate, offset);
        this.refreshList(monthDate);
        this.setState(s => ({
            ...s,
            timesheetDate: monthDate,
            isLoading: true,
        }));
    }

    refreshList(timesheetMonth: Date): void {
        getTimeLogs(timesheetMonth, 'monthly')
            .then(timelogs => {
                timelogs.forEach(t => t.task = this.state.tasks.find(task => task.id === t.taskId));
                this.setState({
                    timelogs,
                    isLoading: false,
                });
            });
    }

    dataContent(): JSX.Element {
        if (this.state.isLoading) {
            return <div className="loader">{[1, 2, 3, 4, 5].map(id => <Skeleton key={id} height="2rem" width="80%" className="mb-2"></Skeleton>)}</div>;
        }
        return <DaysSummary timelogs={this.state.timelogs} />;
        // return <ol>{daysLogged.map(d => <li key={d[0]} data-id={d[0]}>----</li>)}</ol>;
    }

    render(): JSX.Element {
        const now = new Date();
        const timesheetDate = this.state.timesheetDate;

        const isCurrentMonth = now.getMonth() === timesheetDate.getMonth() && now.getFullYear() === timesheetDate.getFullYear();

        const nextMonthButton = isCurrentMonth ? '' : <Button icon={PrimeIcons.CARET_RIGHT} iconPos="right" onClick={() => this.gotoMonth(+1)} />;


        return <section>
            <h1 className="timesheet-month-nav">
                <Button icon={PrimeIcons.CARET_LEFT} iconPos="right" onClick={() => this.gotoMonth(-1)} />
                <span className='date-title-text'>{format(this.state.timesheetDate, 'MMMM Y')}</span>
                {nextMonthButton}
            </h1>
            <h2>Tasks</h2>
            <TasksSummary timelogs={this.state.timelogs} />
            <h2>Days</h2>
            <div className="mt-5">{this.dataContent()}</div>
        </section>;
    }
}
