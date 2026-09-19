import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, Target, Calendar, Play, Pause, Send, AlertTriangle } from "lucide-react";
import { CircularRing, SlimBar, StatChip, MagBtn } from "../ui";
import { sp, softSp } from "../constants";
import { formatSeconds, formatMinutes, progressPercent, isExpired } from "../utils";
import type { IProductivityTimer } from "../types";
import useSubmitProductivityTimeMutation from "@/custom-hooks/productivity-timer/submit-productivity";
import { useStopwatch } from "@/custom-hooks/use-stop-watch";

interface IndividualTimerDetailProps {
    timer: IProductivityTimer;
    onBack: () => void;
}

const IndividualTimerDetail = ({ timer, onBack }: IndividualTimerDetailProps) => {
    const { elapsedSeconds, isRunning, start, pause, reset } = useStopwatch();
    const [localCompletedOffset, setLocalCompletedOffset] = useState(0);
    const { mutateAsync: submitProductivity, isPending } = useSubmitProductivityTimeMutation();

    const expired = isExpired(timer.deadline);
    const completedTime = (timer.completedTime ?? 0) + localCompletedOffset;
    const liveCompletedTime = completedTime + elapsedSeconds;
    const pct = progressPercent(liveCompletedTime, timer.specifiedTime);

    const description = timer.description?.trim() || "No description provided";
    const formattedDeadline = new Date(timer.deadline).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
    });

    const handleSubmit = async () => {
        if (elapsedSeconds === 0) return;
        await submitProductivity({ productivityTimerId: timer._id, productivityDuration: elapsedSeconds });
        setLocalCompletedOffset((prev) => prev + elapsedSeconds);
        reset();
    };

    return (
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={softSp}>
            <motion.button whileHover={{ x: -3 }} onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors mb-7 text-sm font-bold">
                <ArrowLeft className="w-4 h-4" /> Back to Timers
            </motion.button>

            <div className="relative rounded-3xl overflow-hidden mb-6"
                style={{ background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 45%, #4c1d95 100%)", boxShadow: "0 24px 72px rgba(79,46,220,0.42)" }}>
                <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(129,140,248,0.22), transparent)" }} />
                <div className="absolute bottom-0 -left-16 w-56 h-56 rounded-full"
                    style={{ background: "radial-gradient(circle, rgba(192,132,252,0.14), transparent)" }} />

                <div className="relative z-10 p-7 text-white">
                    <div className="flex items-start justify-between mb-7">
                        <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">Individual</span>

                                {expired ? (
                                    <span className="flex items-center gap-1 text-xs font-bold text-rose-300 bg-rose-400/10 border border-rose-300/20 px-2 py-0.5 rounded-full">
                                        <AlertTriangle className="w-3 h-3" /> Expired
                                    </span>
                                ) : timer.status === "pending" && isRunning ? (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                                    </span>
                                ) : timer.status === "pending" && (
                                    <span className="text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-300/20 px-2 py-0.5 rounded-full">
                                        Pending
                                    </span>
                                )}
                            </div>

                            <h2 className="text-2xl font-black leading-tight text-white break-words">{timer.title}</h2>
                            <p className="text-indigo-200 text-sm mt-2 font-medium leading-relaxed" title={description}>
                                {description}
                            </p>
                        </div>

                        <CircularRing percent={pct} size={104} stroke={7} color="#a78bfa" trackColor="rgba(255,255,255,0.12)">
                            <div className="text-center">
                                <div className="text-2xl font-black text-white leading-none">{pct}</div>
                                <div className="text-xs text-indigo-300 font-bold">%</div>
                            </div>
                        </CircularRing>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <StatChip icon={Clock} label="Done" value={formatSeconds(liveCompletedTime)} />
                        <StatChip icon={Target} label="Goal" value={formatMinutes(timer.specifiedTime)} />
                        <StatChip icon={Calendar} label="Due" value={formattedDeadline} />
                    </div>

                    <div className="mb-7">
                        <div className="flex justify-between text-xs font-bold text-indigo-300 mb-2">
                            <span>Progress</span>
                            <span>{pct}% complete</span>
                        </div>
                        <SlimBar percent={pct} gradient="linear-gradient(90deg,#a78bfa,#818cf8)" height={6} trackColor="rgba(255,255,255,0.12)" />
                    </div>

                    {expired ? (
                        <div className="flex items-center gap-2 py-3.5 px-4 rounded-2xl text-sm font-bold text-rose-200"
                            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
                            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                            This session's deadline has passed — you can no longer log time here.
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <MagBtn
                                onClick={() => (isRunning ? pause() : start())}
                                className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                                style={{
                                    background: isRunning ? "rgba(239,68,68,0.15)" : "white",
                                    color: isRunning ? "#fca5a5" : "#4338ca",
                                    border: isRunning ? "1px solid rgba(239,68,68,0.3)" : "none",
                                    boxShadow: isRunning ? "none" : "0 4px 16px rgba(0,0,0,0.15)",
                                }}
                            >
                                {isRunning ? (<><Pause className="w-4 h-4" /> Pause</>) : (<><Play className="w-4 h-4" /> {elapsedSeconds > 0 ? "Resume" : "Start Productivity"}</>)}
                            </MagBtn>

                            <AnimatePresence>
                                {elapsedSeconds > 0 && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.7, width: 0 }}
                                        animate={{ opacity: 1, scale: 1, width: "auto" }}
                                        exit={{ opacity: 0, scale: 0.7, width: 0 }}
                                        transition={sp}
                                        whileTap={{ scale: 0.93 }}
                                        disabled={isPending}
                                        onClick={handleSubmit}
                                        className="px-5 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 overflow-hidden whitespace-nowrap text-white disabled:opacity-60"
                                        style={{ background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 8px 24px rgba(16,185,129,0.45)" }}
                                    >
                                        <Send className="w-4 h-4" /> {isPending ? "Submitting..." : `Submit ${formatSeconds(elapsedSeconds)}`}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default IndividualTimerDetail;