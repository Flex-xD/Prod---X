import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

const POMODORO_SECONDS = 25 * 60;
const sp = { type: 'spring', damping: 28, stiffness: 300 } as const;

const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const FocusTimerCard = () => {
    const [remaining, setRemaining] = useState(POMODORO_SECONDS);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setRemaining(r => {
                    if (r <= 1) { setRunning(false); return POMODORO_SECONDS; }
                    return r - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [running]);

    const pct = ((POMODORO_SECONDS - remaining) / POMODORO_SECONDS) * 100;
    const size = 96;
    const stroke = 6;
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;

    const reset = () => { setRunning(false); setRemaining(POMODORO_SECONDS); };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ...sp }}
            className="relative rounded-3xl overflow-hidden text-white"
            style={{
                background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
                boxShadow: '0 16px 48px rgba(79,46,220,0.38)',
            }}
        >
            {/* Orbs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.22), transparent)' }} />
            <div className="absolute bottom-0 -left-8 w-32 h-32 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.16), transparent)' }} />

            <div className="relative z-10 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="font-black text-base text-white">Focus Timer</h3>
                        <p className="text-indigo-300 text-xs font-medium mt-0.5">Pomodoro • 25 min</p>
                    </div>
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                    >
                        <Clock className="w-4.5 h-4.5 w-[18px] h-[18px] text-indigo-300" />
                    </div>
                </div>

                {/* Ring + time */}
                <div className="flex items-center justify-center mb-5">
                    <div className="relative" style={{ width: size, height: size }}>
                        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                                stroke="rgba(255,255,255,0.1)" strokeWidth={stroke} />
                            <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none"
                                stroke="#a78bfa" strokeWidth={stroke} strokeLinecap="round"
                                strokeDasharray={circ}
                                animate={{ strokeDashoffset: offset }}
                                transition={{ duration: 0.5 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-white leading-none tabular-nums">
                                {fmt(remaining)}
                            </span>
                            {running && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-xs text-indigo-300 font-semibold mt-0.5"
                                >
                                    focusing
                                </motion.span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-2.5">
                    <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={() => setRunning(r => !r)}
                        className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                        style={{
                            background: running ? 'rgba(239,68,68,0.15)' : 'white',
                            color: running ? '#fca5a5' : '#4338ca',
                            border: running ? '1px solid rgba(239,68,68,0.3)' : 'none',
                            boxShadow: running ? 'none' : '0 4px 16px rgba(0,0,0,0.15)',
                        }}
                    >
                        <AnimatePresence mode="wait">
                            {running
                                ? <motion.span key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"><Pause className="w-4 h-4" />Pause</motion.span>
                                : <motion.span key="pl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex items-center gap-2"><Play className="w-4 h-4" />Start Focus</motion.span>
                            }
                        </AnimatePresence>
                    </motion.button>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={reset}
                        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                        title="Reset"
                    >
                        <RotateCcw className="w-4 h-4 text-indigo-300" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default FocusTimerCard;