import { Component } from 'react';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { PrimeIcons } from 'primereact/api';
import { addMonths, format } from 'date-fns';
import { Task } from '../../models/Task';
import { TimeLog } from '../../models/TimeLog';
import { DaysSummary } from '../../components/days-summary/DaysSummary';
import { TasksSummary } from '../../components/tasks-summary/TasksSummary';
import { getTimeLogs } from '../../services/time-service';
import { getAllTasks } from '../../services/project-service';
import './TimesheetPage.css';

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
            <div className="d-flex justify-content-center">
                <TasksSummary timelogs={this.state.timelogs} />
            </div>
            <h2 className="mt-5">Days</h2>
            <div className="d-flex justify-content-center">
                <div>{this.dataContent()}</div>
            </div>
        </section>;
    }
}
