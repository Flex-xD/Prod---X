import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView, useReducedMotion, type Variants } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { progressUpdate, quick, spring } from '@/lib/motion';
import { cn } from '@/utils/utils';
import { scrollToSection } from '../scroll';

/* ---------- Style constants (same vocabulary as the Dashboard) ---------- */
export const PANEL = 'rounded-lg border-2 border-ink bg-surface';
export const LABEL = 'text-[11px] font-bold uppercase tracking-[0.14em] text-ink-soft';
export const MONO = 'font-mono tabular-nums';
/** Calendar intensity, index = level 0..3. Same green ramp as the Dashboard calendar. */
export const LEVEL_BG = ['bg-paper-deep', 'bg-progress/30', 'bg-progress/65', 'bg-progress'] as const;

/* ---------- Hooks ---------- */
/** True once the element has scrolled into view (fires once). */
export function useReveal<T extends HTMLElement>(amount = 0.4) {
    const ref = useRef<T>(null);
    const inView = useInView(ref, { once: true, amount });
    return { ref, inView };
}

/** Skeleton first, content after `ms` once in view: mirrors the real loading states. */
export function useReadyAfter<T extends HTMLElement>(ms: number) {
    const { ref, inView } = useReveal<T>(0.5);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (!inView) return;
        const id = window.setTimeout(() => setReady(true), ms);
        return () => window.clearTimeout(id);
    }, [inView, ms]);
    return { ref, ready };
}

/* ---------- Buttons and links ---------- */
type ButtonVariant = 'primary' | 'secondary' | 'onInk';

const BUTTON_BASE =
    'inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg border-2 px-5 text-base font-bold text-ink transition-all duration-fast active:translate-x-[2px] active:translate-y-[2px]';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
    primary: 'border-ink bg-progress shadow-hard-sm hover:-translate-y-px hover:shadow-hard active:shadow-hard-xs',
    secondary: 'border-ink bg-surface shadow-hard-sm hover:-translate-y-px hover:shadow-hard active:shadow-hard-xs',
    onInk:
        'border-paper bg-progress shadow-[3px_3px_0_0_var(--color-paper)] hover:-translate-y-px hover:shadow-[4px_4px_0_0_var(--color-paper)] active:shadow-[2px_2px_0_0_var(--color-paper)]',
};

type LinkButtonProps = {
    variant?: ButtonVariant;
    className?: string;
    children: ReactNode;
    /** Called with true on hover/focus and false on leave/blur. */
    onActiveChange?: (active: boolean) => void;
} & ({ to: string; href?: never } | { href: string; to?: never });

/** A real link styled as a button. In-page anchors use the animated scroll. */
export function LinkButton({ variant = 'primary', className, children, onActiveChange, to, href }: LinkButtonProps) {
    const cls = cn(BUTTON_BASE, BUTTON_VARIANTS[variant], className);
    const activity = onActiveChange
        ? {
              onMouseEnter: () => onActiveChange(true),
              onMouseLeave: () => onActiveChange(false),
              onFocus: () => onActiveChange(true),
              onBlur: () => onActiveChange(false),
          }
        : {};

    if (to !== undefined) {
        return (
            <Link to={to} className={cls} {...activity}>
                {children}
            </Link>
        );
    }
    return (
        <a
            href={href}
            className={cls}
            {...activity}
            onClick={(e) => {
                if (href?.startsWith('#')) {
                    e.preventDefault();
                    scrollToSection(href.slice(1));
                }
            }}
        >
            {children}
        </a>
    );
}

export function AnchorLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
    return (
        <a
            href={href}
            className={className}
            onClick={(e) => {
                e.preventDefault();
                scrollToSection(href.slice(1));
            }}
        >
            {children}
        </a>
    );
}

/* ---------- Brand ---------- */
/** Four squares that fill in: the same idea as the activity calendar. */
export function Wordmark({ tone = 'ink' }: { tone?: 'ink' | 'paper' }) {
    const border = tone === 'paper' ? 'border-paper' : 'border-ink';
    return (
        <span className={cn('inline-flex items-center gap-2.5 text-lg font-bold tracking-tight', tone === 'paper' ? 'text-paper' : 'text-ink')}>
            <span aria-hidden className="grid grid-cols-2 gap-[3px]">
                <span className={cn('size-[11px] border-2 bg-progress/30', border)} />
                <span className={cn('size-[11px] border-2 bg-progress/65', border)} />
                <span className={cn('size-[11px] border-2 bg-progress', border)} />
                <span className={cn('size-[11px] border-2 bg-transparent', border)} />
            </span>
            Prod-X
        </span>
    );
}

/* ---------- Section heading with arrival highlight ----------
   scrollToSection() sets data-arrived on the section for ~1.4s; the section
   must carry the `group/section` class. */
export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <h2 className={cn('text-3xl font-bold sm:text-4xl', className)}>
            <span className="-mx-1 box-decoration-clone px-1 transition-colors duration-base group-data-[arrived=true]/section:bg-progress-tint">
                {children}
            </span>
        </h2>
    );
}

/* ---------- Numbers ---------- */
/** Counts up once when scrolled into view. Screen readers get the final value. */
export function CountUp({
    value,
    format = (n) => String(Math.round(n)),
    duration = 0.9,
}: {
    value: number;
    format?: (n: number) => string;
    duration?: number;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const reduce = useReducedMotion();
    const [display, setDisplay] = useState(reduce ? value : 0);

    useEffect(() => {
        if (!inView) return;
        if (reduce) {
            setDisplay(value);
            return;
        }
        const controls = animate(0, value, { duration, ease: 'easeOut', onUpdate: setDisplay });
        return () => controls.stop();
    }, [inView, reduce, value, duration]);

    return (
        <span ref={ref}>
            <span aria-hidden>{format(display)}</span>
            <span className="sr-only">{format(value)}</span>
        </span>
    );
}

/** Number that changes with a short, quiet transition. */
export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
    return (
        <motion.span
            key={value}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={quick}
            className={cn('inline-block', className)}
        >
            {value}
        </motion.span>
    );
}

/* ---------- Calendar and streak primitives ---------- */
/** Fill overlay for calendar-style cells. `custom` is the delay in seconds. */
export const cellFill: Variants = {
    hidden: { opacity: 0, scale: 0.4 },
    show: (delay: number) => ({ opacity: 1, scale: 1, transition: { duration: 0.22, ease: 'easeOut', delay } }),
};

/** Streak as blocks: each filled block rises in sequence. */
export function StreakBlocks({ count, total }: { count: number; total: number }) {
    return (
        <span aria-hidden className="flex w-full gap-1">
            {Array.from({ length: total }, (_, i) => (
                <span key={i} className="relative h-2.5 flex-1 overflow-hidden rounded-sm border border-ink bg-surface">
                    {i < count && (
                        <motion.span
                            className="absolute inset-0 origin-bottom bg-progress"
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ ...quick, delay: i * 0.05 }}
                        />
                    )}
                </span>
            ))}
        </span>
    );
}

/* ---------- Tasks ---------- */
/** Same markup language as the Dashboard task row. Interactive only when onToggle is given. */
export function TaskRow({ label, done, onToggle }: { label: string; done: boolean; onToggle?: () => void }) {
    const inner = (
        <>
            <span
                aria-hidden
                className={cn(
                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm border-2 border-ink transition-colors duration-fast',
                    done ? 'bg-progress' : 'bg-transparent',
                )}
            >
                {done && <Check className="size-3.5 text-ink" strokeWidth={3} />}
            </span>
            <span className={cn('min-w-0 flex-1 text-sm font-semibold leading-snug', done ? 'text-ink-soft line-through' : 'text-ink')}>
                {label}
            </span>
            {done && (
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={quick}
                    className="shrink-0 rounded-full bg-progress-tint px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-progress-deep"
                >
                    Done
                </motion.span>
            )}
        </>
    );
    const base = 'flex w-full items-start gap-3 px-1 py-3.5 text-left';
    return onToggle ? (
        <button
            type="button"
            onClick={onToggle}
            aria-pressed={done}
            className={cn(base, 'transition-colors duration-fast hover:bg-paper active:bg-paper-deep')}
        >
            {inner}
        </button>
    ) : (
        <div className={base}>{inner}</div>
    );
}

export function TaskProgress({ done, total }: { done: number; total: number }) {
    const pct = total > 0 ? (done / total) * 100 : 0;
    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                <span>Progress</span>
                <span className={cn(MONO, 'text-progress-deep')}>
                    <AnimatedNumber value={done} />/{total} done
                </span>
            </div>
            <div
                role="progressbar"
                aria-label="Tasks done"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={done}
                className="h-2 w-full overflow-hidden rounded-sm bg-paper-deep"
            >
                <motion.div className="h-full rounded-sm bg-progress" initial={false} animate={{ width: `${pct}%` }} transition={progressUpdate} />
            </div>
        </div>
    );
}

/* ---------- Group ranking ---------- */
export interface Participant {
    name: string;
    seconds: number;
}

export const mmss = (s: number): string =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/** Ranked rows. Reordering is animated with layout so rank changes are visible. */
export function RankRows({ participants, goal }: { participants: readonly Participant[]; goal: number }) {
    const { ref, inView } = useReveal<HTMLOListElement>(0.3);
    return (
        <ol ref={ref}>
            {participants.map((p, i) => {
                const finished = p.seconds >= goal;
                const pct = Math.min(p.seconds / goal, 1) * 100;
                return (
                    <motion.li
                        key={p.name}
                        layout
                        transition={spring}
                        className={cn(
                            'grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-line px-4 py-3.5 last:border-b-0 sm:px-6',
                            p.name === 'You' && 'bg-paper',
                        )}
                    >
                        <span className={cn(MONO, 'text-lg font-bold')}>{String(i + 1).padStart(2, '0')}</span>
                        <div>
                            <p className={cn('text-sm text-ink', p.name === 'You' ? 'font-bold' : 'font-semibold')}>{p.name}</p>
                            <div aria-hidden className="mt-1.5 h-2.5 overflow-hidden rounded-sm bg-paper-deep">
                                <motion.div
                                    className={cn('h-full rounded-sm', finished ? 'bg-progress' : 'bg-focus')}
                                    initial={{ width: 0 }}
                                    animate={{ width: inView ? `${pct}%` : 0 }}
                                    transition={progressUpdate}
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={cn(MONO, 'text-sm font-bold')}>{mmss(p.seconds)}</p>
                            <p
                                className={cn(
                                    'mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink',
                                    finished ? 'bg-progress' : 'bg-focus',
                                )}
                            >
                                {finished ? 'Finished' : 'Focusing'}
                            </p>
                        </div>
                    </motion.li>
                );
            })}
        </ol>
    );
}

/* ---------- Misc ---------- */
export const Skeleton = ({ className }: { className?: string }) => (
    <div aria-hidden className={cn('animate-skeleton-pulse rounded-sm bg-paper-deep', className)} />
);

export function ExampleNote({ children = 'Example data. Your calendar fills from your own sessions and tasks.' }: { children?: ReactNode }) {
    return <p className="border-t-2 border-ink bg-paper px-4 py-2 text-xs font-medium text-ink-soft sm:px-6">{children}</p>;
}