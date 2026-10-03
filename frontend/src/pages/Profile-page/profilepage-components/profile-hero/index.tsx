import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Check, X, Pencil, Loader2 } from 'lucide-react';
import useUpdateAvatarMutation from '@/custom-hooks/profile/update-avatar';
import type { IUser } from '@/pages/Productivity-timer-pages/timer-components/types';
import useUpdateUsernameMutation from '@/custom-hooks/profile/update-user-name';

interface ProfileHeroProps {
    user: IUser;
    currentStreak: number;
}

const sp = { type: 'spring', damping: 28, stiffness: 300 } as const;

const ProfileHero = ({ user, currentStreak }: ProfileHeroProps) => {
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
        if (!trimmed || trimmed === user.username) {
            setIsEditingName(false);
            return;
        }
        updateUsername({ username: trimmed }, { onSuccess: () => setIsEditingName(false) });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ...sp }}
            className="relative rounded-3xl overflow-hidden text-white"
            style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)', boxShadow: '0 24px 72px rgba(79,46,220,0.4)' }}
        >
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(129,140,248,0.22), transparent)' }} />
            <div className="absolute bottom-0 -left-12 w-56 h-56 rounded-full" style={{ background: 'radial-gradient(circle, rgba(192,132,252,0.16), transparent)' }} />

            <div className="relative z-10 p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div
                        className="w-28 h-28 rounded-3xl flex items-center justify-center text-3xl font-black text-white overflow-hidden"
                        style={{ background: 'linear-gradient(135deg,#7C3AED,#4F46E5)', boxShadow: '0 12px 32px rgba(124,58,237,0.45)' }}
                    >
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>

                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                        className="absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl flex items-center justify-center disabled:opacity-70"
                        style={{ background: 'white', boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}
                    >
                        {isUploadingAvatar ? (
                            <Loader2 className="w-4 h-4 text-violet-600 animate-spin" />
                        ) : (
                            <Camera className="w-4 h-4 text-violet-600" />
                        )}
                    </motion.button>

                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                </div>

                {/* Identity */}
                <div className="flex-1 min-w-0 text-center sm:text-left">
                    {isEditingName ? (
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <input
                                autoFocus
                                value={draftUsername}
                                onChange={(e) => setDraftUsername(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSaveUsername()}
                                className="text-2xl font-black bg-white/10 rounded-xl px-3 py-1.5 outline-none border border-white/20 focus:border-violet-300 text-white max-w-[220px]"
                                maxLength={24}
                            />
                            <motion.button whileTap={{ scale: 0.9 }} onClick={handleSaveUsername} disabled={isSavingUsername}
                                className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.25)' }}>
                                {isSavingUsername ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-emerald-300" />}
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setDraftUsername(user.username); setIsEditingName(false); }}
                                className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)' }}>
                                <X className="w-4 h-4 text-rose-300" />
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                            <h1 className="text-2xl font-black text-white">{user.username}</h1>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsEditingName(true)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
                                <Pencil className="w-3.5 h-3.5 text-indigo-300" />
                            </motion.button>
                        </div>
                    )}

                    <p className="text-indigo-300 text-sm font-medium mt-1">{user.email}</p>

                    <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }}>
                            {user.provider === 'google' ? 'Google Account' : 'ProdX Account'}
                        </span>
                        {currentStreak > 0 && (
                            <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(249,115,22,0.2)', color: '#fdba74' }}>
                                🔥 {currentStreak} day streak
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileHero;