import { StatusCodes } from "http-status-codes";
import { ApiError, getUser } from "../shared";
import mongoose from "mongoose";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";
import GroupTimer, { IGroupParticipant } from "../shared/models/GroupTimer";
import { emitEvent } from "../kafka/producer";
import User from "../shared/models/User";
import { title } from "process";

const MAX_GROUP_TIMERS = 5;

const recomputeRanks = (participants: IGroupParticipant[]) => {
    const sorted = [...participants].sort((a, b) => b.productivityDone - a.productivityDone);
    sorted.forEach((p, idx) => { p.rank = idx + 1; });
};

const countActiveGroupSlots = async (userId: mongoose.Types.ObjectId) => {
    const now = new Date();
    return GroupTimer.countDocuments({
        deadline: { $gte: now },
        participants: { $elemMatch: { user: userId, archived: false } },
    });
};

export const groupProductivityTimerServices = {
    createGroupProductivityTimerService: async (
        userId: mongoose.Types.ObjectId,
        data: TcreateGroupProductivityTimerInputForBody
    ) => {
        const user = await User.findById(userId).select("username");
        const activeSlots = await countActiveGroupSlots(userId);
        if (activeSlots >= MAX_GROUP_TIMERS) {
            throw ApiError(StatusCodes.BAD_REQUEST, "You already have the maximum number of active group timers !");
        }

        const groupProductivityTimer = new GroupTimer({
            title: data.title,
            description: data.description ?? "",
            deadline: data.deadline,
            invitedUsersId: data.invitedUsersId,
            participants: [{
                user: userId, productivityDone: 0, isCurrentlyActive: false,
                rank: 1, hasCompleted: false, archived: false,
                username:user?.username
            }],
            specifiedTime: data.specifiedTime,
            author: userId,
        });

        await groupProductivityTimer.save();
        await User.findByIdAndUpdate(userId, { $push: { userGroupProductivityTimer: groupProductivityTimer._id } });

        return groupProductivityTimer;
    },

    respondToInvitation: async (
        groupTimerId: mongoose.Types.ObjectId,
        userId: mongoose.Types.ObjectId,
        status: "accepted" | "declined"
    ) => {
        const user = await User.findById(userId).select("username");
        if (!user) {
            throw ApiError(StatusCodes.NOT_FOUND , "User not found !");
        }
        const groupTimer = await GroupTimer.findById(groupTimerId);
        if (!groupTimer) throw ApiError(StatusCodes.NOT_FOUND, "Group timer not found !");

        const alreadyJoined = groupTimer.participants.some((p) => p.user.toString() === userId.toString());

        if (status === "accepted" && !alreadyJoined) {
            const activeSlots = await countActiveGroupSlots(userId);
            if (activeSlots >= MAX_GROUP_TIMERS) {
                throw ApiError(StatusCodes.BAD_REQUEST, "You already have the maximum number of active group timers ! Complete or wait for one to expire first.");
            }

            groupTimer.participants.push({
                user: userId, productivityDone: 0, isCurrentlyActive: false,
                rank: groupTimer.participants.length + 1, hasCompleted: false, archived: false,
                username:user?.username
            });
            recomputeRanks(groupTimer.participants);

            groupTimer.invitedUsersId = groupTimer.invitedUsersId.filter((id) => id.toString() !== userId.toString());
            await groupTimer.save();

            await User.findByIdAndUpdate(userId, { $addToSet: { userGroupProductivityTimer: groupTimerId } });

            await emitEvent("group.timer.participant.updated", {
                groupTimerId: groupTimer._id.toString(),
                recipients: [groupTimer.author.toString(), ...groupTimer.participants.map((p) => p.user.toString())],
                participants: groupTimer.participants,
            });
        } else if (status === "declined") {
            groupTimer.invitedUsersId = groupTimer.invitedUsersId.filter((id) => id.toString() !== userId.toString());
            await groupTimer.save();
        }

        return groupTimer;
    },

    submitProductivityForGroupTimer: async (
        userId: mongoose.Types.ObjectId,
        groupTimerId: mongoose.Types.ObjectId,
        productivityDuration: number
    ) => {
        const groupTimer = await GroupTimer.findById(groupTimerId);
        if (!groupTimer) throw ApiError(StatusCodes.NOT_FOUND, "Group Timer not found !");

        if (Date.now() > groupTimer.deadline.getTime()) {
            throw ApiError(StatusCodes.CONFLICT, "Group Timer has hit the deadline !");
        }

        const participant = groupTimer.participants.find((p) => p.user.toString() === userId.toString());
        if (!participant) throw ApiError(StatusCodes.FORBIDDEN, "You are not a participant of this group timer !");
        if (participant.hasCompleted) throw ApiError(StatusCodes.CONFLICT, "You've already completed your goal for this timer !");

        const goalSeconds = groupTimer.specifiedTime * 60;

        participant.productivityDone = Math.min(participant.productivityDone + productivityDuration, goalSeconds);
        participant.isCurrentlyActive = false;

        if (participant.productivityDone >= goalSeconds) {
            participant.hasCompleted = true;
        }

        recomputeRanks(groupTimer.participants);

        const allDone = groupTimer.participants.every((p) => p.hasCompleted);
        if (allDone) groupTimer.status = "done";

        await groupTimer.save();

        await emitEvent("group.timer.participant.updated", {
            submittedBy:userId,
            groupTimerId: groupTimer._id.toString(),
            recipients: [groupTimer.author.toString(), ...groupTimer.participants.map((p) => p.user.toString())],
            participants: groupTimer.participants,
            productivityDuration , 
            title:groupTimer.title ,  
            deadline:groupTimer.deadline , 
            specifiedTime:groupTimer.specifiedTime
        });

        return groupTimer;
    },

    archiveParticipantGroupTimer: async (
        groupTimerId: mongoose.Types.ObjectId,
        userId: mongoose.Types.ObjectId
    ) => {
        const groupTimer = await GroupTimer.findById(groupTimerId);
        if (!groupTimer) throw ApiError(StatusCodes.NOT_FOUND, "Group timer not found !");

        const participant = groupTimer.participants.find((p) => p.user.toString() === userId.toString());
        if (!participant) throw ApiError(StatusCodes.FORBIDDEN, "You are not a participant of this group timer !");
        if (!participant.hasCompleted) throw ApiError(StatusCodes.BAD_REQUEST, "Complete your goal before moving this to Completed !");

        participant.archived = true;
        await groupTimer.save();

        return groupTimer;
    },

    getUsersActiveGroupProductivityTimers: async (userId: mongoose.Types.ObjectId) => {
        const now = new Date();
        return GroupTimer.find({
            deadline: { $gte: now },
            participants: { $elemMatch: { user: userId, archived: false } },
        })
            .sort({ createdAt: -1 })
            .populate("author", "username avatar isOnline")
            .populate("participants.user", "username avatar isOnline");
    },

    getUsersExpiredGroupProductivityTimers: async (userId: mongoose.Types.ObjectId) => {
        const now = new Date();
        return GroupTimer.find({
            deadline: { $lt: now },
            participants: { $elemMatch: { user: userId, archived: false } },
        })
            .sort({ deadline: -1 })
            .populate("author", "username avatar isOnline")
            .populate("participants.user", "username avatar isOnline");
    },

    getUsersCompletedGroupProductivityTimers: async (userId: mongoose.Types.ObjectId) => {
        return GroupTimer.find({
            participants: { $elemMatch: { user: userId, archived: true } },
        })
            .sort({ updatedAt: -1 })
            .populate("author", "username avatar isOnline")
            .populate("participants.user", "username avatar isOnline");
    },

    getPendingInvitesForUser: async (userId: mongoose.Types.ObjectId) => {
        const now = new Date();
        return GroupTimer.find({ invitedUsersId: userId, deadline: { $gte: now } })
            .sort({ createdAt: -1 })
            .populate("author", "username avatar isOnline");
    },
}