import { motion } from 'framer-motion';
import { Flame, CheckCircle2 } from 'lucide-react';
import { Avatar, Pill, SlimBar } from '../../ui';
import { RANK_CONFIG, sp } from '../../constants';
import { formatSeconds, progressPercent } from '../../utils';
import type { IGroupParticipant, IGroupTimer } from '../../types';

interface LeaderboardRowProps {
    participant: IGroupParticipant;
    /** Position in the sorted list (0-based) */
    position: number;
    /** Total goal minutes for this group timer */
    specifiedTime: IGroupTimer['specifiedTime'];
}

const LeaderboardRow = ({ participant, position, specifiedTime }: LeaderboardRowProps) => {
    const pct = progressPercent(participant.productivityDone, specifiedTime);
    const isMe = participant.user.id === 'me';
    const rank = RANK_CONFIG[position];
    const RankIcon = rank?.icon ?? CheckCircle2;

    const rankGrad =
        position === 0 ? 'linear-gradient(90deg,#f59e0b,#d97706)' :
            position === 1 ? 'linear-gradient(90deg,#94a3b8,#64748b)' :
                isMe ? 'linear-gradient(90deg,#7c3aed,#4f46e5)' :
                    'linear-gradient(90deg,#e2e8f0,#cbd5e1)';

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: position * 0.06, ...sp }}
            className="p-4 rounded-2xl transition-all"
            style={{
                background: isMe ? 'linear-gradient(135deg,#f5f3ff,#ede9fe)' : '#f8fafc',
                border: isMe ? '1.5px solid #ddd6fe' : '1.5px solid transparent',
            }}
        >
            {/* Top row: rank + avatar + info + % */}
            <div className="flex items-center gap-3 mb-3">
                {/* Rank badge */}
                <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${rank?.bg ?? 'from-slate-200 to-slate-300'
                        }`}
                    style={{ boxShadow: position < 3 ? '0 4px 12px rgba(0,0,0,0.15)' : 'none' }}
                >
                    <RankIcon className="w-4 h-4 text-white" />
                </div>

                <Avatar
                    initials={participant.user.initials}
                    idx={position + 1}
                    size="md"
                    isOnline={participant.user.isOnline}
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900 text-sm">{participant.user.username}</span>
                        {isMe && <Pill color="violet">You</Pill>}
                        {participant.isCurrentlyActive && (
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                                <Flame className="w-3 h-3" />Active
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        {formatSeconds(participant.productivityDone)} focused
                    </p>
                </div>

                <div className="flex-shrink-0 text-right">
                    <span className="text-xl font-black text-slate-800">{pct}</span>
                    <span className="text-xs font-bold text-slate-400">%</span>
                </div>
            </div>

            {/* Progress bar */}
            <SlimBar percent={pct} gradient={rankGrad} height={4} trackColor="rgba(0,0,0,0.05)" />
        </motion.div>
    );
};

export default LeaderboardRow;