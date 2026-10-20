import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Timer, ChevronDown, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useUserData } from '@/custom-hooks/user-related-fetching/user-data';
import { useLogoutMutation } from '@/custom-hooks/auth-mutation/logout';
import { useFocusLockStatus } from '@/custom-hooks/dashboard/use-focus-lock';
import NotificationCenter from '@/pages/Notification';
import { spring } from '@/lib/motion';

const DashboardHeader = () => {
    const { data: UserData } = useUserData();
    const username = UserData?.data.username ?? 'User';
    const initials = username.slice(0, 2).toUpperCase();

    const [profileOpen, setProfileOpen] = useState(false);

    const { mutateAsync: handleLogoutMutation } = useLogoutMutation();

    // * While the dashboard focus (pomodoro) timer is running, the Timers page
    // * stays locked — the user must pause or log the session first.
    const { data: focusLock } = useFocusLockStatus();
    const pomodoroRunning =
        focusLock?.data?.sessionType === 'pomodoro' && focusLock?.data?.isRunning === true;

    const handleTimersClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!pomodoroRunning) return;
        e.preventDefault();
        toast.error('Pause or log your focus session before opening the Timers page !');
    };

    const handleLogout = async () => {
        await handleLogoutMutation();
    };

    return (
        <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
                {/* ── Logo + greeting ── */}
                <Link to="/" className="flex min-w-0 items-center gap-3">
                    <span
                        aria-hidden="true"
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-ink text-paper"
                    >
                        <Zap className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                        <span className="block text-lg font-bold leading-none tracking-tight text-ink">
                            ProdX
                        </span>
                        <span className="mt-0.5 hidden text-xs font-medium text-ink-soft md:block">
                            Welcome back, <span className="font-bold text-ink">{username}</span>
                        </span>
                    </span>
                </Link>

                {/* ── Right actions ── */}
                <div className="flex items-center gap-2">
                    <NotificationCenter />

                    {/* Timer CTA: orange is the active-focus semantic */}
                    <Link
                        to="/timer"
                        onClick={handleTimersClick}
                        aria-label="Timers"
                        className="inline-flex items-center gap-2 rounded-lg border-2 border-ink bg-focus px-3.5 py-2 text-sm font-bold text-ink shadow-hard-sm transition-all duration-fast hover:-translate-y-px hover:shadow-hard active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-xs"
                    >
                        <Timer className="h-4 w-4" aria-hidden="true" />
                        <span className="hidden sm:inline">Timers</span>
                    </Link>

                    {/* Profile dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setProfileOpen((o) => !o)}
                            aria-expanded={profileOpen}
                            aria-haspopup="menu"
                            className={`flex items-center gap-2 rounded-lg border-2 border-ink py-1.5 pl-1.5 pr-2.5 text-sm font-bold text-ink transition-all duration-fast ${
                                profileOpen
                                    ? 'bg-paper-deep'
                                    : 'bg-surface shadow-hard-xs hover:shadow-hard-sm'
                            }`}
                        >
                            <span
                                aria-hidden="true"
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-paper"
                            >
                                {initials}
                            </span>
                            <span className="hidden max-w-[80px] truncate sm:block">{username}</span>
                            <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={spring} className="flex">
                                <ChevronDown className="h-3.5 w-3.5 text-ink-soft" aria-hidden="true" />
                            </motion.span>
                        </button>

                        <AnimatePresence>
                            {profileOpen && (
                                <>
                                    {/* Click-away overlay */}
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setProfileOpen(false)}
                                        aria-hidden="true"
                                    />

                                    <motion.div
                                        role="menu"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 6 }}
                                        transition={spring}
                                        className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border-2 border-ink bg-surface shadow-hard"
                                    >
                                        {/* User info banner */}
                                        <div className="border-b-2 border-ink bg-paper px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    aria-hidden="true"
                                                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-ink bg-ink text-xs font-bold text-paper"
                                                >
                                                    {initials}
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-bold text-ink">{username}</p>
                                                    <p className="text-[11px] font-medium text-ink-faint">Signed in</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu items */}
                                        <div className="p-1.5">
                                            {[
                                                { icon: User, label: 'Profile', to: '/profile' },
                                            ].map(({ icon: Icon, label, to }) => (
                                                <Link
                                                    key={label}
                                                    to={to}
                                                    role="menuitem"
                                                    onClick={() => setProfileOpen(false)}
                                                    className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold text-ink transition-colors duration-fast hover:bg-paper-deep"
                                                >
                                                    <Icon className="h-4 w-4 text-ink-soft" aria-hidden="true" />
                                                    {label}
                                                </Link>
                                            ))}

                                            <div className="mx-2 my-1 h-px bg-line" />

                                            <button
                                                type="button"
                                                role="menuitem"
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold text-alert-deep transition-colors duration-fast hover:bg-alert-tint"
                                            >
                                                <LogOut className="h-4 w-4" aria-hidden="true" />
                                                Sign Out
                                            </button>
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