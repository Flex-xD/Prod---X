import type { IUser } from "@/pages/Productivity-timer-pages/timer-components/types";

export interface ILoginResponseData {
    user: IUser;
    accessToken: string;
}

