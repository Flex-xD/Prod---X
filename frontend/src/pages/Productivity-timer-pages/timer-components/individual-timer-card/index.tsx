import { motion } from "framer-motion";
import {
    Timer,
    Clock,
    Target,
    Calendar,
} from "lucide-react";

import { SlimBar } from "../ui";
import { sp } from "../constants";

import {
    formatSeconds,
    formatMinutes,
    progressPercent,
    getAvatarColors,
} from "../utils";

import type { IProductivityTimer } from "../types";

interface IndividualTimerCardProps {
    timer: IProductivityTimer;
    index: number;
    onClick: () => void;
}

const IndividualTimerCard = ({
    timer,
    index,
    onClick,
}: IndividualTimerCardProps) => {

    const completedTime = timer.completedTime ?? 0;

    const pct = progressPercent(
        completedTime,
        timer.specifiedTime
    );

    const [c1, c2] = getAvatarColors(index);


    const description =
        timer.description?.trim() ||
        "No description provided";

    const formattedDeadline = new Date(
        timer.deadline
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });

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
                        `linear-gradient(90deg, ${c1}, ${c2}44)`,
                }}
            />

            {timer.isActive && (
                <div className="absolute top-4 right-4">
                    <span className="relative flex h-2.5 w-2.5">
                        <span
                            className="
                                animate-ping
                                absolute
                                inset-0
                                rounded-full
                                bg-emerald-400
                                opacity-70
                            "
                        />

                        <span
                            className="
                                relative
                                rounded-full
                                h-2.5
                                w-2.5
                                bg-emerald-500
                            "
                        />
                    </span>
                </div>
            )}

            <div className="p-5">

                <div className="flex items-start gap-3 mb-4">

                    {/* Timer Icon */}

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
                            background: `${c1}18`,
                            border:
                                `1.5px solid ${c1}30`,
                        }}
                    >
                        <Timer
                            className="w-5 h-5"
                            style={{
                                color: c1,
                            }}
                        />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">

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

    {timer.status === "pending" && (
        <span
            className="
                flex-shrink-0
                text-[10px]
                font-bold
                text-amber-600
                bg-amber-50
                px-1.5
                py-0.5
                rounded-full
            "
        >
            Pending
        </span>
    )}

    {timer.isActive && (
        <span
            className="
                flex-shrink-0
                text-[10px]
                font-bold
                text-emerald-600
                bg-emerald-50
                px-1.5
                py-0.5
                rounded-full
            "
        >
            Active
        </span>
    )}
</div>

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

                    </div>

                    <div className="flex-shrink-0 text-right">

                        <span
                            className="
                                text-2xl
                                font-black
                            "
                            style={{
                                color: c1,
                            }}
                        >
                            {pct}
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

                <SlimBar
                    percent={pct}
                    gradient={
                        `linear-gradient(90deg, ${c1}, ${c2})`
                    }
                    height={4}
                />

                <div className="flex items-center justify-between mt-4">

                    <span
                        className="
                            flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            text-slate-400
                        "
                    >
                        <Clock className="w-3 h-3" />

                        {formatSeconds(completedTime)}
                    </span>

                    <span
                        className="
                            flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            text-slate-400
                        "
                    >
                        <Target className="w-3 h-3" />

                        {formatMinutes(
                            timer.specifiedTime
                        )}
                    </span>

                    <span
                        className="
                            flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            text-slate-400
                        "
                        title={timer.deadline}
                    >
                        <Calendar className="w-3 h-3" />

                        {formattedDeadline}
                    </span>

                </div>

            </div>
        </motion.div>
    );
};

export default IndividualTimerCard;