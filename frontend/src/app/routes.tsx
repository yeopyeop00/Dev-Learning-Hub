import { createBrowserRouter } from "react-router";
import { Dashboard } from "./components/Dashboard";
import { Timetable } from "./components/Timetable";
import { GithubStats } from "./components/GithubStats";
import { ProgrammersStats } from "./components/ProgrammersStats";
import { TodoList } from "./components/TodoList";
import { CalendarView } from "./components/CalendarView";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "timetable", Component: Timetable },
      { path: "github", Component: GithubStats },
      { path: "programmers", Component: ProgrammersStats },
      { path: "todo", Component: TodoList },
      { path: "calendar", Component: CalendarView },
    ],
  },
]);
