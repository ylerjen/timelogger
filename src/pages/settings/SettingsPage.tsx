import { InputNumber } from 'primereact/inputnumber';
import { Checkbox } from 'primereact/checkbox';
import './SettingsPage.css';

export function SettingsPage() {
    return (
        <section>
            <h1>Settings page</h1>
            <div className='daily-hours'>
                <label htmlFor="daily-hours" className="me-2">Daily worked time</label>
                <InputNumber inputId="daily-hours" min={0} step={1} max={24} value={8} placeholder="hours" showButtons buttonLayout="vertical" style={{ width: '6em' }} />
                <InputNumber inputId="daily-minutes" min={0} step={1} max={60} value={24} placeholder="minutes" showButtons buttonLayout="vertical" style={{ width: '6em' }} />
            </div>
            <div className="col-12">
                <Checkbox inputId="cb1" value="New York" checked></Checkbox>
                <label htmlFor="cb1" className="p-checkbox-label">Is pause counted as work</label>
            </div>
        </section>
    );
}
