import { useState } from "react";
import { motion } from "framer-motion";
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
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setIsOpen(true)}
                className="relative w-10 h-10 rounded-2xl flex items-center justify-center transition-colors"
                style={{ background: "#f8fafc", border: "1px solid rgba(0,0,0,0.06)" }}
            >
                <Bell className="w-4.5 h-4.5 text-slate-500 w-[18px] h-[18px]" />
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                        style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)", boxShadow: "0 0 0 2px white" }}
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </motion.button>

            <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default NotificationCenter;