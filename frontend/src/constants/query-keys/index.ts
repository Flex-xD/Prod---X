export const QUERY_KEYS = {
    TASKS: {
        ALL: ["tasks"] as const,
        USER: (userId: string) => ["tasks", userId] as const,
        TODAYS_TASKS: (userId: string) => ["tasks", userId, new Date().toISOString().slice(0, 10)] as const,
        BY_ID: (taskId: string) => ["tasks", taskId] as const
    }
    ,
    PROFILE: {
        ME: ["profile", "me"] as const,
        BY_ID: (userId: string) => ["profile", userId] as const,
        FOLLOWERS: (userId: string) => ["profile", userId, "followers"] as const,
        FOLLOWING: (userId: string) => ["profile", userId, "following"] as const,
        USERS_TO_SHOW: (query: string) => ["users_to_show", query]
    },
    PRODUCTIVITY_TIMER: {
        ACTIVE_PRODUCTIVIY_TIMERS: (userId: string) => ["productivity-timer", "active", userId],
        EXPIRED_PRODUCTIVITY_TIMERS: (userId: string) => ["productivity-timer", "expired", userId],
        COMPLETED_PRODUCTIVITY_TIMERS: (userId: string) => ["productivity-timer", "completed", userId], // CHANGED
    },
    GROUP_PRODUCTIVITY_TIMER: {
        ACTIVE_GROUP_TIMERS: (userId: string) => ["group-productivity-timer", "active", userId],
        EXPIRED_GROUP_TIMERS: (userId: string) => ["group-productivity-timer", "expired", userId],
        COMPLETED_GROUP_TIMERS: (userId: string) => ["group-productivity-timer", "completed", userId], // CHANGED
        PENDING_INVITES: (userId: string) => ["group-productivity-timer", "pending-invites", userId],
    },
    notificationKeys: {
        all: ["notifications"] as const,
        list: (userId: string) => ["notifications", "list", userId] as const,
    },
    DASHBOARD: {
        SUMMARY: (userId: string) => ["dashboard", "summary", userId],
        WEEKLY_GRAPH: (userId: string) => ["dashboard", "weekly-graph", userId],
        CALENDAR: (userId: string) => ["dashboard", "calendar", userId],
        AI_TIP: (userId: string) => ["dashboard", "ai-tip", userId],
        ACTIVITY_MESSAGE: (userId: string) => ["dashboard", "activity-message", userId],
    }, 
    PROFILE_PAGE: {
    DATA: (userId: string) => ["profile-page", userId],
},
};