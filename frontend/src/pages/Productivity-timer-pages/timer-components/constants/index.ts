import { Crown, Medal, Star } from 'lucide-react';
import type { IUser, IProductivityTimer, IGroupTimer } from '../types';

// ─── Animation Presets ────────────────────────────────────────────────────────

/** Snappy spring — good for most UI interactions */
export const sp = { type: 'spring', damping: 28, stiffness: 300 } as const;

/** Softer spring — better for large panels / modals entering */
export const softSp = { type: 'spring', damping: 32, stiffness: 200 } as const;

// ─── Avatar Gradient Pairs ────────────────────────────────────────────────────

export const AVATAR_COLORS: [string, string][] = [
    ['#7C3AED', '#4F46E5'],
    ['#EC4899', '#F43F5E'],
    ['#10B981', '#0D9488'],
    ['#F59E0B', '#EF4444'],
    ['#3B82F6', '#6366F1'],
    ['#A855F7', '#EC4899'],
];

// ─── Rank Config ──────────────────────────────────────────────────────────────

export const RANK_CONFIG = [
    { icon: Crown, bg: 'from-amber-400 to-yellow-500' },
    { icon: Medal, bg: 'from-slate-300 to-slate-400' },
    { icon: Star, bg: 'from-orange-400 to-amber-500' },
] as const;

// ─── Business Rules ───────────────────────────────────────────────────────────

export const MAX_INDIVIDUAL_TIMERS = 5;
export const MAX_GROUP_INVITES = 5;

// ─── Dummy / Seed Data ────────────────────────────────────────────────────────
// Replace these with real API calls in your data-fetching hooks.

export const dummyMe: IUser = {
    id: 'me',
    username: 'you',
    avatar: '',
    initials: 'YU',
    isOnline: true,
};

export const dummyIndividualTimers: IProductivityTimer[] = [
    {
        id: '1',
        title: 'DSA Practice',
        description: 'Leetcode hard problems + revision',
        deadline: '2025-05-10',
        specifiedTime: 120,
        productivityDone: 4320,
        isActive: false,
        createdAt: '2025-05-01',
    },
    {
        id: '2',
        title: 'System Design',
        description: 'Read Designing Data-Intensive Applications',
        deadline: '2025-05-15',
        specifiedTime: 180,
        productivityDone: 2700,
        isActive: true,
        createdAt: '2025-05-02',
    },
    {
        id: '3',
        title: 'Portfolio Polish',
        description: 'Fix responsive issues + add animations',
        deadline: '2025-05-08',
        specifiedTime: 90,
        productivityDone: 900,
        isActive: false,
        createdAt: '2025-05-03',
    },
];

export const dummyGroupTimers: IGroupTimer[] = [
    {
        id: 'g1',
        title: 'Startup Sprint',
        description: 'Building the MVP together this week',
        deadline: '2025-05-12',
        specifiedTime: 180,
        author: {
            id: 'u1',
            username: 'aditya_dev',
            avatar: '',
            initials: 'AD',
            isOnline: true,
        },
        isJoined: true,
        participants: [
            {
                user: { id: 'u1', username: 'aditya_dev', avatar: '', initials: 'AD', isOnline: true },
                productivityDone: 7200,
                isCurrentlyActive: true,
                rank: 1,
            },
            {
                user: dummyMe,
                productivityDone: 5400,
                isCurrentlyActive: false,
                rank: 2,
            },
            {
                user: { id: 'u2', username: 'sara_codes', avatar: '', initials: 'SC', isOnline: true },
                productivityDone: 3600,
                isCurrentlyActive: true,
                rank: 3,
            },
            {
                user: { id: 'u3', username: 'dev_rohan', avatar: '', initials: 'DR', isOnline: false },
                productivityDone: 1800,
                isCurrentlyActive: false,
                rank: 4,
            },
        ],
    },
];

export const dummySearchUsers: IUser[] = [
    { id: 'u10', username: 'kaito_builds', avatar: '', initials: 'KB', isOnline: true },
    { id: 'u11', username: 'priya_focuses', avatar: '', initials: 'PF', isOnline: false },
    { id: 'u12', username: 'zara_dev', avatar: '', initials: 'ZD', isOnline: true },
    { id: 'u13', username: 'leo_codes', avatar: '', initials: 'LC', isOnline: true },
    { id: 'u14', username: 'mia_builds', avatar: '', initials: 'MB', isOnline: false },
];