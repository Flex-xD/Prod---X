import { StatusCodes } from "http-status-codes";
import { ApiError } from "../shared";
import mongoose from "mongoose";
import { TcreateGroupProductivityTimerInputForBody } from "../schemas";
import GroupTimer, { IGroupParticipant } from "../shared/models/GroupTimer";
import { emitEvent } from "../kafka/producer";
import User from "../shared/models/User";


const recomputeRanks = (participants: IGroupParticipant[]) => {
    const sorted = [...participants].sort((a, b) => b.productivityDone - a.productivityDone);
    sorted.forEach((p, idx) => { p.rank = idx + 1; });
};

export const groupProductivityTimerServices = {
    createGroupProductivityTimerService: async (
        userId: mongoose.Types.ObjectId,
        data: TcreateGroupProductivityTimerInputForBody
    ) => {
        const groupProductivityTimer = new GroupTimer({
            title: data.title,
            description: data.description ?? "",
            deadline: data.deadline,
            invitedUsersId: data.invitedUsersId,
            participants: [{ user: userId, productivityDone: 0, isCurrentlyActive: false, rank: 1 }],
            specifiedTime: data.specifiedTime,
            author: userId,
        });

        await groupProductivityTimer.save();

        await User.findByIdAndUpdate(userId, {
            $push: { userGroupProductivityTimer: groupProductivityTimer._id },
        });

        return groupProductivityTimer;
    },

    respondToInvitation: async (
        groupTimerId: mongoose.Types.ObjectId,
        userId: mongoose.Types.ObjectId,
        status: "accepted" | "declined"
    ) => {
        const groupTimer = await GroupTimer.findById(groupTimerId);
        if (!groupTimer) throw ApiError(StatusCodes.NOT_FOUND, "Group timer not found !");

        const alreadyJoined = groupTimer.participants.some(
            (p) => p.user.toString() === userId.toString()
        );

        if (status === "accepted" && !alreadyJoined) {
            groupTimer.participants.push({
                user: userId,
                productivityDone: 0,
                isCurrentlyActive: false,
                rank: groupTimer.participants.length + 1,
            });
            recomputeRanks(groupTimer.participants);

            groupTimer.invitedUsersId = groupTimer.invitedUsersId.filter(
                (id) => id.toString() !== userId.toString()
            );

            await groupTimer.save();

            await User.findByIdAndUpdate(userId, {
                $addToSet: { userGroupProductivityTimer: groupTimerId },
            });

            await emitEvent("group.timer.participant.updated", {
                groupTimerId: groupTimer._id.toString(),
                recipients: [
                    groupTimer.author.toString(),
                    ...groupTimer.participants.map((p) => p.user.toString()),
                ],
                participants: groupTimer.participants,
            });
        } else if (status === "declined") {
            groupTimer.invitedUsersId = groupTimer.invitedUsersId.filter(
                (id) => id.toString() !== userId.toString()
            );
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

        const participant = groupTimer.participants.find(
            (p) => p.user.toString() === userId.toString()
        );
        if (!participant) {
            throw ApiError(StatusCodes.FORBIDDEN, "You are not a participant of this group timer !");
        }

        participant.productivityDone += productivityDuration;
        participant.isCurrentlyActive = false;

        recomputeRanks(groupTimer.participants);

        const allDone = groupTimer.participants.every(
            (p) => p.productivityDone >= groupTimer.specifiedTime * 60
        );
        if (allDone) groupTimer.status = "done";

        await groupTimer.save();

        await emitEvent("group.timer.participant.updated", {
            groupTimerId: groupTimer._id.toString(),
            recipients: [
                groupTimer.author.toString(),
                ...groupTimer.participants.map((p) => p.user.toString()),
            ],
            participants: groupTimer.participants,
        });

        return groupTimer;
    },

    getUsersActiveGroupProductivityTimers: async (userId: mongoose.Types.ObjectId) => {
        const now = new Date();
        return GroupTimer.find({
            deadline: { $gte: now },
            $or: [{ author: userId }, { "participants.user": userId }],
        })
            .sort({ createdAt: -1 })
            .populate("author", "username avatar isOnline")
            .populate("participants.user", "username avatar isOnline");
    },

    getUsersExpiredGroupProductivityTimers: async (userId: mongoose.Types.ObjectId) => {
        const now = new Date();
        return GroupTimer.find({
            deadline: { $lt: now },
            $or: [{ author: userId }, { "participants.user": userId }],
        })
            .sort({ deadline: -1 })
            .populate("author", "username avatar isOnline")
            .populate("participants.user", "username avatar isOnline");
    },

    getPendingInvitesForUser: async (userId: mongoose.Types.ObjectId) => {
        const now = new Date();
        return GroupTimer.find({
            invitedUsersId: userId,
            deadline: { $gte: now },
        })
            .sort({ createdAt: -1 })
            .populate("author", "username avatar isOnline");
    },
};