import { addMonths } from 'date-fns';
import { Component } from 'react';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { HoursSummary } from '../../components/hours-summary/hours-summary';
import { getTimeLogs } from '../../services/time-service';
import './TimesheetPage.css';
 
interface Props {}
interface State {
    timesheetDate: Date;
}
export class TimesheetPage extends Component<Props, State> {
    private today = new Date();
    private timesheetDate = new Date();
    private primeIcons = PrimeIcons;
    state = {
        timesheetDate: this.today,
    };

    gotoMonth(offset: number): void {
        this.setState(s => ({
            ...s,
            timesheetDate: addMonths(s.timesheetDate, offset),
        }));
    }
    
    render() {
        return (<section>
            <h1>
                <Button icon="this.primeIcons.CARET_LEFT" iconPos="right" onClick={() => this.gotoMonth(-1)}/>
                <span className='date-title-text'>{this.timesheetDate.toLocaleDateString('fr-CH')}</span>
                <Button icon="{this.primeIcons.CARET_RIGHT}" iconPos="right" onClick={() => this.gotoMonth(+1)} />
            </h1>
            <HoursSummary timeLogs={getTimeLogs()}></HoursSummary>
        </section>);
    }
}
