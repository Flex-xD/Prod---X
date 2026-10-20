import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Target, Calendar, Play, Pause, Send, Users, AlertTriangle, Check, Archive } from 'lucide-react';

import { CircularRing, SlimBar, StatChip, PressBtn } from '../ui';
import { enter, quick } from '@/lib/motion';
import { formatSeconds, formatMinutes, progressPercent, isExpired } from '../utils';

import type { IGroupTimer } from '../types';
import LeaderboardRow from './leaderboard-row';
import { userAppStore } from '@/store';

import useArchiveGroupTimerMutation from '@/custom-hooks/group-productivity-timer/archive-group-timer';
import useSubmitGroupProductivityTimeMutation from '@/custom-hooks/group-productivity-timer/submit-productivity-timer';
import { useStopwatch } from '@/custom-hooks/use-stop-watch';
import CompletionModal from '../completion-modal';

interface GroupTimerDetailProps {
    timer: IGroupTimer;
    onBack: () => void;
    /** Lets the timer page block back-navigation while the stopwatch runs. */
    onRunningChange?: (running: boolean) => void;
}

const GroupTimerDetail = ({ timer, onBack, onRunningChange }: GroupTimerDetailProps) => {
    const currentUserId = userAppStore((state) => state.user_id) ?? '';
    const [localOffset, setLocalOffset] = useState(0);
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const { mutateAsync: submitGroupProductivity, isPending } = useSubmitGroupProductivityTimeMutation();
    const { mutate: archiveTimer, isPending: isArchiving } = useArchiveGroupTimerMutation();

    const expired = isExpired(timer.deadline);

    const myParticipant = timer.participants?.find((p) => p.user?._id === currentUserId);
    const baseCompletedTime = (myParticipant?.productivityDone ?? 0) + localOffset;
    const goalSeconds = timer.specifiedTime * 60;

    const prevCompletedRef = useRef(myParticipant?.hasCompleted ?? false);

    useEffect(() => {
        const nowCompleted = myParticipant?.hasCompleted ?? false;
        if (!prevCompletedRef.current && nowCompleted) {
            setShowCompletionModal(true);
        }
        prevCompletedRef.current = nowCompleted;
    }, [myParticipant?.hasCompleted]);

    const remainingSeconds = Math.max(goalSeconds - baseCompletedTime, 0);
    const { elapsedSeconds, isRunning, isCapped, start, pause, reset } = useStopwatch({
        maxSeconds: remainingSeconds > 0 ? remainingSeconds : undefined,
        persistKey: `group-timer-${timer._id}-${currentUserId || 'anonymous'}`,
    });

    // * Report the running state up so the page can gate "back" navigation,
    // * and make sure it resets when this view unmounts.
    useEffect(() => {
        onRunningChange?.(isRunning);
        return () => onRunningChange?.(false);
    }, [isRunning, onRunningChange]);

    const liveCompletedTime = baseCompletedTime + elapsedSeconds;
    const myProgress = progressPercent(liveCompletedTime, timer.specifiedTime);

    const sortedParticipants = [...(timer.participants ?? [])].sort((a, b) => a.rank - b.rank);
    const participantCount = timer.participants?.length ?? 0;
    const invitedCount = timer.invitedUsersId?.length ?? 0;

    const description = timer.description?.trim() || 'No description provided';
    const formattedDeadline = new Date(timer.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const isPendingStatus = timer.status === 'pending';
    const isActive = timer.isActive;

    const iHaveCompleted = myParticipant?.hasCompleted || isCapped;
    const iHaveArchived = myParticipant?.archived ?? false;

    const handleSubmit = async () => {
        if (elapsedSeconds === 0) return;
        await submitGroupProductivity({ groupTimerId: timer._id, productivityDuration: elapsedSeconds });
        setLocalOffset((prev) => prev + elapsedSeconds);
        reset();
    };

    const handleArchiveFromModal = () => {
        archiveTimer(
            { groupTimerId: timer._id },
            { onSuccess: () => { setShowCompletionModal(false); onBack(); } }
        );
    };

    return (
        <>
            <motion.div {...enter()}>
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-7 flex items-center gap-2 text-sm font-bold text-ink-soft transition-all duration-fast hover:-translate-x-0.5 hover:text-ink"
                >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to Timers
                </button>

                {/* Hero: an ink panel, per the foundation's dark-surface rule.
                    focus-ring-invert keeps keyboard focus visible on ink. */}
                <div className="focus-ring-invert mb-6 rounded-lg border-2 border-ink bg-ink p-6 text-paper shadow-hard">
                    <div className="mb-7 flex items-start justify-between gap-5">
                        <div className="min-w-0 flex-1 pr-4">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-paper/60">
                                    Group Timer
                                </span>

                                {expired ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-alert/60 bg-alert/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-alert-tint">
                                        <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Expired
                                    </span>
                                ) : isActive ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-focus px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink">
                                        <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden="true" /> Live
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-paper/60">
                                        Inactive
                                    </span>
                                )}

                                {iHaveCompleted && !expired && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-progress/60 bg-progress/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-progress-tint">
                                        <Check className="h-3 w-3" aria-hidden="true" /> Goal hit
                                    </span>
                                )}
                            </div>

                            <h2 className="break-words text-2xl font-bold leading-tight text-paper">{timer.title}</h2>
                            <p className="mt-2 max-w-xl text-sm font-medium leading-relaxed text-paper/70" title={description}>
                                {description}
                            </p>

                            <div className="mt-3 flex items-center gap-2">
                                <span
                                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${isPendingStatus ? 'bg-focus-tint text-focus-deep' : 'bg-progress-tint text-progress-deep'
                                        }`}
                                >
                                    {timer.status.charAt(0).toUpperCase() + timer.status.slice(1)}
                                </span>
                                <span className="text-xs font-semibold text-paper/60">{invitedCount} invited</span>
                            </div>
                        </div>

                        {/* Green ring: your completion, not decoration. */}
                        <CircularRing percent={myProgress} size={104} stroke={7} color="#a8d95b" trackColor="rgba(244,240,230,0.16)">
                            <div className="text-center">
                                <div className="font-mono text-2xl font-bold leading-none tabular-nums text-paper">{myProgress}</div>
                                <div className="text-xs font-bold text-paper/60">%</div>
                            </div>
                        </CircularRing>
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-3">
                        <StatChip icon={Clock} label="My Time" value={myParticipant ? formatSeconds(liveCompletedTime) : '0m'} />
                        <StatChip icon={Target} label="Goal" value={formatMinutes(timer.specifiedTime)} />
                        <StatChip icon={Calendar} label="Due" value={formattedDeadline} />
                    </div>

                    <div className="mb-7">
                        <div className="mb-2 flex justify-between text-[11px] font-bold uppercase tracking-wider text-paper/60">
                            <span>Your Progress</span>
                            <span className="font-mono tabular-nums text-progress-tint">{myProgress}%</span>
                        </div>
                        <SlimBar percent={myProgress} height={6} trackClass="bg-paper/15" />
                    </div>

                    {expired ? (
                        <div className="flex items-center gap-2 rounded-lg border border-alert/60 bg-alert/15 px-4 py-3.5 text-sm font-bold text-alert-tint">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                            This session's deadline has passed.
                        </div>
                    ) : myParticipant?.hasCompleted ? (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-progress/60 bg-progress/15 px-4 py-3.5 text-sm font-bold text-progress-tint">
                            <span className="flex items-center gap-2">
                                <Check className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                                You've hit your goal! The others can keep going.
                            </span>
                            {!iHaveArchived && (
                                <PressBtn
                                    variant="success"
                                    disabled={isArchiving}
                                    onClick={() => archiveTimer({ groupTimerId: timer._id })}
                                    className="py-2 text-xs"
                                >
                                    <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                                    {isArchiving ? 'Working...' : 'Move to Completed'}
                                </PressBtn>
                            )}
                        </div>
                    ) : (
                        <div className="flex gap-3">
                            <PressBtn
                                variant="focus"
                                disabled={isCapped}
                                onClick={() => (isRunning ? pause() : start())}
                                className="flex-1 py-3.5"
                            >
                                {isRunning ? (
                                    <>
                                        <Pause className="h-4 w-4" aria-hidden="true" /> Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4" aria-hidden="true" />{' '}
                                        {elapsedSeconds > 0 ? 'Resume' : 'Start Productivity'}
                                    </>
                                )}
                            </PressBtn>

                            <AnimatePresence>
                                {elapsedSeconds > 0 && (
                                    <motion.button
                                        type="button"
                                        initial={{ opacity: 0, y: 4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 4 }}
                                        transition={quick}
                                        disabled={isPending}
                                        onClick={handleSubmit}
                                        className="press-hard inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-progress px-5 py-3.5 text-sm font-bold text-ink disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" aria-hidden="true" />
                                        {isPending
                                            ? 'Working...'
                                            : isCapped
                                                ? 'Complete Goal'
                                                : `Submit ${formatSeconds(elapsedSeconds)}`}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Squad rankings: rows reorder with layout + spring
                    when live ranks change (the RankRows behavior,
                    kept in the one real leaderboard component). */}
                <motion.div {...enter(0.06)} className="overflow-hidden rounded-lg border-2 border-ink bg-surface shadow-hard">
                    <div className="flex items-center justify-between border-b-2 border-ink px-6 pb-4 pt-6">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">Squad Rankings</h3>
                            <p className="mt-0.5 text-[11px] font-medium text-ink-faint">
                                {participantCount} {participantCount === 1 ? 'participant' : 'participants'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-progress bg-progress-tint px-3 py-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-progress" aria-hidden="true" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-progress-deep">
                                Live updates
                            </span>
                        </div>
                    </div>

                    {sortedParticipants.length > 0 ? (
                        <div className="space-y-2 p-4">
                            {sortedParticipants.map((participant) => (
                                <LeaderboardRow
                                    key={participant.user._id}
                                    participant={participant}
                                    specifiedTime={timer.specifiedTime}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="px-6 py-10 text-center">
                            <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink bg-paper-deep text-ink-soft">
                                <Users className="h-5 w-5" aria-hidden="true" />
                            </span>
                            <h4 className="text-sm font-bold uppercase tracking-wider text-ink">No participants yet</h4>
                            <p className="mx-auto mt-1 max-w-xs text-xs font-medium text-ink-faint">
                                Invited users will appear here once they join the group timer.
                            </p>
                        </div>
                    )}
                </motion.div>
            </motion.div>

            <CompletionModal
                isOpen={showCompletionModal}
                onClose={() => setShowCompletionModal(false)}
                title="Goal Complete"
                message={`You've hit your goal on "${timer.title}". You can move it to Completed now, or leave it active to keep an eye on the rest of the squad.`}
                primaryLabel="Move to Completed"
                onPrimary={handleArchiveFromModal}
                primaryPending={isArchiving}
                secondaryLabel="Keep it active for now"
                onSecondary={() => setShowCompletionModal(false)}
            />
        </>
    );
};

export default GroupTimerDetail;