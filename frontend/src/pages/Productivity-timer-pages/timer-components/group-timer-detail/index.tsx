import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Target, Calendar, Play, Pause, Send } from 'lucide-react';
import { CircularRing, SlimBar, StatChip, MagBtn } from '../ui';
import { sp, softSp } from '../constants';
import { formatSeconds, formatMinutes, progressPercent } from '../utils';
import type { IGroupTimer } from '../types';
import LeaderboardRow from './leaderboard-row';

interface GroupTimerDetailProps {
    timer: IGroupTimer;
    onBack: () => void;
}

const GroupTimerDetail = ({ timer, onBack }: GroupTimerDetailProps) => {
    const [isRunning, setIsRunning] = useState(false);

    const myPart = timer.participants.find(p => p.user.id === 'me');
    const myPct = myPart ? progressPercent(myPart.productivityDone, timer.specifiedTime) : 0;
    const sorted = [...timer.participants].sort((a, b) => b.productivityDone - a.productivityDone);

    return (
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={softSp}>

            {/* ── Back button ── */}
            <motion.button
                whileHover={{ x: -3 }}
                onClick={onBack}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors mb-7 text-sm font-bold"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Timers
            </motion.button>

            {/* ── Hero card ── */}
            <div
                className="relative rounded-3xl overflow-hidden mb-6 text-white"
                style={{
                    background: 'linear-gradient(145deg, #4a0028 0%, #831843 45%, #9f1239 100%)',
                    boxShadow: '0 24px 72px rgba(190,24,93,0.42)',
                }}
            >
                <div
                    className="absolute -top-20 -right-20 w-72 h-72 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(244,114,182,0.22), transparent)' }}
                />
                <div
                    className="absolute bottom-0 -left-16 w-56 h-56 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(251,113,133,0.14), transparent)' }}
                />

                <div className="relative z-10 p-7">
                    {/* Title + ring */}
                    <div className="flex items-start justify-between mb-7">
                        <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-black text-rose-300 uppercase tracking-widest">Group Timer</span>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Live
                                </span>
                            </div>
                            <h2 className="text-2xl font-black leading-tight text-white">{timer.title}</h2>
                            <p className="text-rose-300 text-sm mt-1 font-medium">{timer.description}</p>
                        </div>

                        <CircularRing percent={myPct} size={104} stroke={7} color="#fb7185" trackColor="rgba(255,255,255,0.12)">
                            <div className="text-center">
                                <div className="text-2xl font-black text-white leading-none">{myPct}</div>
                                <div className="text-xs text-rose-300 font-bold">%</div>
                            </div>
                        </CircularRing>
                    </div>

                    {/* Stat chips */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <StatChip icon={Clock} label="My Time" value={myPart ? formatSeconds(myPart.productivityDone) : '0m'} />
                        <StatChip icon={Target} label="Goal" value={formatMinutes(timer.specifiedTime)} />
                        <StatChip icon={Calendar} label="Due" value={timer.deadline} />
                    </div>

                    {/* Progress bar */}
                    <div className="mb-7">
                        <div className="flex justify-between text-xs font-bold text-rose-300 mb-2">
                            <span>Your Progress</span><span>{myPct}%</span>
                        </div>
                        <SlimBar
                            percent={myPct}
                            gradient="linear-gradient(90deg,#fb7185,#f43f5e)"
                            height={6}
                            trackColor="rgba(255,255,255,0.12)"
                        />
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <MagBtn
                            onClick={() => setIsRunning(r => !r)}
                            className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                            style={{
                                background: isRunning ? 'rgba(239,68,68,0.15)' : 'white',
                                color: isRunning ? '#fca5a5' : '#be123c',
                                border: isRunning ? '1px solid rgba(239,68,68,0.3)' : 'none',
                                boxShadow: isRunning ? 'none' : '0 4px 16px rgba(0,0,0,0.15)',
                            }}
                        >
                            {isRunning
                                ? <><Pause className="w-4 h-4" />Pause</>
                                : <><Play className="w-4 h-4" />Start Productivity</>}
                        </MagBtn>

                        <AnimatePresence>
                            {isRunning && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.7 }}
                                    transition={sp}
                                    whileTap={{ scale: 0.93 }}
                                    className="px-5 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 text-white"
                                    style={{
                                        background: 'linear-gradient(135deg,#10b981,#059669)',
                                        boxShadow: '0 8px 24px rgba(16,185,129,0.45)',
                                    }}
                                >
                                    <Send className="w-4 h-4" />Submit
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ── Leaderboard ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, ...sp }}
                className="rounded-3xl bg-white overflow-hidden"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
            >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-50">
                    <div>
                        <h3 className="font-black text-slate-900 text-lg">Squad Rankings</h3>
                        <p className="text-slate-400 text-xs mt-0.5 font-medium">{timer.participants.length} participants</p>
                    </div>
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-700">Live updates</span>
                    </div>
                </div>

                {/* Rows */}
                <div className="p-4 space-y-2">
                    {sorted.map((participant, i) => (
                        <LeaderboardRow
                            key={participant.user.id}
                            participant={participant}
                            position={i}
                            specifiedTime={timer.specifiedTime}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default GroupTimerDetail;