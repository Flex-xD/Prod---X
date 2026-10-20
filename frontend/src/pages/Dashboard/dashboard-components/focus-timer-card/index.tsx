import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Send } from 'lucide-react';
import { spring, quick } from '@/lib/motion';
import {
    useAcquireFocusLock,
    useFocusLockStatus,
    useLogPomodoroFocus,
    usePauseFocusLock,
    useReleaseFocusLock,
} from '@/custom-hooks/dashboard/use-focus-lock';

const POMODORO_SECONDS = 25 * 60;
const POMODORO_REF_ID = 'pomodoro';
const STORAGE_KEY = 'prodx:pomodoro';

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

interface PersistedPomodoro {
    remaining: number;
    completed: boolean;
    updatedAt: number;
}

const readPersisted = (): PersistedPomodoro | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const writePersisted = (state: PersistedPomodoro) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        /* storage unavailable, degrade silently */
    }
};

const FocusTimerCard = () => {
    // * A session always comes back PAUSED with the exact time it had — closing
    // * the tab (or leaving the dashboard) freezes it instead of losing time.
    const initial = (() => {
        const persisted = readPersisted();
        if (!persisted || typeof persisted.remaining !== 'number') {
            return { remaining: POMODORO_SECONDS, completed: false };
        }
        return {
            remaining: Math.min(Math.max(0, persisted.remaining), POMODORO_SECONDS),
            completed: !!persisted.completed,
        };
    })();

    const [remaining, setRemaining] = useState(initial.remaining);
    const [running, setRunning] = useState(false);
    const [completed, setCompleted] = useState(initial.completed);

    const remainingRef = useRef(initial.remaining);
    const completedRef = useRef(initial.completed);
    const runningRef = useRef(false);
    const runStartedAtRef = useRef<number | null>(null);
    const autoLoggedRef = useRef(false);

    const { data: lockData } = useFocusLockStatus();
    const acquireLock = useAcquireFocusLock();
    const pauseLock = usePauseFocusLock();
    const releaseLock = useReleaseFocusLock();
    const logFocus = useLogPomodoroFocus();

    const persist = useCallback(() => {
        writePersisted({
            remaining: remainingRef.current,
            completed: completedRef.current,
            updatedAt: Date.now(),
        });
    }, []);

    // * Keep refs + storage in sync with rendered state.
    useEffect(() => {
        remainingRef.current = remaining;
        completedRef.current = completed;
        persist();
    }, [remaining, completed, persist]);

    // * Ticking while running.
    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
        return () => clearInterval(id);
    }, [running]);

    // * Completion: stop, mark complete, and log the full session as productivity.
    useEffect(() => {
        if (running && remaining === 0) {
            setRunning(false);
            setCompleted(true);
            runningRef.current = false;
            runStartedAtRef.current = null;
            if (!autoLoggedRef.current) {
                autoLoggedRef.current = true;
                logFocus.mutate({ seconds: POMODORO_SECONDS });
            }
        }
    }, [running, remaining, logFocus]);

    useEffect(() => {
        runningRef.current = running;
    }, [running]);

    // * Keep the latest pause mutation in a ref so the unmount effect below
    // * never re-subscribes (mutation objects are not referentially stable).
    const pauseLockRef = useRef(pauseLock);
    useEffect(() => {
        pauseLockRef.current = pauseLock;
    }, [pauseLock]);

    // * Freeze on tab close / reload — never lose or double-count seconds.
    useEffect(() => {
        const freeze = () => persist();
        window.addEventListener('pagehide', freeze);
        return () => {
            window.removeEventListener('pagehide', freeze);
            freeze();
            // * Leaving the dashboard while running freezes the session locally,
            // * so tell the backend to pause the lock too — otherwise the
            // * /timer gate would stay closed for a session that isn't running.
            if (runningRef.current) {
                pauseLockRef.current.mutate({ refId: POMODORO_REF_ID, elapsedSinceStart: 0 });
            }
        };
    }, [persist]);

    // * If the backend still believes a pomodoro is running (e.g. the tab was
    // * killed before the pause could be sent), reconcile it to paused.
    const reconciledRef = useRef(false);
    const lock = lockData?.data;
    useEffect(() => {
        if (reconciledRef.current) return;
        if (lock?.sessionType === 'pomodoro' && lock?.isRunning && !running) {
            reconciledRef.current = true;
            pauseLock.mutate({ refId: POMODORO_REF_ID, elapsedSinceStart: 0 });
        }
    }, [lock, running, pauseLock]);

    const focusedSeconds = POMODORO_SECONDS - remaining;

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

    // * Starting/resuming requires the backend focus lock (blocks a second
    // * session elsewhere and is what the /timer gate listens to).
    const beginSession = (fromCompleted = false) => {
        acquireLock.mutate(
            { sessionType: 'pomodoro', refId: POMODORO_REF_ID },
            {
                onSuccess: () => {
                    if (fromCompleted) {
                        setCompleted(false);
                        setRemaining(POMODORO_SECONDS);
                    }
                    autoLoggedRef.current = false;
                    setRunning(true);
                    runStartedAtRef.current = Date.now();
                },
            }
        );
    };

    const handleToggle = () => {
        if (completed) {
            beginSession(true);
            return;
        }
        if (running) {
            const elapsedSinceStart = runStartedAtRef.current
                ? Math.floor((Date.now() - runStartedAtRef.current) / 1000)
                : 0;
            setRunning(false);
            runStartedAtRef.current = null;
            pauseLock.mutate({ refId: POMODORO_REF_ID, elapsedSinceStart });
            return;
        }
        beginSession();
    };

    // * Explicit "submit": logs what's focused so far as productivity,
    // * resets the session and releases the backend lock.
    const handleLogSession = () => {
        const seconds = POMODORO_SECONDS - remainingRef.current;
        if (seconds <= 0) return;
        logFocus.mutate(
            { seconds },
            {
                onSuccess: () => {
                    setRunning(false);
                    setCompleted(false);
                    setRemaining(POMODORO_SECONDS);
                    autoLoggedRef.current = false;
                    runStartedAtRef.current = null;
                },
            }
        );
    };

    const reset = () => {
        setRunning(false);
        setCompleted(false);
        setRemaining(POMODORO_SECONDS);
        autoLoggedRef.current = false;
        runStartedAtRef.current = null;
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
        // * deleteOne on a non-existent lock is a no-op — safe to always release.
        releaseLock.mutate(POMODORO_REF_ID);
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

    const lockBusy = acquireLock.isPending;

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
                    disabled={lockBusy}
                    aria-label={toggleAria}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-ink bg-focus px-4 py-3 text-sm font-bold text-ink transition-all duration-fast hover:-translate-y-px active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-60"
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

                {focusedSeconds > 0 && (
                    <button
                        type="button"
                        onClick={handleLogSession}
                        disabled={logFocus.isPending}
                        aria-label={`Log ${fmt(focusedSeconds)} as productivity`}
                        title={`Log ${fmt(focusedSeconds)} as productivity`}
                        className="press-hard inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-ink bg-progress px-4 py-3 text-sm font-bold text-ink transition-all duration-fast hover:-translate-y-px active:translate-y-[2px] disabled:pointer-events-none disabled:opacity-60"
                    >
                        <Send className="h-4 w-4" aria-hidden="true" />
                        {logFocus.isPending ? 'Logging...' : `Log ${fmt(focusedSeconds)}`}
                    </button>
                )}

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
