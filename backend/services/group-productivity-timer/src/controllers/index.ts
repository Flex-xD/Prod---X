import { ApiError, asyncHandler, logger, sendResponse, toObjectId } from "../shared";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { emitEvent } from "../kafka/producer";
import { groupProductivityTimerServices } from "../services";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";

export const createGroupProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    const userId = req.headers["x-user-id"] as string;

    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { title, description, deadline, specifiedTime, invitedUsersId }: TcreateGroupProductivityTimerInputForBody = req.body.data;

    if (invitedUsersId.length == 0) {
        throw ApiError(StatusCodes.BAD_REQUEST, "You must invite at least one user !");
    }
    if (!title || !specifiedTime || !deadline) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Title , specifiedTime and deadline are required !");
    }
    // * Deadline must not be a past date (the UI already restricts picking to tomorrow+).
    const deadlineDate = new Date(deadline);
    if (Number.isNaN(deadlineDate.getTime())) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Invalid deadline !");
    }
    const startOfTodayUTC = new Date();
    startOfTodayUTC.setUTCHours(0, 0, 0, 0);
    if (deadlineDate.getTime() < startOfTodayUTC.getTime()) {
        throw ApiError(StatusCodes.BAD_REQUEST, "Deadline cannot be a past date ! Choose tomorrow or later.");
    }

    const groupProductivityTimer = await groupProductivityTimerServices.createGroupProductivityTimerService(
        toObjectId(userId), { title, description, deadline, specifiedTime, invitedUsersId } as TcreateGroupProductivityTimerInputForBody
    );

    logger.info(`Sending Response to client ✅ with userid: ${userId}`);

    await emitEvent("group.timer.created", { userId, groupProductivityTimer, token });

    return sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        success: true,
        message: "Group-productivity-Timer created successfully !",
        data: groupProductivityTimer,
    });
});

export const respondToGroupTimerInvitation = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { groupTimerId, status } = req.body as {
        groupTimerId: string;
        status: "accepted" | "declined";
    };
    if (!groupTimerId || !status) throw ApiError(StatusCodes.BAD_REQUEST, "groupTimerId and status are required !");

    const groupTimer = await groupProductivityTimerServices.respondToInvitation(toObjectId(groupTimerId), toObjectId(userId), status);

    // * Tell the notification-service that this invitation was answered so it can
    // * record the response (and stop returning the notification / unread badge).
    await emitEvent("group.timer.invitation.updated", {
        groupTimerId,
        userId,
        status,
    });

    // * Live participant/rank update for everyone in the timer (also feeds the
    // * dashboard's group-timer snapshots — payload must keep title/deadline/specifiedTime).
    await emitEvent("group.timer.participant.updated", {
                groupTimerId: groupTimer._id.toString(),
                recipients: [groupTimer.author.toString(), ...groupTimer.participants.map((p) => p.user.toString())],
                participants: groupTimer.participants,
                title: groupTimer.title,
                deadline: groupTimer.deadline,
                specifiedTime: groupTimer.specifiedTime,
            });
    return sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: `Invitation ${status} successfully !`,
        data: null,
    });
});

type TSubmitProductivityForGroupTimerBody = { groupTimerId: string; productivityDuration: number };

export const submitProductivityForGroupTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { groupTimerId, productivityDuration }: TSubmitProductivityForGroupTimerBody = req.body;

    if (!groupTimerId) throw ApiError(StatusCodes.BAD_REQUEST, "groupTimerId is required !");
    if (!productivityDuration || productivityDuration <= 0) {
        throw ApiError(StatusCodes.BAD_REQUEST, "productivityDuration must be a positive number of seconds !");
    }

    const updated = await groupProductivityTimerServices.submitProductivityForGroupTimer(
        toObjectId(userId), toObjectId(groupTimerId), productivityDuration
    );

    const message = updated.status === "done"
        ? "🎉 Everyone finished — this group session is complete!"
        : updated.participants.find((p) => p.user.toString() === userId)?.hasCompleted
            ? "You've hit your goal! You can move this to Completed whenever you're ready."
            : "Productivity submitted !";

    return sendResponse(res, { statusCode: StatusCodes.OK, success: true, message, data: updated });
});

export const archiveGroupTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");

    const { groupTimerId } = req.body as { groupTimerId: string };
    if (!groupTimerId) throw ApiError(StatusCodes.BAD_REQUEST, "groupTimerId is required !");

    const updated = await groupProductivityTimerServices.archiveParticipantGroupTimer(toObjectId(groupTimerId), toObjectId(userId));

    return sendResponse(res, {
        statusCode: StatusCodes.OK, success: true,
        message: "Moved to Completed — you now have a free slot !", data: updated,
    });
});

export const getActiveGroupProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const data = await groupProductivityTimerServices.getUsersActiveGroupProductivityTimers(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, message: "Active group timers fetched !", success: true, data });
});

export const getExpiredGroupProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const data = await groupProductivityTimerServices.getUsersExpiredGroupProductivityTimers(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, message: "Expired group timers fetched !", success: true, data });
});

export const getCompletedGroupProductivityTimer = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const data = await groupProductivityTimerServices.getUsersCompletedGroupProductivityTimers(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, message: "Completed group timers fetched !", success: true, data });
});

export const getPendingGroupTimerInvites = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) throw ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access !");
    const data = await groupProductivityTimerServices.getPendingInvitesForUser(toObjectId(userId));
    return sendResponse(res, { statusCode: StatusCodes.OK, message: "Pending invites fetched !", success: true, data });
});