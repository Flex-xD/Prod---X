import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck } from "lucide-react";
import { useState, useMemo } from "react";
import NotificationList from "../notification-list";
import { userAppStore } from "@/store";
import type { INotification } from "@/types/notification";
import useGetNotifications from "@/custom-hooks/notification/get-notification";
import { useMarkAllAsReadMutation } from "@/custom-hooks/notification/mark-as-read";
import { spring } from "@/lib/motion";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationPanel = ({ isOpen, onClose }: Props) => {
    const user_id = userAppStore((state) => state.user_id) ?? "";
    const [page, setPage] = useState(1);
    const [accumulated, setAccumulated] = useState<INotification[]>([]);

    const { data, isLoading, isFetching } = useGetNotifications(user_id, page);
    const { mutate: markAllAsRead } = useMarkAllAsReadMutation(user_id);

    const notifications = useMemo(() => {
        if (page === 1) return data?.data.notifications ?? [];
        return [...accumulated, ...(data?.data.notifications ?? [])];
    }, [data, page, accumulated]);

    const hasMore = data?.data.hasMore ?? false;
    const unreadCount = data?.data.unreadCount ?? 0;

    const handleLoadMore = () => {
        setAccumulated(notifications);
        setPage((p) => p + 1);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop: flat ink wash, no blur - depth comes from the
                        sheet's hard offset shadow, not from optics. */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-ink/60"
                        aria-hidden="true"
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="notification-panel-title"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={spring}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") onClose();
                        }}
                        className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-md flex-col border-l-2 border-ink bg-surface"
                        style={{ boxShadow: "-6px 0 0 0 var(--color-ink)" }}
                    >
                        <div className="flex-shrink-0 border-b-2 border-ink px-6 pb-4 pt-6">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span
                                        aria-hidden="true"
                                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-ink text-paper"
                                    >
                                        <Bell className="h-4 w-4" />
                                    </span>
                                    <div>
                                        <h2
                                            id="notification-panel-title"
                                            className="text-sm font-bold uppercase tracking-[0.14em] text-ink"
                                        >
                                            Notifications
                                        </h2>
                                        {unreadCount > 0 && (
                                            <span className="mt-1 inline-flex items-center rounded-full border border-info bg-info-tint px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-info-deep">
                                                {unreadCount} new
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close notifications"
                                    className="-m-1.5 rounded-sm p-1.5 text-ink-soft transition-colors duration-fast hover:bg-paper-deep hover:text-ink"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => markAllAsRead()}
                                    className="press-hard mt-3 inline-flex items-center gap-1.5 rounded-lg border-2 border-ink bg-surface px-3 py-1.5 text-xs font-bold text-ink"
                                >
                                    <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto pt-4">
                            <NotificationList
                                notifications={notifications}
                                isLoading={isLoading && page === 1}
                                hasMore={hasMore}
                                onLoadMore={handleLoadMore}
                                isFetchingMore={isFetching && page > 1}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationPanel;
