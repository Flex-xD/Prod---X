import { motion } from 'framer-motion';
import { Users, Trophy, Calendar, Flame } from 'lucide-react';
import { Avatar, SlimBar } from '../ui';
import { sp } from '../constants';
import { progressPercent } from '../utils';
import type { IGroupTimer } from '../types';

interface GroupTimerCardProps {
    timer: IGroupTimer;
    index: number;
    onClick: () => void;
}

const GroupTimerCard = ({ timer, index, onClick }: GroupTimerCardProps) => {
    const myPart = timer.participants.find(p => p.user._id === 'me');
    const myPct = myPart ? progressPercent(myPart.productivityDone, timer.specifiedTime) : 0;
    const topUser = [...timer.participants].sort((a, b) => b.productivityDone - a.productivityDone)[0];
    const activeCount = timer.participants.filter(p => p.isCurrentlyActive).length;

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
            {/* Rose accent stripe */}
            <div
                className="absolute top-0 left-0 right-0 h-0.75"
                style={{ background: 'linear-gradient(90deg, #EC4899, #F43F5E44)' }}
            />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-black text-slate-900 text-sm truncate">{timer.title}</h4>
                            {activeCount > 0 && (
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                    <Flame className="w-3 h-3" />{activeCount}
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 text-xs truncate">{timer.description}</p>
                    </div>

                    {/* Stacked participant avatars */}
                    <div className="flex -space-x-2 ml-3 flex-shrink-0">
                        {timer.participants.slice(0, 4).map((p, i) => (
                            <div key={p.user._id} style={{ zIndex: 4 - i, border: '2px solid white', borderRadius: 14 }}>
                                <Avatar initials={""} idx={i} size="sm" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Your progress */}
                <div className="mb-1">
                    <div className="flex justify-between text-xs font-bold text-slate-400 mb-1.5">
                        <span>Your progress</span>
                        <span className="text-rose-500">{myPct}%</span>
                    </div>
                    <SlimBar
                        percent={myPct}
                        gradient="linear-gradient(90deg,#EC4899,#F43F5E)"
                        height={4}
                    />
                </div>

                {/* Meta row */}
                <div className="flex items-center justify-between mt-4 text-xs font-semibold text-slate-400">
                    <span className="flex items-center gap-1.5">
                        <Users className="w-3 h-3" />{timer.participants.length} members
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Trophy className="w-3 h-3 text-amber-400" />@{topUser.user.username}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />{timer.deadline}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default GroupTimerCard;