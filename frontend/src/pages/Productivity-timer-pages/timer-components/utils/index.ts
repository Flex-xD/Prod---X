// ─── Time Formatters ──────────────────────────────────────────────────────────

/**
 * Formats a raw second count into a human-readable string.
 * @example formatSeconds(3900) → "1h 5m"
 * @example formatSeconds(185)  → "3m 5s"
 */
export const formatSeconds = (s: number): string => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s % 60}s`;
};

/**
 * Formats a raw minute count into a human-readable string.
 * @example formatMinutes(90)  → "1.5h"
 * @example formatMinutes(45)  → "45m"
 */
export const formatMinutes = (m: number): string =>
    m >= 60 ? `${(m / 60).toFixed(1)}h` : `${m}m`;

// ─── Progress ─────────────────────────────────────────────────────────────────

/**
 * Returns a 0–100 completion percentage.
 * @param done  Seconds already focused
 * @param total Goal in minutes (converted internally)
 */
export const progressPercent = (done: number, total: number): number =>
    Math.min(100, Math.round((done / (total * 60)) * 100));

/** True when the deadline is in the past. */
export const isExpired = (deadline: string): boolean =>
    new Date(deadline).getTime() < Date.now();

/** First letters of a (possibly multi-word) username, max 2. */
export const initialsOf = (name: string): string =>
    name
        .split(' ')
        .map((word) => word.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase();