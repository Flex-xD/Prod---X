import { useState, useRef, useCallback, useEffect } from "react";

interface UseStopwatchOptions {
    persistKey: string;
    maxSeconds?: number;
    onCapped?: () => void;
}

interface PersistedState {
    /** Seconds already banked at the moment of the write. */
    elapsedSeconds: number;
    isRunning: boolean;
    updatedAt: number;
}

const readPersisted = (key: string): PersistedState | null => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

const writePersisted = (key: string, state: PersistedState) => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* storage unavailable, degrade silently */ }
};

/**
 * Stopwatch with lossless persistence.
 *
 * - The exact elapsed seconds are written on every tick, on start/pause/reset,
 *   on unmount and on `pagehide`, so leaving the page never drops or
 *   double-counts time (the old version persisted accumulated time *and* the
 *   original start timestamp, which double-counted after a reload).
 * - A restored stopwatch always comes back PAUSED with the time it had, so an
 *   accidentally closed tab freezes the session exactly where it was.
 */
export const useStopwatch = ({ persistKey, maxSeconds, onCapped }: UseStopwatchOptions) => {
    const storageKey = `prodx:stopwatch:${persistKey}`;

    const initial = (() => {
        const persisted = readPersisted(storageKey);
        if (!persisted || typeof persisted.elapsedSeconds !== "number") {
            return { elapsedSeconds: 0, isRunning: false };
        }
        return {
            elapsedSeconds: Math.min(Math.max(0, persisted.elapsedSeconds), maxSeconds ?? Infinity),
            isRunning: false, // * always resume paused — never silently keep counting
        };
    })();

    const [elapsedSeconds, setElapsedSeconds] = useState(initial.elapsedSeconds);
    const [isRunning, setIsRunning] = useState(initial.isRunning);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const elapsedRef = useRef(initial.elapsedSeconds);

    const write = useCallback((running: boolean) => {
        writePersisted(storageKey, {
            elapsedSeconds: elapsedRef.current,
            isRunning: running,
            updatedAt: Date.now(),
        });
    }, [storageKey]);

    const setElapsed = useCallback((next: number) => {
        elapsedRef.current = next;
        setElapsedSeconds(next);
    }, []);

    const start = useCallback(() => {
        setIsRunning(true);
        write(true);
    }, [write]);

    const pause = useCallback(() => {
        setIsRunning(false);
        write(false);
    }, [write]);

    const reset = useCallback(() => {
        setElapsed(0);
        setIsRunning(false);
        try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    }, [storageKey, setElapsed]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setElapsedSeconds((s) => {
                    const next = s + 1;
                    if (maxSeconds !== undefined && next >= maxSeconds) {
                        setIsRunning(false);
                        onCapped?.();
                        return maxSeconds;
                    }
                    return next;
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, maxSeconds, onCapped]);

    // * Keep the ref in sync and flush on every change, so an abrupt close
    // * can never lose more than the current second.
    useEffect(() => {
        elapsedRef.current = elapsedSeconds;
        write(isRunning);
    }, [elapsedSeconds, isRunning, write]);

    // * Leaving the page (unmount) or closing/reloading the tab freezes the
    // * session exactly where it is — no lost seconds, no double counting.
    useEffect(() => {
        const freeze = () => write(false);
        window.addEventListener("pagehide", freeze);
        return () => {
            window.removeEventListener("pagehide", freeze);
            freeze();
        };
    }, [write]);

    const isCapped = maxSeconds !== undefined && elapsedSeconds >= maxSeconds;
    return { elapsedSeconds, isRunning, isCapped, start, pause, reset };
};