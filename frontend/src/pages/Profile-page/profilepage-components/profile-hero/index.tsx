import { useState, useRef } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { Camera, Pencil, Check, X, Users, Zap, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { IProfileHeroProps, IProfileEditPayload } from './profile-hero-types';

// Framer variants defined OUTSIDE the component — stable references, no recreation on render
const swapVariants: Variants = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
    exit: { opacity: 0, y: -6, transition: { duration: 0.12, ease: 'easeIn' } },
};

const overlayVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
};

const ProfileHero = ({
    username,
    email,
    avatarUrl,
    friendsCount,
    productivityPoints,
    onSave,
    onLogout , 
    isLogoutPending
}: IProfileHeroProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editUsername, setEditUsername] = useState(username);
    const [editAvatarPreview, setEditAvatarPreview] = useState('');
    const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const displayAvatar = isEditing && editAvatarPreview ? editAvatarPreview : avatarUrl;

    const handleStartEdit = () => {
        setEditUsername(username);
        setEditAvatarPreview('');
        setEditAvatarFile(null);
        setIsEditing(true);
    };

    const handleSave = () => {

        const payload: IProfileEditPayload = {
            username: editUsername.trim() || username,
            avatarFile: editAvatarFile,
            avatarPreview: editAvatarPreview,
        };
        onSave(payload);
        setIsEditing(false);
    };

    const handleLogout = () => {
        console.log("Logging out the current user !");
        onLogout();
    }

    const handleCancel = () => {
        setEditAvatarPreview('');
        setEditAvatarFile(null);
        setIsEditing(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setEditAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setEditAvatarPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    return (
        // Card entrance handled by parent CSS — no motion.div wrapper needed here
        <div className="fade-up-card bg-white/75 backdrop-blur-md rounded-3xl border border-white/70 shadow-xl shadow-violet-100/30 overflow-hidden">

            {/* Banner — pure CSS, no JS needed */}
            <div className="h-32 bg-linear-to-r from-violet-500 via-purple-500 to-indigo-500 relative overflow-hidden">
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.07]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '24px 24px',
                    }}
                />
                {/* Soft orb for depth */}
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-8 left-16 w-32 h-32 bg-indigo-300/20 rounded-full blur-xl" />
            </div>

            <div className="px-6 pb-6">
                {/* Avatar + action row */}
                <div className="flex items-end justify-between -mt-12 mb-5">
                    <div className="relative">
                        {/* Avatar — CSS transition only, no motion wrapper */}
                        <div className="transition-transform duration-200 ease-out hover:scale-[1.03]">
                            <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg shadow-violet-100/50">
                                <AvatarImage src={displayAvatar} />
                                <AvatarFallback className="bg-linear-to-br from-violet-500 to-purple-600 text-white text-2xl font-bold select-none">
                                    {username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        {/* Camera overlay */}
                        <AnimatePresence>
                            {isEditing && (
                                <motion.button
                                    variants={overlayVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full cursor-pointer"
                                >
                                    <Camera className="w-5 h-5 text-white" />
                                    <span className="text-white text-[9px] mt-0.5 font-medium tracking-wide">CHANGE</span>
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Edit / Save+Cancel — AnimatePresence swap */}
                    <AnimatePresence mode="wait">
                        {!isEditing ? (
                            <motion.div key="edit" variants={swapVariants} initial="initial" animate="animate" exit="exit">
                                <Button
                                    onClick={handleStartEdit}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 gap-1.5 font-medium text-xs transition-all duration-150"
                                >
                                    <Pencil className="w-3 h-3" />
                                    Edit Profile
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 gap-1.5 font-medium text-xs transition-all duration-150"
                                >
                                    <LogOut className="w-3 h-3" />
                                    Logout
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div key="actions" variants={swapVariants} initial="initial" animate="animate" exit="exit" className="flex gap-2">
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50 gap-1.5 text-xs transition-all duration-150"
                                >
                                    <X className="w-3 h-3" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    size="sm"
                                    className="rounded-xl bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white gap-1.5 shadow-md shadow-violet-200/60 text-xs transition-all duration-150"
                                >
                                    <Check className="w-3 h-3" />
                                    Save
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Username + email */}
                <div className="space-y-1">
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div
                                key="input"
                                variants={swapVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <Input
                                    value={editUsername}
                                    onChange={(e) => setEditUsername(e.target.value)}
                                    className="text-lg font-bold text-slate-800 border-violet-200 focus-visible:ring-violet-400/50 rounded-xl max-w-xs bg-white/90 h-9"
                                    placeholder="username"
                                    autoFocus
                                />
                            </motion.div>
                        ) : (
                            <motion.h1
                                key="display"
                                variants={swapVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="text-2xl font-bold text-slate-800 tracking-tight"
                            >
                                @{username}
                            </motion.h1>
                        )}
                    </AnimatePresence>

                    <p className="text-slate-400 text-sm">{email}</p>

                    {/* Pills — pure CSS hover */}
                    <div className="flex items-center gap-2.5 pt-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-50 hover:bg-violet-50 hover:text-violet-700 transition-colors duration-150 cursor-pointer px-3 py-1.5 rounded-full border border-slate-200 hover:border-violet-200">
                            <Users className="w-3.5 h-3.5" />
                            <span className="font-semibold">{friendsCount}</span>
                            <span className="text-slate-400 text-xs">friends</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-sm bg-amber-50 border border-amber-200/80 text-amber-700 px-3 py-1.5 rounded-full cursor-default">
                            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span className="font-bold">{productivityPoints.toLocaleString()}</span>
                            <span className="text-amber-500/70 text-xs font-medium">pts</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHero;