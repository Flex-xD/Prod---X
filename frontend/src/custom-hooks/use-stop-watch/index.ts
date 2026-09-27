import { useState, useRef, useCallback, useEffect } from "react";

interface UseStopwatchOptions {
    maxSeconds?: number; 
    onCapped?: () => void;
}

export const useStopwatch = ({ maxSeconds, onCapped }: UseStopwatchOptions = {}) => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);
    const reset = useCallback(() => { setIsRunning(false); setElapsedSeconds(0); }, []);

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

    const isCapped = maxSeconds !== undefined && elapsedSeconds >= maxSeconds;

    return { elapsedSeconds, isRunning, isCapped, start, pause, reset };
};