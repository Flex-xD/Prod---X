const onlineUserIds = new Map<string , number>();
const offlineTimer = new Map<string , ReturnType<typeof setTimeout>>();
const GRACE_TIME = 5000;

export const markUserOnline = async (userId: string) => {
    const currentConnections = onlineUserIds.get(userId) ?? 0;
    onlineUserIds.set(userId, currentConnections + 1);

    const pendingTimer = offlineTimer.get(userId);
    if (pendingTimer) {
        clearTimeout(pendingTimer);
        offlineTimer.delete(userId);
    }

    return currentConnections === 0;
};

export const scheduleUserOffline = async (userId:string , onConfirmOffline:() => void) => {
    const prev = Math.max((onlineUserIds.get(userId) ?? 0) - 1 , 0);
    onlineUserIds.set(userId , prev);
    if (prev > 0) return;

    const timerId = setTimeout(() => {
        onlineUserIds.delete(userId);
        offlineTimer.delete(userId);
        onConfirmOffline();
    } , GRACE_TIME);
    offlineTimer.set(userId  , timerId);
}