import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { getAvatarColors } from '../utils';

// ─── Circular SVG Progress Ring ───────────────────────────────────────────────

interface CircularRingProps {
  percent: number;
  size?: number;
  stroke?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
}

export const CircularRing = ({
  percent,
  size = 120,
  stroke = 8,
  color = '#7C3AED',
  trackColor = 'rgba(255,255,255,0.1)',
  children,
}: CircularRingProps) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={trackColor} strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const AVATAR_DIMS = { sm: 32, md: 40, lg: 56 } as const;
const AVATAR_FS   = { sm: 11, md: 13, lg: 18 } as const;

interface AvatarProps {
  initials: string;
  idx: number;
  size?: keyof typeof AVATAR_DIMS;
  isOnline?: boolean;
}

export const Avatar = ({ initials, idx, size = 'md', isOnline }: AvatarProps) => {
  const [c1, c2] = getAvatarColors(idx);
  const d  = AVATAR_DIMS[size];
  const fs = AVATAR_FS[size];

  return (
    <div className="relative shrink-0" style={{ width: d, height: d }}>
      <div
        className="w-full h-full rounded-2xl flex items-center justify-center text-white font-bold"
        style={{
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
          fontSize: fs,
          letterSpacing: '0.02em',
        }}
      >
        {initials}
      </div>

      {isOnline !== undefined && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white ${
            isOnline ? 'bg-emerald-400' : 'bg-slate-300'
          }`}
          style={{
            width:  size === 'sm' ? 9 : 11,
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
  gradient?: string;
  height?: number;
  trackColor?: string;
}

export const SlimBar = ({
  percent,
  gradient = 'linear-gradient(90deg, #7C3AED, #6366F1)',
  height = 3,
  trackColor = 'rgba(0,0,0,0.06)',
}: SlimBarProps) => (
  <div
    className="w-full rounded-full overflow-hidden"
    style={{ height, background: trackColor }}
  >
    <motion.div
      className="h-full rounded-full"
      style={{ background: gradient }}
      initial={{ width: 0 }}
      animate={{ width: `${percent}%` }}
      transition={{ duration: 1, ease: [0.34, 1.2, 0.64, 1] }}
    />
  </div>
);

// ─── Pill / Badge ─────────────────────────────────────────────────────────────

const PILL_STYLES: Record<string, string> = {
  violet:  'bg-violet-50 text-violet-600 border-violet-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber:   'bg-amber-50 text-amber-600 border-amber-100',
  rose:    'bg-rose-50 text-rose-600 border-rose-100',
  slate:   'bg-slate-50 text-slate-500 border-slate-100',
};

interface PillProps {
  children: React.ReactNode;
  color?: keyof typeof PILL_STYLES;
}

export const Pill = ({ children, color = 'violet' }: PillProps) => (
  <span
    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
      PILL_STYLES[color] ?? PILL_STYLES.slate
    }`}
  >
    {children}
  </span>
);

// ─── Section Divider ─────────────────────────────────────────────────────────

export const SectionDivider = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 my-8">
    <div
      className="h-px flex-1"
      style={{ background: 'linear-gradient(90deg, transparent, #e2e8f0)' }}
    />
    <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
      {children}
    </span>
    <div
      className="h-px flex-1"
      style={{ background: 'linear-gradient(90deg, #e2e8f0, transparent)' }}
    />
  </div>
);

// ─── Stat Chip (used inside dark hero cards) ──────────────────────────────────

interface StatChipProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

export const StatChip = ({ icon: Icon, label, value }: StatChipProps) => (
  <div
    className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl"
    style={{ background: 'rgba(255,255,255,0.1)' }}
  >
    <Icon className="w-4 h-4 opacity-60" />
    <span className="text-base font-bold leading-none">{value}</span>
    <span className="text-xs opacity-50 font-medium">{label}</span>
  </div>
);

// ─── Magnetic Button ─────────────────────────────────────────────────────────

interface MagBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

export const MagBtn = ({ children, onClick, style, className, disabled }: MagBtnProps) => {
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);
  const sx  = useSpring(x, { stiffness: 180, damping: 18 });
  const sy  = useSpring(y, { stiffness: 180, damping: 18 });
  const ref = useRef<HTMLButtonElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width  / 2) * 0.22);
    y.set((e.clientY - rect.top  - rect.height / 2) * 0.22);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy, ...style }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </motion.button>
  );
};