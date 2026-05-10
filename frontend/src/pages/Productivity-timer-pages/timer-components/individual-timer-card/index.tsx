import { motion } from 'framer-motion';
import { Timer, Clock, Target, Calendar } from 'lucide-react';
import { SlimBar } from '../ui';
import { sp } from '../constants';
import { formatSeconds, formatMinutes, progressPercent, getAvatarColors } from '../utils';
import type { IProductivityTimer } from '../types';

interface IndividualTimerCardProps {
    timer: IProductivityTimer;
    index: number;
    onClick: () => void;
}

const IndividualTimerCard = ({ timer, index, onClick }: IndividualTimerCardProps) => {
    const pct = progressPercent(timer.productivityDone, timer.specifiedTime);
    const [c1, c2] = getAvatarColors(index);

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, ...sp }}
            whileHover={{ y: -5, boxShadow: '0 24px 48px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.975 }}
            onClick={onClick}
            className="relative bg-white rounded-3xl overflow-hidden cursor-pointer"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
            {/* Per-card colour accent stripe */}
            <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: `linear-gradient(90deg, ${c1}, ${c2}44)` }}
            />

            {/* Active pulse indicator */}
            {timer.isActive && (
                <div className="absolute top-4 right-4">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-70" />
                        <span className="relative rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                </div>
            )}

            <div className="p-5">
                {/* Header row */}
                <div className="flex items-start gap-3 mb-4">
                    <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: `${c1}18`, border: `1.5px solid ${c1}30` }}
                    >
                        <Timer className="w-5 h-5" style={{ color: c1 }} />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                        <h4 className="font-black text-slate-900 text-sm truncate">{timer.title}</h4>
                        <p className="text-slate-400 text-xs truncate mt-0.5">{timer.description}</p>
                    </div>

                    <div className="flex-shrink-0 text-right">
                        <span className="text-2xl font-black" style={{ color: c1 }}>{pct}</span>
                        <span className="text-sm font-bold text-slate-400">%</span>
                    </div>
                </div>

                {/* Progress bar */}
                <SlimBar
                    percent={pct}
                    gradient={`linear-gradient(90deg, ${c1}, ${c2})`}
                    height={4}
                />

                {/* Meta row */}
                <div className="flex items-center justify-between mt-4">
                    {[
                        { Icon: Clock, val: formatSeconds(timer.productivityDone) },
                        { Icon: Target, val: formatMinutes(timer.specifiedTime) },
                        { Icon: Calendar, val: timer.deadline },
                    ].map(({ Icon, val }) => (
                        <span key={val} className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                            <Icon className="w-3 h-3" />{val}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default IndividualTimerCard;