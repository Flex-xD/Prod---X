import { Loader2 } from "lucide-react";
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

const NotificationList = ({ notifications, isLoading, hasMore, onLoadMore, isFetchingMore }: Props) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-16">
                <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
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
                    onClick={onLoadMore}
                    disabled={isFetchingMore}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-violet-600 hover:bg-violet-50 transition-colors disabled:opacity-60"
                >
                    {isFetchingMore ? "Loading..." : "Load more"}
                </button>
            )}
        </div>
    );
};

export default NotificationList;