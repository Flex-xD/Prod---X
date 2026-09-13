import { motion } from "framer-motion";
import { Users, Check, X, Clock3 } from "lucide-react";
import type { INotification, InvitationStatus } from "@/types/notification";
import { userAppStore } from "@/store";
import useRespondToInvitationMutation from "@/custom-hooks/notification/response-invitation";
import { timeAgo } from "@/utils/notification";

interface Props {
    notification: INotification;
    index: number;
}

const sp = { type: "spring", damping: 26, stiffness: 300 } as const;

const InvitationNotificationItem = ({ notification, index }: Props) => {
    const user_id = userAppStore((state) => state.user_id) ?? "";
    const { mutate: respond, isPending, variables } = useRespondToInvitationMutation(user_id);

    const myResponse = notification.invitationResponses?.find((r) => r.userId === user_id);
    const status: InvitationStatus = myResponse?.status ?? "pending";
    const isUnread = !notification.readBy?.includes(user_id);

    const handleRespond = (nextStatus: "accepted" | "declined") => {
        if (!notification.invitation) return;
        respond({
            groupTimerId: notification.invitation.groupTimerId,
            notificationId: notification._id,
            status: nextStatus,
        });
    };

    const pendingAction = isPending ? variables?.status : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, ...sp }}
            className="p-4 rounded-2xl relative"
            style={{
                background: isUnread ? "linear-gradient(135deg,#f5f3ff,#ede9fe)" : "#f8fafc",
                border: isUnread ? "1.5px solid #ddd6fe" : "1.5px solid rgba(0,0,0,0.05)",
            }}
        >
            {isUnread && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-violet-500" />
            )}

            <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)", boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}
                >
                    <Users className="w-4.5 h-4.5 w-[18px] h-[18px] text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 leading-snug">
                        <span className="text-violet-600">{notification.from?.username ?? "Someone"}</span>{" "}
                        invited you to join{" "}
                        <span className="font-black">"{notification.invitation?.timerName ?? "a group timer"}"</span>
                    </p>
                    <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                        <Clock3 className="w-3 h-3" /> {timeAgo(notification.createdAt)}
                    </p>

                    {/* Actions / status */}
                    <div className="mt-3">
                        {status === "pending" ? (
                            <div className="flex gap-2">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isPending}
                                    onClick={() => handleRespond("accepted")}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white transition-opacity disabled:opacity-60"
                                    style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)", boxShadow: "0 4px 12px rgba(124,58,237,0.3)" }}
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    {pendingAction === "accepted" ? "Accepting..." : "Accept"}
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isPending}
                                    onClick={() => handleRespond("declined")}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-opacity disabled:opacity-60"
                                    style={{ background: "white", color: "#64748b", border: "1.5px solid rgba(0,0,0,0.08)" }}
                                >
                                    <X className="w-3.5 h-3.5" />
                                    {pendingAction === "declined" ? "Declining..." : "Decline"}
                                </motion.button>
                            </div>
                        ) : (
                            <span
                                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                                style={
                                    status === "accepted"
                                        ? { background: "#dcfce7", color: "#16a34a" }
                                        : { background: "#fee2e2", color: "#dc2626" }
                                }
                            >
                                {status === "accepted" ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                {status === "accepted" ? "Accepted" : "Declined"}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default InvitationNotificationItem;