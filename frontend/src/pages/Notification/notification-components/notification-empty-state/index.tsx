import { motion } from "framer-motion";
import { BellOff } from "lucide-react";
import { enter } from "@/lib/motion";

// Dashed ink border = "nothing filed here", matching the dashboard's
// empty calendar panel rather than a floating tinted box.
const NotificationEmptyState = () => (
    <motion.div {...enter(0.04)} className="px-4 pb-4">
        <div className="rounded-lg border-2 border-dashed border-line px-6 py-12 text-center">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-sm border-2 border-ink bg-paper-deep">
                <BellOff className="h-5 w-5 text-ink-soft" aria-hidden="true" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink">
                You're all caught up
            </p>
            <p className="mt-1.5 text-xs font-medium text-ink-soft">No notifications right now.</p>
        </div>
    </motion.div>
);

export default NotificationEmptyState;
