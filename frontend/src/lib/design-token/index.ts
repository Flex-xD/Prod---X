/**
 * Prod-X design tokens for places CSS classes cannot reach:
 * Framer Motion props, chart libraries, inline SVG.
 *
 * The source of truth for colors is src/styles/prodx-tokens.css.
 * Keep INK_HEX in sync with --color-ink there.
 */

/** Colors as CSS variables: safe in inline styles, SVG fill/stroke, and chart props. */
export const colors = {
    paper: 'var(--color-paper)',
    paperDeep: 'var(--color-paper-deep)',
    surface: 'var(--color-surface)',
    ink: 'var(--color-ink)',
    inkSoft: 'var(--color-ink-soft)',
    rule: 'var(--color-rule)',
    progress: 'var(--color-progress)',
    progressWash: 'var(--color-progress-wash)',
    progressInk: 'var(--color-progress-ink)',
    focus: 'var(--color-focus)',
    focusWash: 'var(--color-focus-wash)',
    focusInk: 'var(--color-focus-ink)',
    alert: 'var(--color-alert)',
    alertWash: 'var(--color-alert-wash)',
    alertInk: 'var(--color-alert-ink)',
    info: 'var(--color-info)',
    infoWash: 'var(--color-info-wash)',
    infoInk: 'var(--color-info-ink)',
} as const;

/** Activity calendar intensity, index = level (0 empty ... 3 strongest). */
export const activityLevels = [
    'var(--color-activity-0)',
    'var(--color-activity-1)',
    'var(--color-activity-2)',
    'var(--color-activity-3)',
] as const;

/**
 * Framer Motion cannot interpolate var() inside box-shadow, so shadows
 * used in animation props are literal strings.
 */
const INK_HEX = '#171717';

export const hardShadow = {
    rest: `4px 4px 0 ${INK_HEX}`,
    small: `3px 3px 0 ${INK_HEX}`,
    pressed: `2px 2px 0 ${INK_HEX}`,
    none: `0 0 0 ${INK_HEX}`,
} as const;

/** Existing Prod-X spring, preserved from the current codebase. */
export const spring = { type: 'spring', damping: 28, stiffness: 300 } as const;

/** Durations in seconds, matching --duration-* in CSS. */
export const duration = {
    fast: 0.12,
    base: 0.2,
    slow: 0.32,
} as const;

/** Matches --ease-out in CSS. */
export const easeOut = [0.2, 0, 0, 1] as const;

/**
 * Physical press for hard-shadow controls.
 * Usage: <motion.button {...pressMotion} className="border-2 border-ink" />
 * Hover lifts the element 1px away from its shadow, press pushes it onto the shadow.
 */
export const pressMotion = {
    initial: false,
    whileHover: { x: -1, y: -1, boxShadow: hardShadow.rest },
    whileTap: { x: 2, y: 2, boxShadow: hardShadow.pressed },
    transition: spring,
} as const;

/** Page and section entrance: opacity plus 8px vertical, fast. */
export const enter = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: duration.slow, ease: easeOut },
} as const;