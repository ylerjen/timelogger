import { Menubar } from 'primereact/menubar';
import { PrimeIcons } from 'primereact/api';
import { MenuItem } from 'primereact/menuitem';
import { absenceRoute, projectRoute, settingsRoute, todayRoute, timesheetRoute } from '../../config/RouteBuilder';

export default function Header() {
    const items: Array<MenuItem> = [
        {
            label: 'Today',
            icon: PrimeIcons.CLOCK,
            url: todayRoute,
        },
        {
            label: 'Projects',
            icon: PrimeIcons.FOLDER,
            url: projectRoute,
        },
        {
            label: 'Working hours',
            icon: PrimeIcons.CALENDAR,
            url: timesheetRoute,
        },
        {
            label: 'Absence',
            icon: PrimeIcons.CALENDAR_MINUS,
            url: absenceRoute,
        },
        {
            label: 'Settings',
            icon: PrimeIcons.COG,
            url: settingsRoute,
        }
    ];
    return (
        <header>
            <Menubar model={items} />
        </header>
    );
}
