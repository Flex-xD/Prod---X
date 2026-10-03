import type { IUser } from "@/pages/Productivity-timer-pages/timer-components/types";

export interface ILoginResponseData {
    user: IUser;
    accessToken: string;
}

export interface IProfileStats {
    tasks: { totalToday: number; pending: number; inProgress: number; done: number };
    individualTimers: { active: number; completed: number; expired: number; totalFocusSeconds: number };
    groupTimers: { active: number; completed: number; expired: number; totalFocusSeconds: number };
    streakData: { currentStreak: number; longestStreak: number; weeklyFocusSeconds: number };
}

export interface IProfileData {
    user: IUser;
    stats: IProfileStats;
}