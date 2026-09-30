import { dashboardService } from "../../../services/dashboard-service";
import { logger } from "../../../shared";
import { toObjectId } from "../../../shared";


export const handlers: Record<string, (payload: any) => Promise<void>> = {
    "task.created": async (payload) => {
        const userId = payload?.userId || payload?.task?.author;
        if (!userId) {
            logger.error("task.created event missing userId");
            return;
        }
        await dashboardService.recordTaskCreated(toObjectId(userId));
    },

    "task.completed": async (payload) => {
        const userId = payload?.userId || payload?.task?.author;
        if (!userId) {
            logger.error("task.completed event missing userId");
            return;
        }
        await dashboardService.recordTaskCompleted(toObjectId(userId));
    },

    "productivityTimer.created": async (payload) => {
        const userId = payload?.userId;
        if (!userId) {
            logger.error("productivityTimer.created event missing userId");
            return;
        }
        await dashboardService.recordTimerCreated(toObjectId(userId));
    },

    "getProductivityTime.durationUpdated": async (payload) => {
        const userId = payload?.userId;
        // const seconds = payload?.updatedProductivityTimer?.completedTime;
        const delta = payload?.productivityDuration;
        if (!userId || typeof delta !== "number" || delta <= 0) return;
        await dashboardService.recordIndividualFocusTime(toObjectId(userId), delta);
    },

    "group.timer.created": async (payload) => {
        const userId = payload?.userId;
        const groupTimer = payload?.groupProductivityTimer;
        if (!userId || !groupTimer) {
            logger.error("group.timer.created event missing data");
            return;
        }

        await dashboardService.recordTimerCreated(toObjectId(userId));
        await dashboardService.upsertGroupTimerSnapshot(toObjectId(userId), {
            groupTimerId: toObjectId(groupTimer._id),
            title: groupTimer.title,
            deadline: new Date(groupTimer.deadline),
            specifiedTime: groupTimer.specifiedTime,
            myProductivityDone: 0,
            participantCount: groupTimer.participants?.length ?? 1,
            isActive: true,
        });
    },

    "group.timer.participant.updated": async (payload) => {
        const groupTimerId = payload?.groupTimerId;
        const participants = payload?.participants as Array<{
            user: string; productivityDone: number;
        }> | undefined;
        if (!groupTimerId || !participants) {
            logger.error("group.timer.participant.updated missing data");
            return;
        }

        for (const participant of participants) {
            const participantUserId = toObjectId(participant.user);

            await dashboardService.upsertGroupTimerSnapshot(participantUserId, {
                groupTimerId: toObjectId(groupTimerId),
                title: payload.title ?? "Group Timer",
                deadline: payload.deadline ? new Date(payload.deadline) : new Date(),
                specifiedTime: payload.specifiedTime ?? 0,
                myProductivityDone: participant.productivityDone,
                participantCount: participants.length,
                isActive: true,
            });
        }

        const submitterId = payload?.submittedBy;
        const delta = payload?.productivityDuration;
        if (submitterId && typeof delta === "number" && delta > 0) {
            await dashboardService.recordGroupFocusTime(toObjectId(submitterId), delta);
        }
    },
};