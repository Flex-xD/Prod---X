export const formatDuration = (seconds: number): string => {
    const total = Math.max(0, Math.round(seconds));
    if (total === 0) return "0m";
    if (total < 60) return `${total}s`;
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const formatDateLabel = (dateKey: string): string =>
    new Date(`${dateKey}T00:00:00Z`).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });