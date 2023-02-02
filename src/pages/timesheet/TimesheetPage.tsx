import { Component } from 'react';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { PrimeIcons } from 'primereact/api';
import { addMonths, format } from 'date-fns';
import { HoursSummary } from '../../components/hours-summary/HoursSummary';
import { getTimeLogs } from '../../services/time-service';
import { TimeLog } from '../../models/TimeLog';
import './TimesheetPage.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props { }

interface State {
    timesheetDate: Date;
    timelogs: Array<TimeLog>;
    isLoading: boolean;
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
        };

        this.refreshList(today);
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
            .then((timelogs) => this.setState({
                timelogs,
                isLoading: false,
            }));
    }

    dataContent(): JSX.Element {
        if (this.state.isLoading) {
            return <div className="loader">{[1, 2, 3, 4, 5].map(() => <Skeleton height="2rem" width="80%" className="mb-2"></Skeleton>)}</div>;
        }

        return <pre>{JSON.stringify(this.state.timelogs)}</pre>;
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
            <HoursSummary timeLogs={this.state.timelogs}></HoursSummary>
            <div className="mt-5">{this.dataContent()}</div>
        </section>;
    }
}
