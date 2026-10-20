/**
 * Deterministic example data for the landing page.
 * Everything shown on the page (calendar, streak, weekly graph, hero numbers)
 * is derived from this one function, so the numbers always agree with each other.
 * It is illustration only and is labelled "Example data" wherever it appears.
 */

export type Level = 0 | 1 | 2 | 3;

export interface DaySample {
    daysAgo: number;
    level: Level;
    minutes: number;
    tasks: number;
}

const hash = (n: number): number => {
    const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
};

const MINUTES_BY_LEVEL: Record<Level, readonly [number, number]> = {
    0: [0, 0],
    1: [15, 60],
    2: [61, 150],
    3: [151, 290],
};

const TASKS_BY_LEVEL: Record<Level, number> = { 0: 0, 1: 2, 2: 4, 3: 7 };

export const sampleDay = (daysAgo: number): DaySample => {
    const f = hash(daysAgo + 1);
    let level: Level = f > 0.84 ? 3 : f > 0.62 ? 2 : f > 0.38 ? 1 : 0;

    if (daysAgo === 0) level = level >= 2 ? level : 2;
    else if (daysAgo < 7) level = level >= 1 ? level : 1;
    else if (daysAgo === 7) level = 0;

    const [lo, hi] = MINUTES_BY_LEVEL[level];
    const minutes = level === 0 ? 0 : Math.round(lo + hash(daysAgo + 101) * (hi - lo));
    return { daysAgo, level, minutes, tasks: TASKS_BY_LEVEL[level] };
};

const YEAR = 364;

export const currentStreak = (): number => {
    let n = 0;
    while (n < YEAR && sampleDay(n).level > 0) n += 1;
    return n;
};

export const bestStreak = (): number => {
    let best = 0;
    let run = 0;
    for (let d = YEAR - 1; d >= 0; d -= 1) {
        if (sampleDay(d).level > 0) {
            run += 1;
            if (run > best) best = run;
        } else {
            run = 0;
        }
    }
    return best;
};

export const consistency = (window = 30): number => {
    let active = 0;
    for (let d = 0; d < window; d += 1) if (sampleDay(d).level > 0) active += 1;
    return Math.round((active / window) * 100);
};

/** Oldest first, ending with today. */
export const lastSevenDays = (): DaySample[] =>
    Array.from({ length: 7 }, (_, i) => sampleDay(6 - i));

export const pad2 = (n: number): string => String(n).padStart(2, '0');

/** Minutes to hours:minutes, e.g. 167 -> "02:47". */
export const clock = (minutes: number): string =>
    `${pad2(Math.floor(minutes / 60))}:${pad2(minutes % 60)}`;

export const hoursMinutes = (minutes: number): string => {
    if (minutes === 0) return 'no focus time';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h === 0 ? `${m}m focus` : `${h}h ${pad2(m)}m focus`;
};

export const dateFor = (daysAgo: number): Date => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d;
};