import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, X, Pencil, Loader2, Flame } from 'lucide-react';
import useUpdateAvatarMutation from '@/custom-hooks/profile/update-avatar';
import useUpdateUsernameMutation from '@/custom-hooks/profile/update-user-name';
import type { IProfileHeroProps } from './profile-hero-types';
import { enter } from '@/lib/motion';

// Ledger hero: a light surface card like every other major component
// (no gradient, no glow). Identity is ink-on-paper; the only semantic
// color is progress green on the streak record.
const ProfileHero = ({ user, currentStreak }: IProfileHeroProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [draftUsername, setDraftUsername] = useState(user.username);

    const { mutate: updateAvatar, isPending: isUploadingAvatar } = useUpdateAvatarMutation();
    const { mutate: updateUsername, isPending: isSavingUsername } = useUpdateUsernameMutation();

    const initials = user.username.slice(0, 2).toUpperCase();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) return; // 5MB guard, matches backend limit
        updateAvatar(file);
        e.target.value = "";
    };

    const handleSaveUsername = () => {
        const trimmed = draftUsername.trim();
        setIsEditingName(false);
        if (!trimmed || trimmed === user.username) return;
        updateUsername({ username: trimmed });
    };

    const handleCancelUsername = () => {
        setDraftUsername(user.username);
        setIsEditingName(false);
    };

    return (
        <motion.section {...enter(0)} aria-label="Profile" className="rounded-lg border-2 border-ink bg-surface shadow-hard">
            <div className="relative flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-ink text-3xl font-bold text-paper">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        aria-label="Change profile photo"
                        className="press-hard absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink bg-surface text-ink disabled:pointer-events-none disabled:opacity-60"
                    >
                        {isUploadingAvatar ? (
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <Camera className="h-4 w-4" aria-hidden="true" />
                        )}
                    </button>

                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </div>

                {/* Identity */}
                <div className="min-w-0 flex-1">
                    {isEditingName ? (
                        <div className="flex items-center gap-2">
                            <input
                                autoFocus
                                aria-label="Username"
                                value={draftUsername}
                                onChange={(e) => setDraftUsername(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveUsername();
                                    if (e.key === 'Escape') handleCancelUsername();
                                }}
                                className="max-w-[220px] rounded-lg border-2 border-ink bg-surface px-3 py-1.5 text-xl font-bold text-ink outline-none"
                                maxLength={24}
                            />
                            <button
                                type="button"
                                onClick={handleSaveUsername}
                                disabled={isSavingUsername}
                                aria-label="Save username"
                                className="press-hard flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-progress text-ink disabled:pointer-events-none disabled:opacity-60"
                            >
                                {isSavingUsername ? (
                                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                ) : (
                                    <Check className="h-4 w-4" aria-hidden="true" />
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelUsername}
                                aria-label="Cancel editing username"
                                className="press-hard flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-surface text-ink-soft"
                            >
                                <X className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-ink">{user.username}</h1>
                            <button
                                type="button"
                                onClick={() => setIsEditingName(true)}
                                aria-label="Edit username"
                                className="press-hard flex h-7 w-7 items-center justify-center rounded-sm border-2 border-ink bg-paper-deep text-ink"
                            >
                                <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    <p className="mt-1 text-sm font-medium text-ink-soft">{user.email}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-line bg-paper-deep px-3 py-1.5 text-xs font-bold text-ink-soft">
                            {user.provider === 'google' ? 'Google Account' : 'ProdX Account'}
                        </span>
                        {currentStreak > 0 && (
                            /* Accumulated streak = progress green, with an icon
                               instead of the old fire emoji. */
                            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-progress px-3 py-1.5 text-xs font-bold text-ink">
                                <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                                {currentStreak} day streak
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default ProfileHero;
