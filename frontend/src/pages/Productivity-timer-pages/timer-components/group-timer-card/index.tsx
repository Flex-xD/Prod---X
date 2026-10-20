import { motion } from 'framer-motion';

import {
    Users,
    Trophy,
    Calendar,
    Clock,
    UserPlus,
    Timer,
    Check,
    X,
    AlertTriangle,
    Archive,
} from 'lucide-react';

import { Pill, PressBtn, SlimBar } from '../ui';
import { quick } from '@/lib/motion';

import {
    progressPercent,
    formatMinutes,
    formatSeconds,
    isExpired,
} from '../utils';

import type { IGroupTimer } from '../types';
import { userAppStore } from '@/store';
import useRespondToInvitationMutation from '@/custom-hooks/notification/response-invitation';
import useArchiveGroupTimerMutation from '@/custom-hooks/group-productivity-timer/archive-group-timer';

interface GroupTimerCardProps {
    timer: IGroupTimer;
    index?: number;
    onClick: () => void;
    isPendingInvite?: boolean;
}

// One card language: ledger panel, hard press, semantic state colors.
// Progress is green (achievement), live is orange (active focus),
// expired is red (problem). State shows in text before color.
const CARD =
    'rounded-lg border-2 border-ink bg-surface shadow-hard transition-all duration-fast hover:-translate-y-px hover:shadow-hard-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard';

const GroupTimerCard = ({
    timer,
    onClick,
    isPendingInvite = false,
}: GroupTimerCardProps) => {
    const currentUserId = userAppStore((state) => state.user_id) ?? '';

    const { mutate: respondToInvitation, isPending: isResponding } =
        useRespondToInvitationMutation(currentUserId);

    const { mutate: archiveTimer, isPending: isArchiving } = useArchiveGroupTimerMutation();

    const expired = isExpired(timer.deadline);

    const myParticipant = timer.participants?.find(
        (participant) => participant.user?._id === currentUserId
    );

    const myCompletedTime = myParticipant?.productivityDone ?? 0;
    const myProgress = progressPercent(myCompletedTime, timer.specifiedTime);

    const participants = timer.participants ?? [];
    const sortedParticipants = [...participants].sort(
        (a, b) => (b.productivityDone ?? 0) - (a.productivityDone ?? 0)
    );
    const topUser = sortedParticipants[0];
    const participantCount = participants.length;
    const invitedCount = timer.invitedUsersId?.length ?? 0;

    const formattedDeadline = new Date(timer.deadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
    });

    const isLive = timer.isActive;
    const statusLabel = timer.status.charAt(0).toUpperCase() + timer.status.slice(1);
    const description = timer.description?.trim() || 'No description provided';

    const iHaveCompleted = myParticipant?.hasCompleted && !myParticipant?.archived;

    if (isPendingInvite) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={quick}
                className={`${CARD} p-5`}
            >
                <Pill color="focus" className="mb-3">
                    Invitation
                </Pill>

                <h4 className="text-sm font-bold text-ink">{timer.title}</h4>
                <p className="mt-0.5 truncate text-xs font-medium text-ink-faint" title={description}>
                    {description}
                </p>

                <p className="mt-1.5 text-xs font-medium text-ink-soft">
                    Invited by{' '}
                    <span className="font-bold text-ink">@{timer.author?.username ?? 'someone'}</span>
                    {' | '}goal {formatMinutes(timer.specifiedTime)}
                    {' | '}due {formattedDeadline}
                </p>

                <div className="mt-4 flex gap-2">
                    <PressBtn
                        variant="primary"
                        disabled={isResponding}
                        onClick={() =>
                            respondToInvitation({
                                groupTimerId: timer._id,
                                status: 'accepted',
                                timer,
                            })
                        }
                        className="flex-1 py-2 text-xs"
                    >
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        {isResponding ? 'Working...' : 'Accept'}
                    </PressBtn>

                    <PressBtn
                        variant="secondary"
                        disabled={isResponding}
                        onClick={() =>
                            respondToInvitation({
                                groupTimerId: timer._id,
                                status: 'declined',
                            })
                        }
                        className="flex-1 py-2 text-xs"
                    >
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                        {isResponding ? 'Working...' : 'Decline'}
                    </PressBtn>
                </div>
            </motion.div>
        );
    }

    return (
        <div role="button" tabIndex={0} onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            className={`${CARD} cursor-pointer overflow-hidden`}
        >
            <div className="p-5">
                <div className="mb-4 flex items-start gap-3">
                    <span
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border-2 ${
                            expired
                                ? 'border-alert bg-alert-tint text-alert-deep'
                                : isLive
                                  ? 'border-focus bg-focus-tint text-focus-deep'
                                  : 'border-line bg-paper-deep text-ink-soft'
                        }`}
                    >
                        <Timer className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h4 className="truncate text-sm font-bold text-ink">{timer.title}</h4>

                            {expired ? (
                                <Pill color="alert">
                                    <AlertTriangle className="h-3 w-3" aria-hidden="true" /> Expired
                                </Pill>
                            ) : (
                                isLive && (
                                    <Pill color="focus">
                                        <span className="h-1.5 w-1.5 rounded-full bg-focus-deep" aria-hidden="true" />
                                        Live
                                    </Pill>
                                )
                            )}

                            {iHaveCompleted && (
                                <Pill color="progress">
                                    <Check className="h-3 w-3" aria-hidden="true" /> Goal hit
                                </Pill>
                            )}
                        </div>

                        <p className="mt-0.5 truncate text-xs font-medium text-ink-faint" title={description}>
                            {description}
                        </p>

                        <div className="mt-1.5 flex items-center gap-2 text-xs font-semibold">
                            <span className={timer.status === 'pending' ? 'text-focus-deep' : 'text-progress-deep'}>
                                {statusLabel}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-line" aria-hidden="true" />
                            <span className="text-ink-faint">{formatMinutes(timer.specifiedTime)} goal</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 text-right">
                        <span className="font-mono text-2xl font-bold tabular-nums text-ink">{myProgress}</span>
                        <span className="text-sm font-bold text-ink-faint">%</span>
                    </div>
                </div>

                <div className="mb-1">
                    <div className="mb-1.5 flex justify-between text-[11px] font-bold uppercase tracking-wider text-ink-faint">
                        <span>Your progress</span>
                        <span className="font-mono tabular-nums text-progress-deep">{myProgress}%</span>
                    </div>
                    <SlimBar percent={myProgress} height={4} />
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-ink-faint">
                    <span className="flex max-w-[100px] items-center gap-1">
                        <Users className="h-3 w-3" aria-hidden="true" />
                        {participantCount > 0 ? `${participantCount} members` : `${invitedCount} invited`}
                    </span>

                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <span className="font-mono tabular-nums">{formatSeconds(myCompletedTime)}</span>
                    </span>

                    <span className="flex max-w-[120px] items-center gap-1">
                        <Trophy className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                        {topUser ? (
                            <span className="truncate font-semibold text-ink-soft">@{topUser.user?.username}</span>
                        ) : (
                            <span>No leader</span>
                        )}
                    </span>

                    <span className="flex items-center gap-1" title={timer.deadline}>
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        {formattedDeadline}
                    </span>
                </div>

                {participantCount === 0 && (
                    <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-xs text-ink-faint">
                        <UserPlus className="h-3.5 w-3.5 text-focus-deep" aria-hidden="true" />
                        <span>Waiting for invited members to join</span>
                    </div>
                )}

                {iHaveCompleted && (
                    <PressBtn
                        variant="successSoft"
                        disabled={isArchiving}
                        onClick={(e) => {
                            e.stopPropagation();
                            archiveTimer({ groupTimerId: timer._id });
                        }}
                        className="mt-4 w-full py-2.5 text-xs"
                    >
                        <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                        {isArchiving ? 'Working...' : 'Move to Completed (frees a slot)'}
                    </PressBtn>
                )}
            </div>
        </div>
    );
};

export default GroupTimerCard;