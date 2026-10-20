import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Target, Calendar, Play, Pause, Send, AlertTriangle } from 'lucide-react';
import { CircularRing, SlimBar, StatChip, PressBtn } from '../ui';
import { enter, quick } from '@/lib/motion';
import { formatSeconds, formatMinutes, progressPercent, isExpired } from '../utils';
import type { IProductivityTimer } from '../types';
import useSubmitProductivityTimeMutation from '@/custom-hooks/productivity-timer/submit-productivity';
import { useStopwatch } from '@/custom-hooks/use-stop-watch';
import CompletionModal from '../completion-modal';

interface IndividualTimerDetailProps {
    timer: IProductivityTimer;
    onBack: () => void;
}

const IndividualTimerDetail = ({ timer, onBack }: IndividualTimerDetailProps) => {
    const [localCompletedOffset, setLocalCompletedOffset] = useState(0);
    const { mutateAsync: submitProductivity, isPending } = useSubmitProductivityTimeMutation();

    const expired = isExpired(timer.deadline);
    const baseCompletedTime = (timer.completedTime ?? 0) + localCompletedOffset;
    const goalSeconds = timer.specifiedTime * 60;

    const remainingSeconds = Math.max(goalSeconds - baseCompletedTime, 0);

    const { elapsedSeconds, isRunning, isCapped, start, pause, reset } = useStopwatch({
        maxSeconds: remainingSeconds > 0 ? remainingSeconds : undefined,
        persistKey: `productivity-timer-${timer._id}`,
    });

    const liveCompletedTime = baseCompletedTime + elapsedSeconds;
    const pct = progressPercent(liveCompletedTime, timer.specifiedTime);

    const description = timer.description?.trim() || 'No description provided';
    const formattedDeadline = new Date(timer.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const prevStatusRef = useRef(timer.status);

    useEffect(() => {
        if (prevStatusRef.current !== 'done' && timer.status === 'done') {
            setShowCompletionModal(true);
        }
        prevStatusRef.current = timer.status;
    }, [timer.status]);

    const handleSubmit = async () => {
        if (elapsedSeconds === 0) return;
        await submitProductivity({ productivityTimerId: timer._id, productivityDuration: elapsedSeconds });
        setLocalCompletedOffset((prev) => prev + elapsedSeconds);
        reset();
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

                {/* Hero: ink panel + inverted focus ring (foundation rule) */}
                <div className="focus-ring-invert mb-6 rounded-lg border-2 border-ink bg-ink p-6 text-paper shadow-hard">
                    <div className="mb-7 flex items-start justify-between gap-5">
                        <div className="min-w-0 flex-1 pr-4">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-paper/60">
                                    Individual
                                </span>

                                {expired ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-alert/60 bg-alert/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-alert-tint">
                                        <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Expired
                                    </span>
                                ) : timer.status === 'pending' && isRunning ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-focus px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-ink">
                                        <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden="true" /> Active
                                    </span>
                                ) : (
                                    timer.status === 'pending' && (
                                        <span className="rounded-full bg-focus-tint px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-focus-deep">
                                            Pending
                                        </span>
                                    )
                                )}

                                {isCapped && !expired && (
                                    <span className="rounded-full border border-progress/60 bg-progress/15 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-progress-tint">
                                        Goal reached - submit to finish!
                                    </span>
                                )}
                            </div>

                            <h2 className="break-words text-2xl font-bold leading-tight text-paper">{timer.title}</h2>
                            <p className="mt-2 text-sm font-medium leading-relaxed text-paper/70" title={description}>
                                {description}
                            </p>
                        </div>

                        {/* Green ring: your completion, not decoration. */}
                        <CircularRing percent={pct} size={104} stroke={7} color="#a8d95b" trackColor="rgba(244,240,230,0.16)">
                            <div className="text-center">
                                <div className="font-mono text-2xl font-bold leading-none tabular-nums text-paper">{pct}</div>
                                <div className="text-xs font-bold text-paper/60">%</div>
                            </div>
                        </CircularRing>
                    </div>

                    <div className="mb-6 grid grid-cols-3 gap-3">
                        <StatChip icon={Clock} label="Done" value={formatSeconds(liveCompletedTime)} />
                        <StatChip icon={Target} label="Goal" value={formatMinutes(timer.specifiedTime)} />
                        <StatChip icon={Calendar} label="Due" value={formattedDeadline} />
                    </div>

                    <div className="mb-7">
                        <div className="mb-2 flex justify-between text-[11px] font-bold uppercase tracking-wider text-paper/60">
                            <span>Progress</span>
                            <span className="font-mono tabular-nums text-progress-tint">{pct}% complete</span>
                        </div>
                        <SlimBar percent={pct} height={6} trackClass="bg-paper/15" />
                    </div>

                    {expired ? (
                        <div className="flex items-center gap-2 rounded-lg border border-alert/60 bg-alert/15 px-4 py-3.5 text-sm font-bold text-alert-tint">
                            <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                            This session's deadline has passed - you can no longer log time here.
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
                                        className="press-hard inline-flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-lg border-2 border-ink bg-progress px-5 py-3.5 text-sm font-bold text-ink disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" aria-hidden="true" />
                                        {isPending
                                            ? 'Working...'
                                            : isCapped
                                                ? 'Complete Session'
                                                : `Submit ${formatSeconds(elapsedSeconds)}`}
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </motion.div>

            <CompletionModal
                isOpen={showCompletionModal}
                onClose={() => setShowCompletionModal(false)}
                title="Session Complete"
                message={`You hit your goal on "${timer.title}". Nice work - it's been moved to your Completed sessions.`}
                primaryLabel="Back to Timers"
                onPrimary={() => {
                    setShowCompletionModal(false);
                    onBack();
                }}
            />
        </>
    );
};

export default IndividualTimerDetail;