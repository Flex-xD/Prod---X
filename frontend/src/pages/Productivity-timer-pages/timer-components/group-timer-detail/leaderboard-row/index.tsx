import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Avatar, SlimBar } from '../../ui';
import { spring } from '@/lib/motion';
import { formatSeconds, progressPercent, initialsOf } from '../../utils';
import type { IGroupParticipant, IGroupTimer } from '../../types';
import { userAppStore } from '@/store';

interface LeaderboardRowProps {
    participant: IGroupParticipant;
    specifiedTime: IGroupTimer['specifiedTime'];
}

// Ranking as measurement, not game: mono rank number, no crowns,
// medals or confetti colors. `layout` + spring reorder the rows
// when live ranks change - the whole live-update story is one
// layout animation, not a re-mount.
const LeaderboardRow = ({ participant, specifiedTime }: LeaderboardRowProps) => {
    const userId = userAppStore((state) => state.user_id);
    const pct = progressPercent(participant.productivityDone, specifiedTime);

    const isMe = participant.user._id === userId;

    return (
        <motion.div
            layout
            transition={spring}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg px-4 py-4 transition-colors duration-fast ${
                isMe ? 'border-2 border-ink bg-focus-tint' : 'border border-line bg-paper'
            }`}
        >
            <div className="mb-3 flex items-center gap-3">
                {/* Rank: mono number, zero-padded so digits align */}
                <span className="w-5 flex-shrink-0 font-mono text-sm font-bold tabular-nums text-ink-faint">
                    {String(participant.rank).padStart(2, '0')}
                </span>

                <Avatar
                    initials={initialsOf(participant.username)}
                    size="md"
                    isOnline={participant.user.isOnline}
                />

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-bold text-ink">{participant.user.username}</span>
                        {isMe && (
                            <span className="rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-paper">
                                You
                            </span>
                        )}
                        {participant.isCurrentlyActive && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-focus-deep">
                                <Flame className="h-3 w-3" aria-hidden="true" /> Active
                            </span>
                        )}
                    </div>
                    <p className="mt-0.5 text-xs font-semibold text-ink-faint">
                        <span className="font-mono tabular-nums">{formatSeconds(participant.productivityDone)}</span> focused
                    </p>
                </div>

                <div className="flex-shrink-0 text-right">
                    <span className="font-mono text-lg font-bold tabular-nums text-ink">{pct}</span>
                    <span className="text-xs font-bold text-ink-faint">%</span>
                </div>
            </div>

            {/* Progress bar */}
            <SlimBar percent={pct} height={4} trackClass="bg-line" />
        </motion.div>
    );
};

export default LeaderboardRow;