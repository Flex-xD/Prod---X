import { motion } from "framer-motion";
import { BellOff } from "lucide-react";

const NotificationEmptyState = () => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center px-6"
    >
        <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "#f5f3ff", border: "1px solid #ddd6fe" }}
        >
            <BellOff className="w-6 h-6 text-violet-400" />
        </div>
        <p className="font-black text-slate-700 text-sm">You're all caught up!</p>
        <p className="text-slate-400 text-xs mt-1 font-medium">No notifications right now</p>
    </motion.div>
);

export default NotificationEmptyState;