export interface IUser {
    initials: string;
    _id: string,
    username: string,
    email: string,
    provider: string,
    avatar: string,
    refreshTokens: string[],
    userTasks: string[],
    userProductivityTimer: string[]
    // Omit the password from the backend
}

export interface ILoginResponseData {
    user: IUser;
    accessToken: string;
}

