import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUserData } from '@/custom-hooks/user-related-fetching/user-data';

// ─── Spring preset (matches timer-page) ──────────────────────────────────────
const sp = { type: 'spring', damping: 28, stiffness: 300 } as const;

const DashboardHeader = () => {
    const { data: UserData } = useUserData();
    const username = UserData?.data.username ?? 'User';
    const initials = username.slice(0, 2).toUpperCase();

    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <header
            className="sticky top-0 z-40"
            style={{
                background: 'rgba(255,255,255,0.82)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">

                {/* ── Logo ── */}
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.08 }}
                        transition={sp}
                        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', boxShadow: '0 6px 20px rgba(124,58,237,0.35)' }}
                    >
                        <Zap className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                        <span
                            className="text-xl font-black"
                            style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                        >
                            ProdX
                        </span>
                        <p className="text-xs font-semibold text-slate-400 leading-none mt-0.5">
                            Welcome back, <span className="text-violet-600">{username}</span> 👋
                        </p>
                    </div>
                </div>

                {/* ── Right actions ── */}
                <div className="flex items-center gap-2.5">

                    {/* Notification bell */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.93 }}
                        className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
                        style={{ background: '#f8fafc', border: '1px solid rgba(0,0,0,0.06)' }}
                        title="Notifications — coming soon"
                    >
                        <Bell className="w-4.5 h-4.5 text-slate-500 w-[18px] h-[18px]" />
                        {/* Unread dot */}
                        <span
                            className="absolute top-2 right-2 w-2 h-2 rounded-full bg-violet-500"
                            style={{ boxShadow: '0 0 0 2px white' }}
                        />
                    </motion.button>

                    {/* Timer CTA */}
                    <Link to="/timer">
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white text-sm font-bold"
                            style={{
                                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                                boxShadow: '0 6px 20px rgba(124,58,237,0.35)',
                            }}
                        >
                            <Timer className="w-4 h-4" />
                            <span className="hidden sm:inline">Timers</span>
                        </motion.button>
                    </Link>

                    {/* Profile dropdown */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setProfileOpen(o => !o)}
                            className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-2xl transition-colors"
                            style={{
                                background: profileOpen ? '#f5f3ff' : '#f8fafc',
                                border: profileOpen ? '1px solid #ddd6fe' : '1px solid rgba(0,0,0,0.06)',
                            }}
                        >
                            {/* Avatar */}
                            <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black"
                                style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)', boxShadow: '0 4px 12px rgba(124,58,237,0.3)' }}
                            >
                                {initials}
                            </div>
                            <span className="hidden sm:block text-sm font-bold text-slate-700 max-w-[80px] truncate">
                                {username}
                            </span>
                            <motion.div animate={{ rotate: profileOpen ? 180 : 0 }} transition={sp}>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </motion.div>
                        </motion.button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {profileOpen && (
                                <>
                                    {/* Click-away overlay */}
                                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />

                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={sp}
                                        className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden z-50"
                                        style={{ background: 'white', boxShadow: '0 16px 48px rgba(0,0,0,0.14)', border: '1px solid rgba(0,0,0,0.06)' }}
                                    >
                                        {/* User info banner */}
                                        <div className="px-4 py-3.5" style={{ background: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', borderBottom: '1px solid #ddd6fe' }}>
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                                                    style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
                                                >
                                                    {initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-black text-slate-900 truncate">{username}</p>
                                                    <p className="text-xs text-violet-500 font-semibold">Pro Member</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu items */}
                                        <div className="p-1.5 space-y-0.5">
                                            {[
                                                { icon: User, label: 'Profile', to: '/profile' },
                                                { icon: Settings, label: 'Settings', to: '/settings' },
                                            ].map(({ icon: Icon, label, to }) => (
                                                <Link key={label} to={to} onClick={() => setProfileOpen(false)}>
                                                    <motion.div
                                                        whileHover={{ x: 3 }}
                                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors hover:bg-violet-50 group"
                                                    >
                                                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 group-hover:bg-violet-100 transition-colors">
                                                            <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-600 transition-colors" />
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-700 group-hover:text-violet-700 transition-colors">
                                                            {label}
                                                        </span>
                                                    </motion.div>
                                                </Link>
                                            ))}

                                            <div className="h-px my-1" style={{ background: 'rgba(0,0,0,0.05)' }} />

                                            <motion.button
                                                whileHover={{ x: 3 }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-rose-50 group transition-colors"
                                            >
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-slate-100 group-hover:bg-rose-100 transition-colors">
                                                    <LogOut className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-500 transition-colors" />
                                                </div>
                                                <span className="text-sm font-semibold text-slate-700 group-hover:text-rose-600 transition-colors">
                                                    Sign Out
                                                </span>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;