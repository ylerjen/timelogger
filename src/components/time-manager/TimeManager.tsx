import React, { MouseEvent, MouseEventHandler } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { TimeSelector } from '../time-selector/TimeSelector';
import { Button } from 'primereact/button';
import { setHours, setMinutes } from 'date-fns';

interface State {
    activeIndex: number;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
}
interface Prop {
    start: Date;
    end: Date;
    onSave: (start: Date, end: Date) => void;
    onCancel: () => void;
}

export class TimeManager extends React.Component<Prop, State> {
    state: State;

    constructor(public props: Prop) {
        super(props);

        const { start, end } = props;
        this.state = {
            activeIndex: 0,
            startHour: start.getHours(),
            startMinute: start.getMinutes(),
            endHour: end.getHours(),
            endMinute: end.getMinutes(),
        };
    }

    save(): void {
        let startDate = setMinutes(this.props.start, this.state.startMinute);
        startDate = setHours(this.props.start, this.state.startHour);
        let endDate = setMinutes(this.props.start, this.state.endMinute);
        endDate = setHours(this.props.start, this.state.endHour);

        this.props.onSave(startDate, endDate);
    }

    render(): JSX.Element {
        return <div>
            <TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
                <TabPanel header="Start">
                    <TimeSelector
                        hours={this.state.startHour} minutes={this.state.startMinute}
                        onChange={(startHour, startMinute) => this.setState({ startHour, startMinute })}
                    />
                </TabPanel>
                <TabPanel header="End">
                    <TimeSelector
                        hours={this.state.endHour} minutes={this.state.endMinute}
                        onChange={(endHour, endMinute) => this.setState({ endHour, endMinute })}
                    />
                </TabPanel>
            </TabView>

            <Button label="Save" icon="pi pi-save" onClick={this.save.bind(this)} />

            <Button label="Cancel" icon="pi pi-times" onClick={evt => this.props.onCancel} />
        </div>;
    }
}
