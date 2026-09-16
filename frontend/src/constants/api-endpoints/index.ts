const BASE_URL = import.meta.env.VITE_BASE_URL;

const ENDPOINTS = {
    AUTH_ENDPOINTS: {
        REGISTER: `${BASE_URL}/auth/register`,
        LOGIN: `${BASE_URL}/auth/login`,
        GOOGLE_AUTH: `${BASE_URL}/auth/google-auth`,
        LOGOUT: `${BASE_URL}/auth/logout`,
    },
    TASKS_ENDPOINTS: {
        CREATE_TASK: `${BASE_URL}/task/create-task`,
        GET_TODAYS_TASKS: `${BASE_URL}/task/todays-tasks`,
        MARK_TASK_DONE: `${BASE_URL}/task/done`,
        MARK_TASK_PENDING: `${BASE_URL}/task/pending`,
    },
    USER_ENDPOINTS: {
        USER_DATA: `${BASE_URL}/user/user-data`,
        USERS_TO_SHOW: (query: string) => `${BASE_URL}/user/users-to-invite?query=${query}`

    },
    PRODUCTIVITY_TIMER: {
        CREATE_PRODUCTIVITY_TIMER: "/productivity-timer/create-timer",
        GET_ACTIVE_PRODUCTIVITY_TIMERS: "/productivity-timer/active-productivity-timers",
        GET_EXPIRED_PRODUCTIVITY_TIMERS: "/productivity-timer/expired-productivity-timers",
        SUBMIT_PRODUCTIVITY: "/productivity-timer/submit-productivity",
    },
    GROUP_PRODUCTITIVTY_TIMER: {
        CREATE_GROUP_PRODUCTIVITY_TIMER: "/group-productivity-timer/create-group-timer",
        GET_USERS_ACTIVE_GROUP_PRODUCTIVITY_TIMERS: "/group-productivity-timer/active-group-timers",
        GET_EXPIRED_GROUP_PRODUCTIVITY_TIMERS: "/group-productivity-timer/expired-group-timers",
        GET_PENDING_INVITES: "/group-productivity-timer/pending-invites",
        SUBMIT_GROUP_PRODUCTIVITY: "/group-productivity-timer/submit-productivity",
    },
    NOTIFICATION_ENDPOINTS: {
        GET_NOTIFICATIONS: (userId: string, page: number) => `/notification/${userId}?page=${page}&limit=15`,
        MARK_AS_READ: (notificationId: string) => `/notification/${notificationId}/read`,
        MARK_ALL_AS_READ: (userId: string) => `/notification/read-all/${userId}`,
    },
    GROUP_TIMER_INVITATION_ENDPOINTS: {
        RESPOND: `/group-productivity-timer/respond-invitation`,
    }

}

export default ENDPOINTS;