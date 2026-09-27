import { Crown, Medal, Star } from 'lucide-react';


export const sp = { type: 'spring', damping: 28, stiffness: 300 } as const;

export const softSp = { type: 'spring', damping: 32, stiffness: 200 } as const;

export const AVATAR_COLORS: [string, string][] = [
    ['#7C3AED', '#4F46E5'],
    ['#EC4899', '#F43F5E'],
    ['#10B981', '#0D9488'],
    ['#F59E0B', '#EF4444'],
    ['#3B82F6', '#6366F1'],
    ['#A855F7', '#EC4899'],
];


export const RANK_CONFIG = [
    { icon: Crown, bg: 'from-amber-400 to-yellow-500' },
    { icon: Medal, bg: 'from-slate-300 to-slate-400' },
    { icon: Star, bg: 'from-orange-400 to-amber-500' },
] as const;

export const MAX_INDIVIDUAL_TIMERS = 5;
export const MAX_GROUP_TIMERS = 5;
export const MAX_GROUP_INVITES = 5;
