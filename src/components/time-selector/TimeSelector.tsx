import { InputNumber, InputNumberChangeParams } from 'primereact/inputnumber';

export interface Prop {
    hours: number;
    minutes: number;
    onChange: (hours: number, minutes: number) => void;
}

export function TimeSelector(prop: Prop): JSX.Element {
    let hours = prop.hours || 0;
    let minutes = prop.minutes || 0;

    function onHourChanged(e: InputNumberChangeParams): void {
        hours = e.value || 0;
        prop.onChange(hours, minutes);
    }

    function onMinuteChanged(e: InputNumberChangeParams): void {
        minutes = e.value || 0;
        prop.onChange(hours, minutes);
    }

    return <div className="d-flex">
        <InputNumber inputId="daily-hours"
            min={0} step={1} max={23} value={hours}
            onChange={onHourChanged}
            placeholder="hours" showButtons buttonLayout="vertical" style={{ width: '6em' }}
        />
        <InputNumber inputId="daily-minutes"
            min={0} step={1} max={59} value={minutes}
            onChange={onMinuteChanged}
            placeholder="minutes" showButtons buttonLayout="vertical" style={{ width: '6em' }}
        />
    </div>;
}
