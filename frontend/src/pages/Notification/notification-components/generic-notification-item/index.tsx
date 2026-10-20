import { motion } from "framer-motion";
import { Lightbulb, Sparkles, Clock3 } from "lucide-react";
import type { INotification } from "@/types/notification";

import { userAppStore } from "@/store";
import { timeAgo } from "@/utils/notification";
import { enter } from "@/lib/motion";

const ICON_MAP = {
    "daily-quote": Sparkles,
    "productivity-hack": Lightbulb,
} as const;

interface Props {
    notification: INotification;
    index: number;
}

// Teal = information: these are content to read, never an action.
// The tint + dot only mark unread; read cards sit quiet on plain
// surface. Capped stagger so a long list does not delay row one.
const GenericNotificationItem = ({ notification, index }: Props) => {
    const user_id = userAppStore((state) => state.user_id) ?? "";
    const isUnread = !notification.readBy?.includes(user_id);
    const Icon = ICON_MAP[notification.notificationType as keyof typeof ICON_MAP] ?? Sparkles;

    return (
        <motion.div
            {...enter(Math.min(index, 8) * 0.04)}
            className={`relative rounded-lg p-4 ${
                isUnread ? "border-2 border-ink bg-info-tint" : "border border-line bg-surface"
            }`}
        >
            {isUnread && (
                <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 h-2 w-2 rounded-full bg-info-deep"
                />
            )}
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-info text-ink">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 pr-6">
                    <p className="text-sm font-bold leading-snug text-ink">{notification.topic}</p>
                    <p className="mt-1 text-xs font-medium text-ink-soft">{notification.message}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-ink-faint">
                        <Clock3 className="h-3 w-3" aria-hidden="true" />{" "}
                        {timeAgo(notification.createdAt)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default GenericNotificationItem;
