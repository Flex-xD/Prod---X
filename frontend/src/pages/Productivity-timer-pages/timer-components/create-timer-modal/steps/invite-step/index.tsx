import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UserPlus, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MAX_GROUP_INVITES } from '../../../constants';
import { Avatar, PressBtn } from '../../../ui';
import { quick, spring } from '@/lib/motion';
import { initialsOf } from '../../../utils';
import type { IUser } from '../../../types';
import UserGetUsersToInvite from '@/custom-hooks/group-productivity-timer/get-users-to-invite';

interface InviteStepProps {
    invitedUsers: IUser[];
    onToggle: (user: IUser) => void;
    onContinue: () => void;
}

const InviteStep = ({ invitedUsers, onToggle, onContinue }: InviteStepProps) => {
    // * Local State
    const [query, setQuery] = useState('');

    // * Users to invite query
    const { data: usersToInvite, isError: isUsersToInviteError } = UserGetUsersToInvite(query);

    const results = usersToInvite?.data.users ?? [];
    const filtered = results.filter(u => !invitedUsers.find(i => i._id === u._id));

    return (
        <motion.div
            key="invite-users"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={quick}
            className="space-y-4"
        >
            {/* Invited chips: enter/exit on add and remove */}
            <AnimatePresence>
                {invitedUsers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={spring}
                        className="overflow-hidden rounded-lg border border-info bg-info-tint"
                    >
                        <div className="flex flex-wrap gap-2 p-3">
                            {invitedUsers.map((u) => (
                                <motion.span
                                    key={u._id}
                                    layout
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={spring}
                                    className="flex items-center gap-1.5 rounded-lg border border-ink bg-surface px-2.5 py-1.5 shadow-hard-xs"
                                >
                                    <Avatar initials={initialsOf(u.username)} size="sm" />
                                    <span className="text-xs font-bold text-ink">{u.username}</span>
                                    <button
                                        type="button"
                                        onClick={() => onToggle(u)}
                                        aria-label={`Remove ${u.username}`}
                                        className="ml-0.5 text-ink-faint transition-colors duration-fast hover:text-alert-deep"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Search input */}
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
                <Input
                    placeholder="Search username..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search people to invite"
                    className="h-10 rounded-lg pl-9 text-sm"
                />
            </div>

            {/* Fetch failure: inline, actionable, no toasts fired from render */}
            {isUsersToInviteError && (
                <p role="alert" className="rounded-lg border-2 border-alert bg-alert-tint px-3 py-2 text-xs font-bold text-alert-deep">
                    Couldn't load people to invite. Try again in a moment.
                </p>
            )}

            {/* Results list */}
            <div className="max-h-52 space-y-1.5 overflow-y-auto">
                {filtered.map((user: IUser, i: number) => (
                    <motion.div
                        key={user._id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...quick, delay: Math.min(i, 5) * 0.03 }}
                        className="flex items-center gap-3 rounded-lg border border-line bg-paper p-3 transition-colors duration-fast hover:border-ink"
                    >
                        <Avatar initials={initialsOf(user.username)} size="md" isOnline={user.isOnline} />

                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-bold text-ink">{user.username}</div>
                            <div className={`text-xs font-semibold ${user.isOnline ? 'text-info-deep' : 'text-ink-faint'}`}>
                                {user.isOnline ? 'Online' : 'Offline'}
                            </div>
                        </div>

                        <PressBtn
                            variant="primary"
                            onClick={() => onToggle(user)}
                            disabled={invitedUsers.length >= MAX_GROUP_INVITES}
                            className="px-3 py-1.5 text-xs"
                        >
                            <UserPlus className="h-3 w-3" aria-hidden="true" /> Invite
                        </PressBtn>
                    </motion.div>
                ))}
            </div>

            {/* Continue CTA */}
            <PressBtn
                variant="primary"
                disabled={invitedUsers.length === 0}
                onClick={onContinue}
                className="w-full py-3.5"
            >
                Continue with {invitedUsers.length} member{invitedUsers.length !== 1 ? 's' : ''}
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </PressBtn>
        </motion.div>
    );
};

export default InviteStep;