import { motion } from "framer-motion";

import {
    Users,
    Trophy,
    Calendar,
    Flame,
    Clock,
    UserPlus,
    Timer,
} from "lucide-react";

import { Avatar, SlimBar } from "../ui";
import { sp } from "../constants";

import {
    progressPercent,
    formatMinutes,
    formatSeconds,
} from "../utils";

import type { IGroupTimer } from "../types";

interface GroupTimerCardProps {
    timer: IGroupTimer;
    index: number;
    onClick: () => void;
}

const GroupTimerCard = ({
    timer,
    index,
    onClick,
}: GroupTimerCardProps) => {

    const currentUserId = "me";

    const myParticipant = timer.participants?.find(
        (participant) =>
            participant.user?._id === currentUserId
    );

    const myCompletedTime =
        myParticipant?.productivityDone ?? 0;

    const myProgress = progressPercent(
        myCompletedTime,
        timer.specifiedTime
    );

    const participants = timer.participants ?? [];

    const sortedParticipants = [...participants].sort(
        (a, b) =>
            (b.productivityDone ?? 0) -
            (a.productivityDone ?? 0)
    );

    const topUser = sortedParticipants[0];

    const participantCount = participants.length;

    const invitedCount =
        timer.invitedUsersId?.length ?? 0;


    const activeCount = participants.filter(
        (participant) =>
            participant.isCurrentlyActive
    ).length;

    const formattedDeadline = new Date(
        timer.deadline
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });

    const isLive = timer.isActive;

    const statusLabel =
        timer.status.charAt(0).toUpperCase() +
        timer.status.slice(1);

    const description =
        timer.description?.trim() ||
        "No description provided";

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 18,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                delay: index * 0.07,
                ...sp,
            }}
            whileHover={{
                y: -5,
                boxShadow:
                    "0 24px 48px rgba(0,0,0,0.1)",
            }}
            whileTap={{
                scale: 0.975,
            }}
            onClick={onClick}
            className="
                relative
                bg-white
                rounded-3xl
                overflow-hidden
                cursor-pointer
            "
            style={{
                boxShadow:
                    "0 2px 16px rgba(0,0,0,0.06)",

                border:
                    "1px solid rgba(0,0,0,0.05)",
            }}
        >

            <div
                className="
                    absolute
                    top-0
                    left-0
                    right-0
                    h-[3px]
                "
                style={{
                    background:
                        "linear-gradient(90deg, #EC4899, #F43F5E44)",
                }}
            />

            <div className="p-5">

                <div className="flex items-start gap-3 mb-4">

                    <div
                        className="
                            w-10
                            h-10
                            rounded-2xl
                            flex
                            items-center
                            justify-center
                            flex-shrink-0
                        "
                        style={{
                            background:
                                "rgba(236,72,153,0.10)",

                            border:
                                "1.5px solid rgba(236,72,153,0.18)",
                        }}
                    >
                        <Timer
                            className="w-5 h-5"
                            style={{
                                color: "#EC4899",
                            }}
                        />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">

                        {/* Title + Live */}

                        <div className="flex items-center gap-2">

                            <h4
                                className="
                                    font-black
                                    text-slate-900
                                    text-sm
                                    truncate
                                "
                            >
                                {timer.title}
                            </h4>

                            {isLive && (
                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                        text-[10px]
                                        font-bold
                                        text-emerald-600
                                        bg-emerald-50
                                        px-1.5
                                        py-0.5
                                        rounded-full
                                        border
                                        border-emerald-100
                                        flex-shrink-0
                                    "
                                >
                                    <span
                                        className="
                                            w-1.5
                                            h-1.5
                                            rounded-full
                                            bg-emerald-500
                                            animate-pulse
                                        "
                                    />

                                    Live
                                </span>
                            )}

                        </div>

                        {/* Description */}

                        <p
                            className="
                                text-slate-400
                                text-xs
                                truncate
                                mt-0.5
                                font-medium
                            "
                            title={description}
                        >
                            {description}
                        </p>

                        {/* Status + Goal */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                mt-1.5
                            "
                        >

                            <span
                                className={`
                                    text-xs
                                    font-bold
                                    ${
                                        timer.status === "pending"
                                            ? "text-amber-500"
                                            : "text-emerald-500"
                                    }
                                `}
                            >
                                {statusLabel}
                            </span>

                            <span className="text-slate-300">
                                •
                            </span>

                            <span
                                className="
                                    text-slate-400
                                    text-xs
                                    font-medium
                                "
                            >
                                {formatMinutes(
                                    timer.specifiedTime
                                )} goal
                            </span>

                        </div>

                    </div>

                    <div
                        className="
                            flex-shrink-0
                            text-right
                        "
                    >
                        <span
                            className="
                                text-2xl
                                font-black
                                text-rose-500
                            "
                        >
                            {myProgress}
                        </span>

                        <span
                            className="
                                text-sm
                                font-bold
                                text-slate-400
                            "
                        >
                            %
                        </span>
                    </div>

                </div>

                <div className="mb-1">

                    <div
                        className="
                            flex
                            justify-between
                            text-xs
                            font-bold
                            text-slate-400
                            mb-1.5
                        "
                    >
                        <span>
                            Your progress
                        </span>

                        <span className="text-rose-500">
                            {myProgress}%
                        </span>
                    </div>

                    <SlimBar
                        percent={myProgress}
                        gradient="
                            linear-gradient(
                                90deg,
                                #EC4899,
                                #F43F5E
                            )
                        "
                        height={4}
                    />

                </div>

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mt-4
                        text-xs
                        font-semibold
                        text-slate-400
                    "
                >

                    <span
                        className="
                            flex
                            items-center
                            gap-1
                            max-w-[100px]
                        "
                    >
                        <Users className="w-3 h-3" />

                        {participantCount > 0
                            ? `${participantCount} members`
                            : `${invitedCount} invited`}
                    </span>

                    {/* Completed time */}

                    <span
                        className="
                            flex
                            items-center
                            gap-1
                        "
                    >
                        <Clock className="w-3 h-3" />

                        {formatSeconds(
                            myCompletedTime
                        )}
                    </span>

                    {/* Leader */}

                    <span
                        className="
                            flex
                            items-center
                            gap-1
                            max-w-[120px]
                        "
                    >
                        <Trophy
                            className="
                                w-3
                                h-3
                                text-amber-400
                                flex-shrink-0
                            "
                        />

                        {topUser ? (
                            <span className="truncate">
                                @{topUser.user?.username}
                            </span>
                        ) : (
                            <span className="text-slate-300">
                                No leader
                            </span>
                        )}
                    </span>

                    <span
                        className="
                            flex
                            items-center
                            gap-1
                        "
                        title={timer.deadline}
                    >
                        <Calendar className="w-3 h-3" />

                        {formattedDeadline}
                    </span>

                </div>

                {participantCount === 0 && (
                    <div
                        className="
                            mt-4
                            pt-3
                            border-t
                            border-slate-50
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-slate-400
                        "
                    >
                        <UserPlus
                            className="
                                w-3.5
                                h-3.5
                                text-rose-400
                            "
                        />

                        <span>
                            Waiting for invited members
                            to join
                        </span>
                    </div>
                )}

            </div>
        </motion.div>
    );
};

export default GroupTimerCard;