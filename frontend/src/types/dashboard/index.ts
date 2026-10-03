export interface IDashboardSummary {
    tasksToday: { created: number; completed: number };
    streak: { current: number; longest: number };
    weeklyFocusSeconds: number;
    latestGroupTimer: {
        groupTimerId: string;
        title: string;
        deadline: string;
        specifiedTime: number;
        myProductivityDone: number;
        participantCount: number;
        progressPct: number;
    } | null;
}

export interface IWeeklyGraphEntry {
    day: string;
    date: string;
    tasks: number;
    hours: number;
}

export interface ICalendarCell {
    date: string;
    intensity: "high" | "medium" | "low" | "none";
    hours: number;
}