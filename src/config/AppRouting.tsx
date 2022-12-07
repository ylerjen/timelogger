import { createBrowserRouter } from "react-router-dom";
import { ProjectPage } from "../pages/project/ProjectPage";
import { SettingsPage } from "../pages/settings/SettingsPage";
import { TimesheetPage } from "../pages/timesheet/TimesheetPage";
import { TodayPage } from "../pages/today/TodayPage";
import { projectRoute, timesheetRoute, todayRoute } from "./RouteBuilder";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <TodayPage />
        ),
    },
    {
        path: todayRoute,
        element: (
            <TodayPage />
        ),
    },
    {
        path: projectRoute,
        element: (
            <ProjectPage />
        ),
    },
    {
        path: timesheetRoute,
        element: (
            <TimesheetPage />
        ),
    },
    {
        path: "/settings",
        element: <SettingsPage />,
    },
]);
