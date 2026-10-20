import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { spring, quick } from '@/lib/motion';

const POMODORO_SECONDS = 25 * 60;

const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

type TimerState = 'idle' | 'running' | 'paused' | 'completed';

// State is carried by text first, color second: orange = active focus,
// green = session complete, neutral = idle/paused.
const STATE_META: Record<TimerState, { label: string; pill: string }> = {
    idle: { label: 'Idle', pill: 'bg-paper/10 text-paper/70 border border-paper/30' },
    running: { label: 'Running', pill: 'bg-focus text-ink' },
    paused: { label: 'Paused', pill: 'bg-focus-tint text-ink' },
    completed: { label: 'Complete', pill: 'bg-progress text-ink' },
};

const FocusTimerCard = () => {
    const [remaining, setRemaining] = useState(POMODORO_SECONDS);
    const [running, setRunning] = useState(false);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
        return () => clearInterval(id);
    }, [running]);

    useEffect(() => {
        if (running && remaining === 0) {
            setRunning(false);
            setCompleted(true);
        }
    }, [running, remaining]);

    const state: TimerState = completed
        ? 'completed'
        : running
          ? 'running'
          : remaining < POMODORO_SECONDS
            ? 'paused'
            : 'idle';

    const meta = STATE_META[state];
    const pct = ((POMODORO_SECONDS - remaining) / POMODORO_SECONDS) * 100;
    const fill = state === 'completed' ? 'bg-progress' : 'bg-focus';

    const handleToggle = () => {
        if (completed) {
            setCompleted(false);
            setRemaining(POMODORO_SECONDS);
            setRunning(true);
            return;
        }
        setRunning((r) => !r);
    };

    const reset = () => {
        setRunning(false);
        setCompleted(false);
        setRemaining(POMODORO_SECONDS);
    };

    const toggleLabel =
        state === 'running'
            ? 'Pause'
            : state === 'paused'
              ? 'Resume'
              : state === 'completed'
                ? 'Restart'
                : 'Start focus';

    const toggleAria =
        state === 'running'
            ? 'Pause focus session'
            : state === 'paused'
              ? 'Resume focus session'
              : state === 'completed'
                ? 'Restart focus session'
                : 'Start focus session';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.08 }}
            className="focus-ring-invert rounded-lg border-2 border-ink bg-ink p-6 text-paper shadow-hard"
        >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-paper">
                        Focus Timer
                    </h2>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-paper/60">
                        Pomodoro · 25 min
                    </p>
                </div>
                <span
                    className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${meta.pill}`}
                >
                    {meta.label}
                </span>
            </div>

            {/* Time + session progress */}
            <div className="mb-6">
                <div className="mb-5 text-center">
                    <span
                        role="timer"
                        aria-atomic="true"
                        aria-live="off"
                        aria-label={`Focus session, ${fmt(remaining)} remaining, ${meta.label}`}
                        className="font-mono text-6xl font-bold leading-none tabular-nums"
                    >
                        {fmt(remaining)}
                    </span>
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/60">
                        {state === 'completed'
                            ? 'Session complete'
                            : state === 'running'
                              ? 'Focusing'
                              : state === 'paused'
                                ? 'Paused'
                                : 'Ready'}
                    </p>
                </div>

                <div
                    role="progressbar"
                    aria-valuenow={Math.round(pct)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Session progress"
                    className="h-3.5 w-full overflow-hidden rounded-sm border border-paper/25 bg-paper/10"
                >
                    <motion.div
                        className={`h-full rounded-sm ${fill}`}
                        initial={false}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-paper/50">
                    <span>Session progress</span>
                    <span className="font-mono tabular-nums">{Math.round(pct)}%</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2.5">
                <button
                    type="button"
                    onClick={handleToggle}
                    aria-label={toggleAria}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-ink bg-focus px-4 py-3 text-sm font-bold text-ink transition-all duration-fast hover:-translate-y-px active:translate-y-[2px]"
                >
                    <AnimatePresence mode="wait">
                        {state === 'running' ? (
                            <motion.span
                                key="pause"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={quick}
                                className="flex items-center gap-2"
                            >
                                <Pause className="h-4 w-4" aria-hidden="true" />
                                Pause
                            </motion.span>
                        ) : (
                            <motion.span
                                key="action"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={quick}
                                className="flex items-center gap-2"
                            >
                                <Play className="h-4 w-4" aria-hidden="true" />
                                {toggleLabel}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>

                <button
                    type="button"
                    onClick={reset}
                    aria-label="Reset session"
                    title="Reset session"
                    className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-lg border-2 border-paper/30 text-paper transition-all duration-fast hover:border-paper/60 active:translate-y-[2px]"
                >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
        </motion.div>
    );
};

export default FocusTimerCard;