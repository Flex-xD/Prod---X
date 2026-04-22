import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Pencil, Check, X, Users, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { IProfileHeroProps, IProfileEditPayload } from './profile-hero-types';

const ProfileHero = ({
    username,
    email,
    avatarUrl,
    friendsCount,
    productivityPoints,
    onSave,
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
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/60 shadow-xl shadow-purple-100/40 overflow-hidden"
        >
            {/* Banner */}
            <div className="h-28 bg-linear-to-r from-violet-500 via-purple-500 to-indigo-500 relative">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />
            </div>

            <div className="px-6 pb-6">
                {/* Avatar + action row */}
                <div className="flex items-end justify-between -mt-12 mb-4">
                    <div className="relative">
                        <motion.div whileHover={{ scale: 1.04 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                            <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                                <AvatarImage src={displayAvatar} />
                                <AvatarFallback className="bg-linear-to-br from-violet-500 to-purple-600 text-white text-2xl font-bold">
                                    {username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </motion.div>

                        <AnimatePresence>
                            {isEditing && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-full cursor-pointer"
                                >
                                    <Camera className="w-5 h-5 text-white" />
                                    <span className="text-white text-[9px] mt-0.5 font-medium">Change</span>
                                </motion.button>
                            )}
                        </AnimatePresence>

                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </div>

                    {/* Edit / Save / Cancel */}
                    <AnimatePresence mode="wait">
                        {!isEditing ? (
                            <motion.div key="edit" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                                <Button
                                    onClick={handleStartEdit}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 gap-1.5 font-medium"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Edit Profile
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div key="actions" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex gap-2">
                                <Button onClick={handleCancel} variant="outline" size="sm" className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-1.5">
                                    <X className="w-3.5 h-3.5" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    size="sm"
                                    className="rounded-xl bg-linear-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white gap-1.5 shadow-md shadow-purple-200"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Save
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Username & email */}
                <div className="space-y-1">
                    <AnimatePresence mode="wait">
                        {isEditing ? (
                            <motion.div key="input" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                                <Input
                                    value={editUsername}
                                    onChange={(e) => setEditUsername(e.target.value)}
                                    className="text-xl font-bold text-slate-800 border-purple-200 focus-visible:ring-purple-400 rounded-xl max-w-xs bg-white/80"
                                    placeholder="username"
                                />
                            </motion.div>
                        ) : (
                            <motion.h1 key="display" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-slate-800 tracking-tight">
                                @{username}
                            </motion.h1>
                        )}
                    </AnimatePresence>

                    <p className="text-slate-500 text-sm">{email}</p>

                    <div className="flex items-center gap-3 pt-2 flex-wrap">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1.5 text-sm text-slate-600 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 transition-colors cursor-pointer px-3 py-1.5 rounded-full border border-slate-200 hover:border-purple-200"
                        >
                            <Users className="w-3.5 h-3.5" />
                            <span className="font-semibold">{friendsCount}</span>
                            <span className="text-slate-500">friends</span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-1.5 text-sm bg-linear-to-r from-amber-400/20 to-orange-400/20 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full cursor-default"
                        >
                            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span className="font-bold">{productivityPoints.toLocaleString()}</span>
                            <span className="text-amber-600/80 text-xs">pts</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileHero;