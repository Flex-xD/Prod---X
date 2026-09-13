import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, CheckCheck } from "lucide-react";
import { useState, useMemo } from "react";
import NotificationList from "../notification-list";
import { userAppStore } from "@/store";
import type { INotification } from "@/types/notification";
import useGetNotifications from "@/custom-hooks/notification/get-notification";
import { useMarkAllAsReadMutation } from "@/custom-hooks/notification/mark-as-read";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const sp = { type: "spring", damping: 30, stiffness: 300 } as const;

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
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50"
                        style={{ background: "rgba(15,23,42,0.4)", backdropFilter: "blur(2px)" }}
                    />

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={sp}
                        className="fixed top-0 right-0 h-screen w-full max-w-md z-50 flex flex-col"
                        style={{ background: "white", boxShadow: "-16px 0 48px rgba(0,0,0,0.18)" }}
                    >
                        <div
                            className="px-6 pt-6 pb-4 flex-shrink-0"
                            style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2.5">
                                    <div
                                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                                        style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)", boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}
                                    >
                                        <Bell className="w-4 h-4 text-white" />
                                    </div>
                                    <h2 className="text-lg font-black text-slate-900">Notifications</h2>
                                    {unreadCount > 0 && (
                                        <span
                                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                                            style={{ background: "#ede9fe", color: "#7c3aed" }}
                                        >
                                            {unreadCount} new
                                        </span>
                                    )}
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
                                >
                                    <X className="w-4 h-4 text-slate-500" />
                                </motion.button>
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-700 mt-2 transition-colors"
                                >
                                    <CheckCheck className="w-3.5 h-3.5" />
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