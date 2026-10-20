import type { INotification } from "@/types/notification";
import NotificationItem from "../notification-item";
import NotificationEmptyState from "../notification-empty-state";

interface Props {
    notifications: INotification[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    isFetchingMore: boolean;
}

const SKELETON_ROWS = [0, 1, 2];

const NotificationList = ({ notifications, isLoading, hasMore, onLoadMore, isFetchingMore }: Props) => {
    if (isLoading) {
        // Skeleton rows in the real row shape: the list holds its layout
        // instead of collapsing to a centered spinner on every refetch.
        return (
            <div role="status" className="space-y-2.5 px-4 pb-4">
                <span className="sr-only">Loading notifications</span>
                {SKELETON_ROWS.map((i) => (
                    <div
                        key={i}
                        className="flex gap-3 rounded-lg border-2 border-line bg-surface p-4"
                    >
                        <div className="h-10 w-10 flex-shrink-0 animate-skeleton-pulse rounded-sm bg-paper-deep" />
                        <div className="min-w-0 flex-1 space-y-2 pt-0.5">
                            <div className="h-3 w-2/3 animate-skeleton-pulse rounded-sm bg-paper-deep" />
                            <div className="h-3 w-1/2 animate-skeleton-pulse rounded-sm bg-paper-deep" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!notifications.length) return <NotificationEmptyState />;

    return (
        <div className="space-y-2.5 px-4 pb-4">
            {notifications.map((n, i) => (
                <NotificationItem key={n._id} notification={n} index={i} />
            ))}

            {hasMore && (
                <button
                    type="button"
                    onClick={onLoadMore}
                    disabled={isFetchingMore}
                    className="press-hard w-full rounded-lg border-2 border-ink bg-surface py-2.5 text-xs font-bold uppercase tracking-wider text-ink disabled:pointer-events-none disabled:opacity-60"
                >
                    {isFetchingMore ? "Loading..." : "Load more"}
                </button>
            )}
        </div>
    );
};

export default NotificationList;
