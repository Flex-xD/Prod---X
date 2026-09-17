import { useState, useRef, useCallback, useEffect } from "react";

export const useStopwatch = () => {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        setElapsedSeconds(0);
    }, []);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    return { elapsedSeconds, isRunning, start, pause, reset };
};