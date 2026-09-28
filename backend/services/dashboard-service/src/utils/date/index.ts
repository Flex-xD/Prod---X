
export const toDateKey = (d: Date = new Date()): string => d.toISOString().slice(0, 10); // "YYYY-MM-DD"

export const daysBetween = (a: string, b: string): number => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const dateA = new Date(a + "T00:00:00Z").getTime();
    const dateB = new Date(b + "T00:00:00Z").getTime();
    return Math.round((dateB - dateA) / msPerDay);
};

export const lastNDateKeys = (n: number): string[] => {
    const keys: string[] = [];
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date();
        d.setUTCDate(d.getUTCDate() - i);
        keys.push(toDateKey(d));
    }
    return keys;
};