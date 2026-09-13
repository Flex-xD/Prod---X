import { motion } from "framer-motion";
import { Lightbulb, Sparkles, Clock3 } from "lucide-react";
import type { INotification } from "@/types/notification";

import { userAppStore } from "@/store";
import { timeAgo } from "@/utils/notification";

const ICON_MAP = {
    "daily-quote": Sparkles,
    "productivity-hack": Lightbulb,
} as const;

interface Props {
    notification: INotification;
    index: number;
}

const GenericNotificationItem = ({ notification, index }: Props) => {
    const user_id = userAppStore((state) => state.user_id) ?? "";
    const isUnread = !notification.readBy?.includes(user_id);
    const Icon = ICON_MAP[notification.notificationType as keyof typeof ICON_MAP] ?? Sparkles;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: "spring", damping: 26, stiffness: 300 }}
            className="p-4 rounded-2xl relative"
            style={{
                background: isUnread ? "linear-gradient(135deg,#fefce8,#fef9c3)" : "#f8fafc",
                border: isUnread ? "1.5px solid #fde68a" : "1.5px solid rgba(0,0,0,0.05)",
            }}
        >
            {isUnread && <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500" />}
            <div className="flex items-start gap-3" >
                <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", boxShadow: "0 4px 12px rgba(217,119,6,0.3)" }}
                >
                    <Icon className="w-4.5 h-4.5 w-[18px] h-[18px] text-white" />
                </div>
                < div className="flex-1 min-w-0" >
                    <p className="text-sm font-bold text-slate-900 leading-snug" > {notification.topic} </p>
                    < p className="text-xs text-slate-500 font-medium mt-1" > {notification.message} </p>
                    < p className="text-xs text-slate-400 font-semibold mt-2 flex items-center gap-1" >
                        <Clock3 className="w-3 h-3" /> {timeAgo(notification.createdAt)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default GenericNotificationItem;