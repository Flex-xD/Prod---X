import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { progressUpdate } from '@/lib/motion';

// ─── Circular SVG Progress Ring ───────────────────────────────────────────────

interface CircularRingProps {
    percent: number;
    size?: number;
    stroke?: number;
    color?: string;
    trackColor?: string;
    children?: ReactNode;
}

export const CircularRing = ({
    percent,
    size = 120,
    stroke = 8,
    color = '#a8d95b',
    trackColor = 'rgba(23,23,23,0.12)',
    children,
}: CircularRingProps) => {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percent / 100) * circ;

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden="true">
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none" stroke={trackColor} strokeWidth={stroke}
                />
                {/* Progress fill: draws on arrival, eases on every percent change. */}
                <motion.circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: offset }}
                    transition={progressUpdate}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">{children}</div>
        </div>
    );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_DIMS = { sm: 32, md: 40, lg: 56 } as const;
const AVATAR_FS = { sm: 11, md: 13, lg: 18 } as const;

interface AvatarProps {
    initials: string;
    size?: keyof typeof AVATAR_DIMS;
    isOnline?: boolean;
}

// Ink-on-paper initials, not a color per person: identity is text,
// presence is a dot. Green = online is a state, not decoration.
export const Avatar = ({ initials, size = 'md', isOnline }: AvatarProps) => {
    const d = AVATAR_DIMS[size];
    const fs = AVATAR_FS[size];

    return (
        <div className="relative shrink-0" style={{ width: d, height: d }}>
            <div
                className="flex h-full w-full items-center justify-center rounded-full border-2 border-ink bg-surface font-bold text-ink"
                style={{ fontSize: fs, letterSpacing: '0.02em' }}
            >
                {initials}
            </div>

            {isOnline !== undefined && (
                <span
                    className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-surface ${
                        isOnline ? 'bg-progress' : 'bg-line'
                    }`}
                    style={{
                        width: size === 'sm' ? 9 : 11,
                        height: size === 'sm' ? 9 : 11,
                    }}
                />
            )}
        </div>
    );
};

// ─── Slim Animated Progress Bar ───────────────────────────────────────────────

interface SlimBarProps {
    percent: number;
    height?: number;
    fillClass?: string;
    trackClass?: string;
}

// Growth uses progressUpdate (350ms ease-out): long enough to notice
// the fill move, short enough not to delay reading the new value.
export const SlimBar = ({
    percent,
    height = 4,
    fillClass = 'bg-progress',
    trackClass = 'bg-paper-deep',
}: SlimBarProps) => (
    <div className="w-full overflow-hidden rounded-full" style={{ height }}>
        <div className={`h-full w-full rounded-full ${trackClass}`}>
            <motion.div
                className={`h-full rounded-full ${fillClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={progressUpdate}
            />
        </div>
    </div>
);

// ─── Pill / Badge ─────────────────────────────────────────────────────────────

const PILL_STYLES: Record<string, string> = {
    focus: 'bg-focus-tint text-focus-deep border-focus',
    progress: 'bg-progress-tint text-progress-deep border-progress',
    alert: 'bg-alert-tint text-alert-deep border-alert',
    info: 'bg-info-tint text-info-deep border-info',
    neutral: 'bg-paper-deep text-ink-soft border-line',
};

interface PillProps {
    children: ReactNode;
    color?: keyof typeof PILL_STYLES;
    className?: string;
}

export const Pill = ({ children, color = 'neutral', className = '' }: PillProps) => (
    <span
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
            PILL_STYLES[color] ?? PILL_STYLES.neutral
        } ${className}`}
    >
        {children}
    </span>
);

// ─── Section Divider ──────────────────────────────────────────────────────────

export const SectionDivider = ({ children }: { children: ReactNode }) => (
    <div className="my-8 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-faint">
            {children}
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
    </div>
);

// ─── Stat Chip (used inside dark ink hero cards) ──────────────────────────────

interface StatChipProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
}

export const StatChip = ({ icon: Icon, label, value }: StatChipProps) => (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-paper/20 px-4 py-3">
        <Icon className="h-4 w-4 text-paper/60" aria-hidden="true" />
        {/* Mono, tabular: measured data keeps digits from jittering as values tick. */}
        <span className="font-mono text-base font-bold leading-none tabular-nums text-paper">{value}</span>
        <span className="text-[11px] font-medium text-paper/60">{label}</span>
    </div>
);

// ─── Press Button ─────────────────────────────────────────────────────────────

const BTN_VARIANTS = {
    primary: 'bg-ink text-paper',
    secondary: 'bg-surface text-ink',
    focus: 'bg-focus text-ink',
    success: 'bg-progress text-ink',
    successSoft: 'bg-progress-tint text-progress-deep',
};

interface PressBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof BTN_VARIANTS;
}

/**
 * The one button on this page: hard press feedback comes from the
 * shared `press-hard` utility (hover lift, 2px push, shadow
 * collapse), so callers only pass layout classes and a semantic
 * variant. Never pass a background class here - variant owns it.
 */
export const PressBtn = ({
    variant = 'primary',
    className = '',
    type = 'button',
    ...props
}: PressBtnProps) => (
    <button
        type={type}
        className={`press-hard inline-flex items-center justify-center gap-2 rounded-lg border-2 border-ink px-4 py-2.5 text-sm font-bold disabled:pointer-events-none disabled:opacity-50 ${BTN_VARIANTS[variant]} ${className}`}
        {...props}
    />
);