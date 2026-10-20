import { useState } from "react";
import { Bell } from "lucide-react";

import { userAppStore } from "@/store";
import useGetNotifications from "@/custom-hooks/notification/get-notification";
import NotificationPanel from "./notification-components/notification-panel";

const NotificationCenter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const user_id = userAppStore((state) => state.user_id) ?? "";

    // ? Lightweight call just to get the unread badge count on the bell
    const { data } = useGetNotifications(user_id, 1);
    const unreadCount = data?.data.unreadCount ?? 0;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label={
                    unreadCount > 0
                        ? `Open notifications, ${unreadCount} unread`
                        : "Open notifications"
                }
                className="press-hard relative flex h-10 w-10 items-center justify-center rounded-lg border-2 border-ink bg-surface text-ink"
            >
                <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
                {unreadCount > 0 && (
                    /* Unread = information not yet seen, so teal (info), never red:
                       red is reserved for problems. Mono keeps the count steady. */
                    <span
                        aria-hidden="true"
                        className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border border-ink bg-info px-1 font-mono text-[10px] font-bold leading-none tabular-nums text-ink"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default NotificationCenter;
