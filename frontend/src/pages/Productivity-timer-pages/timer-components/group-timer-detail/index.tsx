import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Clock,
    Target,
    Calendar,
    Play,
    Pause,
    Send,
    Users,
    AlertTriangle, // CHANGED: added for the expired-state banner
} from "lucide-react";

import {
    CircularRing,
    SlimBar,
    StatChip,
    MagBtn,
} from "../ui";

import { sp, softSp } from "../constants";

import {
    formatSeconds,
    formatMinutes,
    progressPercent,
    isExpired,
} from "../utils";

import type { IGroupTimer } from "../types";
import LeaderboardRow from "./leaderboard-row";
import { userAppStore } from "@/store";
import { useStopwatch } from "@/custom-hooks/use-stop-watch";
import useSubmitGroupProductivityTimeMutation from "@/custom-hooks/group-productivity-timer/submit-productivity-timer";

interface GroupTimerDetailProps {
    timer: IGroupTimer;
    onBack: () => void;
}

const GroupTimerDetail = ({
    timer,
    onBack,
}: GroupTimerDetailProps) => {
    const currentUserId = userAppStore((state) => state.user_id) ?? "";

    const { elapsedSeconds, isRunning, start, pause, reset } = useStopwatch();
    const [localOffset, setLocalOffset] = useState(0);
    const { mutateAsync: submitGroupProductivity, isPending } = useSubmitGroupProductivityTimeMutation();

    const expired = isExpired(timer.deadline);

    const myParticipant = timer.participants?.find(
        (participant) =>
            participant.user?._id === currentUserId
    );

    const baseCompletedTime = (myParticipant?.productivityDone ?? 0) + localOffset;
    const liveCompletedTime = baseCompletedTime + elapsedSeconds;

    const myProgress = progressPercent(
        liveCompletedTime,
        timer.specifiedTime
    );

    const sortedParticipants = [
        ...(timer.participants ?? []),
    ].sort((a, b) => a.rank - b.rank);

    const participantCount =
        timer.participants?.length ?? 0;

    const invitedCount =
        timer.invitedUsersId?.length ?? 0;

    const description =
        timer.description?.trim() ||
        "No description provided";

    const formattedDeadline = new Date(
        timer.deadline
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const isPendingStatus = timer.status === "pending";
    const isActive = timer.isActive;

    const handleSubmit = async () => {
        if (elapsedSeconds === 0) return;
        await submitGroupProductivity({
            groupTimerId: timer._id,
            productivityDuration: elapsedSeconds,
        });
        setLocalOffset((prev) => prev + elapsedSeconds);
        reset();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={softSp}
        >
            {/* ───────────────── Back ───────────────── */}

            <motion.button
                whileHover={{ x: -3 }}
                onClick={onBack}
                className="
                    flex items-center gap-2
                    text-slate-400
                    hover:text-slate-800
                    transition-colors
                    mb-7
                    text-sm
                    font-bold
                "
            >
                <ArrowLeft className="w-4 h-4" />

                Back to Timers
            </motion.button>

            {/* ───────────────── Hero ───────────────── */}

            <div
                className="
                    relative
                    rounded-3xl
                    overflow-hidden
                    mb-6
                    text-white
                "
                style={{
                    background:
                        "linear-gradient(145deg, #4a0028 0%, #831843 45%, #9f1239 100%)",

                    boxShadow:
                        "0 24px 72px rgba(190,24,93,0.42)",
                }}
            >
                {/* Background glow */}

                <div
                    className="
                        absolute
                        -top-20
                        -right-20
                        w-72
                        h-72
                        rounded-full
                    "
                    style={{
                        background:
                            "radial-gradient(circle, rgba(244,114,182,0.22), transparent)",
                    }}
                />

                <div
                    className="
                        absolute
                        bottom-0
                        -left-16
                        w-56
                        h-56
                        rounded-full
                    "
                    style={{
                        background:
                            "radial-gradient(circle, rgba(251,113,133,0.14), transparent)",
                    }}
                />

                <div className="relative z-10 p-7">

                    {/* ───────────── Title + Progress ───────────── */}

                    <div className="flex items-start justify-between mb-7">

                        <div className="flex-1 min-w-0 pr-5">

                            {/* Type + Status */}

                            <div className="flex items-center gap-3 mb-2">

                                <span
                                    className="
                                        text-xs
                                        font-black
                                        text-rose-300
                                        uppercase
                                        tracking-widest
                                    "
                                >
                                    Group Timer
                                </span>

                                {/*  expired badge takes priority over live/inactive */}
                                {expired ? (
                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            text-xs
                                            font-bold
                                            text-rose-300
                                            bg-rose-400/10
                                            border
                                            border-rose-300/20
                                            px-2
                                            py-0.5
                                            rounded-full
                                        "
                                    >
                                        <AlertTriangle className="w-3 h-3" />
                                        Expired
                                    </span>
                                ) : isActive ? (
                                    <span
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            text-xs
                                            font-bold
                                            text-emerald-300
                                        "
                                    >
                                        <span
                                            className="
                                                w-1.5
                                                h-1.5
                                                rounded-full
                                                bg-emerald-400
                                                animate-pulse
                                            "
                                        />

                                        Live
                                    </span>
                                ) : (
                                    <span
                                        className="
                                            text-xs
                                            font-bold
                                            text-slate-300
                                        "
                                    >
                                        Inactive
                                    </span>
                                )}

                            </div>

                            {/* Title */}

                            <h2
                                className="
                                    text-2xl
                                    font-black
                                    leading-tight
                                    text-white
                                    break-words
                                "
                            >
                                {timer.title}
                            </h2>

                            {/* Description */}

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-rose-200/80
                                    font-medium
                                    leading-relaxed
                                    max-w-xl
                                "
                                title={description}
                            >
                                {description}
                            </p>

                            {/* Timer status */}

                            <div className="flex items-center gap-2 mt-3">

                                <span
                                    className={`
                                        px-2.5
                                        py-1
                                        rounded-full
                                        text-xs
                                        font-bold
                                        ${isPendingStatus
                                            ? "bg-amber-400/10 text-amber-200"
                                            : "bg-emerald-400/10 text-emerald-200"
                                        }
                                    `}
                                >
                                    {timer.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        timer.status.slice(1)}
                                </span>

                                <span className="text-rose-300 text-xs">
                                    {invitedCount} invited
                                </span>

                            </div>
                        </div>

                        {/* My progress ring */}

                        <CircularRing
                            percent={myProgress}
                            size={104}
                            stroke={7}
                            color="#fb7185"
                            trackColor="rgba(255,255,255,0.12)"
                        >
                            <div className="text-center">

                                <div
                                    className="
                                        text-2xl
                                        font-black
                                        text-white
                                        leading-none
                                    "
                                >
                                    {myProgress}
                                </div>

                                <div
                                    className="
                                        text-xs
                                        text-rose-300
                                        font-bold
                                    "
                                >
                                    %
                                </div>

                            </div>
                        </CircularRing>
                    </div>

                    {/* ───────────── Stats ───────────── */}

                    <div className="grid grid-cols-3 gap-3 mb-6">

                        <StatChip
                            icon={Clock}
                            label="My Time"
                            value={
                                myParticipant
                                    ? formatSeconds(liveCompletedTime)
                                    : "0m"
                            }
                        />

                        <StatChip
                            icon={Target}
                            label="Goal"
                            value={formatMinutes(
                                timer.specifiedTime
                            )}
                        />

                        <StatChip
                            icon={Calendar}
                            label="Due"
                            value={formattedDeadline}
                        />

                    </div>

                    {/* ───────────── Progress ───────────── */}

                    <div className="mb-7">

                        <div
                            className="
                                flex
                                justify-between
                                text-xs
                                font-bold
                                text-rose-300
                                mb-2
                            "
                        >
                            <span>Your Progress</span>

                            {/* was myProgress computed off the stale server value; now off the live one */}
                            <span>
                                {myProgress}%
                            </span>
                        </div>

                        <SlimBar
                            percent={myProgress}
                            gradient="linear-gradient(90deg,#fb7185,#f43f5e)"
                            height={6}
                            trackColor="rgba(255,255,255,0.12)"
                        />

                    </div>

                    {/* ───────────── Actions ───────────── */}

                    {expired ? (
                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                py-3.5
                                px-4
                                rounded-2xl
                                text-sm
                                font-bold
                                text-rose-200
                            "
                            style={{
                                background: "rgba(239,68,68,0.12)",
                                border: "1px solid rgba(239,68,68,0.25)",
                            }}
                        >
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            This session's deadline has passed — you can no longer log time here.
                        </div>
                    ) : (
                        <div className="flex gap-3">

                            <MagBtn
                                onClick={() =>
                                    isRunning ? pause() : start()
                                }
                                className="
                                    flex-1
                                    py-3.5
                                    rounded-2xl
                                    font-bold
                                    text-sm
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    transition-all
                                "
                                style={{
                                    background: isRunning
                                        ? "rgba(239,68,68,0.15)"
                                        : "white",

                                    color: isRunning
                                        ? "#fca5a5"
                                        : "#be123c",

                                    border: isRunning
                                        ? "1px solid rgba(239,68,68,0.3)"
                                        : "none",

                                    boxShadow: isRunning
                                        ? "none"
                                        : "0 4px 16px rgba(0,0,0,0.15)",
                                }}
                            >
                                {isRunning ? (
                                    <>
                                        <Pause className="w-4 h-4" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4" />
                                        {/* CHANGED: says "Resume" if there's already unsent elapsed time */}
                                        {elapsedSeconds > 0 ? "Resume" : "Start Productivity"}
                                    </>
                                )}
                            </MagBtn>

                            <AnimatePresence>
                                {/*  was gated on `isRunning`, now gated on elapsedSeconds > 0
                                    so the Submit button stays visible even while paused, as long as
                                    there's unsent time on the stopwatch. */}
                                {elapsedSeconds > 0 && (
                                    <motion.button
                                        initial={{
                                            opacity: 0,
                                            scale: 0.7,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.7,
                                        }}
                                        transition={sp}
                                        whileTap={{
                                            scale: 0.93,
                                        }}
                                        disabled={isPending}
                                        onClick={handleSubmit}
                                        className="
                                            px-5
                                            py-3.5
                                            rounded-2xl
                                            font-bold
                                            text-sm
                                            flex
                                            items-center
                                            gap-2
                                            text-white
                                            disabled:opacity-60
                                        "
                                        style={{
                                            background:
                                                "linear-gradient(135deg,#10b981,#059669)",

                                            boxShadow:
                                                "0 8px 24px rgba(16,185,129,0.45)",
                                        }}
                                    >
                                        <Send className="w-4 h-4" />
                                        {/*  shows the actual amount being submitted + pending state */}
                                        {isPending ? "Submitting..." : `Submit ${formatSeconds(elapsedSeconds)}`}
                                    </motion.button>
                                )}
                            </AnimatePresence>

                        </div>
                    )}

                </div>
            </div>

            {/* ───────────────── Participants ───────────────── */}

            <motion.div
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    delay: 0.15,
                    ...sp,
                }}
                className="
                    rounded-3xl
                    bg-white
                    overflow-hidden
                "
                style={{
                    boxShadow:
                        "0 4px 24px rgba(0,0,0,0.07)",

                    border:
                        "1px solid rgba(0,0,0,0.05)",
                }}
            >

                {/* Header */}

                <div
                    className="
                        px-6
                        pt-6
                        pb-4
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-50
                    "
                >
                    <div>

                        <h3
                            className="
                                font-black
                                text-slate-900
                                text-lg
                            "
                        >
                            Squad Rankings
                        </h3>

                        <p
                            className="
                                text-slate-400
                                text-xs
                                mt-0.5
                                font-medium
                            "
                        >
                            {participantCount}{" "}
                            {participantCount === 1
                                ? "participant"
                                : "participants"}
                        </p>

                    </div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            px-3
                            py-1.5
                            rounded-full
                        "
                        style={{
                            background: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                        }}
                    >
                        <span
                            className="
                                w-1.5
                                h-1.5
                                rounded-full
                                bg-emerald-400
                                animate-pulse
                            "
                        />

                        <span
                            className="
                                text-xs
                                font-bold
                                text-emerald-700
                            "
                        >
                            Live updates
                        </span>
                    </div>
                </div>

                {/* Participant list */}

                {sortedParticipants.length > 0 ? (
                    <div className="p-4 space-y-2">

                        {sortedParticipants.map((participant) => (
                            <LeaderboardRow
                                key={participant.user._id}
                                participant={participant}
                                specifiedTime={timer.specifiedTime}
                            />
                        ))}

                    </div>
                ) : (

                    /* Empty participant state */

                    <div className="px-6 py-10 text-center">

                        <div
                            className="
                                mx-auto
                                w-12
                                h-12
                                rounded-2xl
                                bg-rose-50
                                flex
                                items-center
                                justify-center
                                mb-3
                            "
                        >
                            <Users
                                className="
                                    w-5
                                    h-5
                                    text-rose-400
                                "
                            />
                        </div>

                        <h4
                            className="
                                font-black
                                text-slate-800
                                text-sm
                            "
                        >
                            No participants yet
                        </h4>

                        <p
                            className="
                                text-slate-400
                                text-xs
                                mt-1
                                max-w-xs
                                mx-auto
                            "
                        >
                            Invited users will appear here
                            once they join the group timer.
                        </p>

                    </div>
                )}

            </motion.div>

        </motion.div>
    );
};

export default GroupTimerDetail;