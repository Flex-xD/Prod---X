import { motion } from "framer-motion";
import { Users, Check, X, Clock3 } from "lucide-react";
import type { INotification, InvitationStatus } from "@/types/notification";
import { userAppStore } from "@/store";
import useRespondToInvitationMutation from "@/custom-hooks/notification/response-invitation";
import { timeAgo } from "@/utils/notification";
import { enter } from "@/lib/motion";

interface Props {
    notification: INotification;
    index: number;
}

const InvitationNotificationItem = ({ notification, index }: Props) => {
    const user_id = userAppStore((state) => state.user_id) ?? "";
    const { mutate: handleResponseMutation, isPending, variables } = useRespondToInvitationMutation(user_id);

    const myResponse = notification.invitationResponses?.find((r) => r.userId === user_id);
    const status: InvitationStatus = myResponse?.status ?? "pending";
    const isUnread = !notification.readBy?.includes(user_id);

    const handleResponse = (nextStatus: "accepted" | "declined") => {
        if (!notification.invitation) return;
        handleResponseMutation({
            groupTimerId: notification.invitation.groupTimerId,
            status: nextStatus,
        });
    };

    const pendingAction = isPending ? variables?.status : null;

    return (
        <motion.div
            {...enter(Math.min(index, 8) * 0.04)}
            className={`relative rounded-lg p-4 ${
                isUnread ? "border-2 border-ink bg-focus-tint" : "border border-line bg-surface"
            }`}
        >
            {/* Unread = a decision waiting on you, so focus orange marks current
                attention. The tint clears when the item is read; the pills below
                carry the decision itself. */}
            {isUnread && (
                <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 h-2 w-2 rounded-full bg-focus-deep"
                />
            )}

            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm border-2 border-ink bg-focus text-ink">
                    <Users className="h-[18px] w-[18px]" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1 pr-6">
                    <p className="text-sm font-semibold leading-snug text-ink-soft">
                        <span className="font-bold text-ink">
                            {notification.from?.username ?? "Someone"}
                        </span>{" "}
                        invited you to join{" "}
                        <span className="font-bold text-ink">
                            "{notification.invitation?.timerName ?? "a group timer"}"
                        </span>
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-ink-faint">
                        <Clock3 className="h-3 w-3" aria-hidden="true" />{" "}
                        {timeAgo(notification.createdAt)}
                    </p>

                    {/* Actions / status */}
                    <div className="mt-3">
                        {status === "pending" ? (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => handleResponse("accepted")}
                                    className="press-hard inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-ink bg-progress px-3 py-2 text-xs font-bold text-ink disabled:pointer-events-none disabled:opacity-60"
                                >
                                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                                    {pendingAction === "accepted" ? "Accepting..." : "Accept"}
                                </button>
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => handleResponse("declined")}
                                    className="press-hard inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-ink bg-surface px-3 py-2 text-xs font-bold text-ink-soft disabled:pointer-events-none disabled:opacity-60"
                                >
                                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                                    {pendingAction === "declined" ? "Declining..." : "Decline"}
                                </button>
                            </div>
                        ) : (
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${
                                    status === "accepted"
                                        ? "border-progress bg-progress-tint text-progress-deep"
                                        : "border-alert bg-alert-tint text-alert-deep"
                                }`}
                            >
                                {status === "accepted" ? (
                                    <Check className="h-3 w-3" aria-hidden="true" />
                                ) : (
                                    <X className="h-3 w-3" aria-hidden="true" />
                                )}
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
