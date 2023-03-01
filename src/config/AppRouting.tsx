import { createBrowserRouter } from 'react-router-dom';
import { TasksPage } from '../pages/tasks/TasksPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { TimesheetPage } from '../pages/timesheet/TimesheetPage';
import { TodayPage } from '../pages/today/TodayPage';
import { projectRoute, timesheetRoute, todayRoute } from './RouteBuilder';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <TodayPage />,
    },
    {
        path: todayRoute,
        element: <TodayPage />,
    },
    {
        path: projectRoute,
        element: <TasksPage />,
    },
    {
        path: timesheetRoute,
        element: <TimesheetPage />,
    },
    {
        path: '/settings',
        element: <SettingsPage />,
    },
]);
