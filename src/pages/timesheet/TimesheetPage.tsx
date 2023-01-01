import { Component } from 'react';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { addMonths, format } from 'date-fns';
import { HoursSummary } from '../../components/hours-summary/HoursSummary';
import { getTimeLogs } from '../../services/time-service';
import './TimesheetPage.css';
 
interface Props {}
interface State {
    timesheetDate: Date;
}
export class TimesheetPage extends Component<Props, State> {    
    state: State;
    
    constructor(props: Props) {
        super(props);
        this.state = {
            timesheetDate: new Date(),
        };
      }

    gotoMonth(offset: number): void {
        this.setState(s => ({
            ...s,
            timesheetDate: addMonths(s.timesheetDate, offset),
        }));
    }
    
    render(): JSX.Element {
        const now = new Date();
        const timesheetDate = this.state.timesheetDate;

        const isCurrentMonth = now.getMonth() === timesheetDate.getMonth() && now.getFullYear() === timesheetDate.getFullYear();

        const nextMonthButton = isCurrentMonth ? '' : <Button icon={PrimeIcons.CARET_RIGHT} iconPos="right" onClick={() => this.gotoMonth(+1)} />;
        return (<section>
            <h1 className="timesheet-month-nav">
                <Button icon={PrimeIcons.CARET_LEFT} iconPos="right" onClick={() => this.gotoMonth(-1)}/>
                <span className='date-title-text'>{format(this.state.timesheetDate, 'MMMM Y')}</span>
                {nextMonthButton}
            </h1>
            <HoursSummary timeLogs={getTimeLogs()}></HoursSummary>
        </section>);
    }
}
