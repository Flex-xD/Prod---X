import { useState, useRef, useCallback, useEffect } from "react";

interface UseStopwatchOptions {
    persistKey: string;
    maxSeconds?: number;
    onCapped?: () => void;
}

interface PersistedState {
    startedAt: number;
    accumulatedSeconds: number;
    isRunning: boolean;
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

export const useStopwatch = ({ persistKey, maxSeconds, onCapped }: UseStopwatchOptions) => {
    const storageKey = `prodx:stopwatch:${persistKey}`;

    const initial = (() => {
        const persisted = readPersisted(storageKey);
        if (!persisted) return { elapsedSeconds: 0, isRunning: false };
        const liveElapsed = persisted.isRunning
            ? persisted.accumulatedSeconds + Math.floor((Date.now() - persisted.startedAt) / 1000)
            : persisted.accumulatedSeconds;
        return { elapsedSeconds: Math.min(liveElapsed, maxSeconds ?? Infinity), isRunning: persisted.isRunning };
    })();

    const [elapsedSeconds, setElapsedSeconds] = useState(initial.elapsedSeconds);
    const [isRunning, setIsRunning] = useState(initial.isRunning);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const accumulatedRef = useRef(initial.isRunning ? initial.elapsedSeconds : initial.elapsedSeconds);
    const startedAtRef = useRef(Date.now());

    const persist = useCallback((running: boolean) => {
        writePersisted(storageKey, { startedAt: startedAtRef.current, accumulatedSeconds: accumulatedRef.current, isRunning: running });
    }, [storageKey]);

    const start = useCallback(() => {
        startedAtRef.current = Date.now();
        setIsRunning(true);
        persist(true);
    }, [persist]);

    const pause = useCallback(() => {
        accumulatedRef.current = elapsedSeconds;
        setIsRunning(false);
        persist(false);
    }, [elapsedSeconds, persist]);

    const reset = useCallback(() => {
        accumulatedRef.current = 0;
        setElapsedSeconds(0);
        setIsRunning(false);
        try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    }, [storageKey]);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setElapsedSeconds((s) => {
                    const next = s + 1;
                    if (maxSeconds !== undefined && next >= maxSeconds) {
                        accumulatedRef.current = maxSeconds;
                        setIsRunning(false);
                        persist(false);
                        onCapped?.();
                        return maxSeconds;
                    }
                    accumulatedRef.current = next;
                    return next;
                });
            }, 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isRunning, maxSeconds, onCapped, persist]);

    useEffect(() => {
        const interval = setInterval(() => { if (isRunning) persist(true); }, 10000);
        return () => clearInterval(interval);
    }, [isRunning, persist]);

    const isCapped = maxSeconds !== undefined && elapsedSeconds >= maxSeconds;
    return { elapsedSeconds, isRunning, isCapped, start, pause, reset };
};