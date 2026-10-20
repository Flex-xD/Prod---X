import type { Transition, Variants, ViewportOptions } from "framer-motion";

/**
 * Prod-X motion tokens — Phase 1.
 *
 * Motion is functional, not decorative: it communicates state
 * (press, fill, reveal), never spectacle. Keep this system small;
 * add a new preset only when an existing one genuinely cannot
 * express the interaction.
 *
 * These pair with the CSS duration tokens in src/index.css:
 * --transition-duration-fast (150ms) and
 * --transition-duration-base (220ms) cover
 * hover/press transitions; springs below drive JS animation.
 */

/** Primary preset — preserves the existing app-wide spring. */
export const spring: Transition = { type: "spring", damping: 28, stiffness: 300 };

/**
 * Faster settle for physical press feedback (shadow reduce +
 * 1–2px travel toward the shadow). Slightly stiffer so the
 * control feels like it snaps, not floats.
 */
export const pressSpring: Transition = { type: "spring", damping: 30, stiffness: 500 };

/** Short, plain duration transition for one-shot state changes. */
export const quick: Transition = { duration: 0.15, ease: "easeOut" };

/**
 * Progress number/fill updates (72% → 73%). Long enough to be
 * noticed, short enough not to delay reading the new value.
 */
export const progressUpdate: Transition = { duration: 0.35, ease: "easeOut" };

/** Scroll-reveal viewport used across sections: animate once. */
export const revealOnce: ViewportOptions = { once: true };



/**
 * Press micro-interaction travel, in px. Paired with the reduced
 * hard shadow (`shadow-hard-sm` → `shadow-hard-xs`) this gives
 * the physical "pushed into the page" feel. Use on:
 * press={{ y: PRESS_OFFSET }}
 */
export const PRESS_OFFSET = 2;


export const enter = (delay = 0) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { ...quick, delay },
});

export const cellFill: Variants = {
    hidden: { opacity: 0, scale: 0.4 },
    show: (delay: number) => ({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.22, ease: "easeOut", delay },
    }),
};

export const scrollEase: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

