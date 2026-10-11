import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import {
    applyOptimisticDashboardUpdate,
    reconcileDashboardAfterDelay,
    rollbackDashboardOptimisticUpdate,
    type DashboardOptimisticContext,
} from "@/custom-hooks/dashboard/apply-optimistic-activity";
import type { ITask } from "@/pages/Dashboard/dashboard-components/tasks-card/tasks-card-types";
import { userAppStore } from "@/store";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { toast } from "sonner";

type TodaysTasksResponse = ApiResponse<{
    tasks: ITask[];
    metaData: { date: string; totalTasks: number };
}>;

interface MutationContext {
    previousTasks?: TodaysTasksResponse;
    dashboard?: DashboardOptimisticContext;
}

export const useToggleTaskMutation = () => {
    const queryClient = useQueryClient();
    const userId = userAppStore((state) => state.user_id) ?? "";
    const tasksKey = QUERY_KEYS.TASKS.TODAYS_TASKS(userId);

    return useMutation<
        ApiResponse<ITask>,
        Error | AxiosError,
        { taskId: string; isTaskPending: boolean },
        MutationContext
    >({
        mutationFn: async ({ taskId, isTaskPending }) => {
            const endPoint = isTaskPending
                ? ENDPOINTS.TASKS_ENDPOINTS.MARK_TASK_DONE
                : ENDPOINTS.TASKS_ENDPOINTS.MARK_TASK_PENDING;
            const response = await apiClient.post(endPoint, { taskId });
            if (response.data.statusCode !== 200) {
                throw new Error(response.data.message || "Error while updating task's status.");
            }
            return response.data as ApiResponse<ITask>;
        },
        onMutate: async ({ taskId, isTaskPending }) => {
            await queryClient.cancelQueries({ queryKey: tasksKey });
            const previousTasks = queryClient.getQueryData<TodaysTasksResponse>(tasksKey);
            const nextStatus = isTaskPending ? ("done" as const) : ("pending" as const);

            queryClient.setQueryData<TodaysTasksResponse>(tasksKey, (old) =>
                old
                    ? {
                        ...old,
                        data: {
                            ...old.data,
                            tasks: old.data.tasks.map((t) => (t._id === taskId ? { ...t, status: nextStatus } : t)),
                        },
                    }
                    : old
            );

            const dashboard = await applyOptimisticDashboardUpdate(queryClient, userId, {
                tasksCompleted: isTaskPending ? 1 : -1,
            });
            return { previousTasks, dashboard };
        },
        onError: (error, _vars, context) => {
            if (context?.previousTasks) queryClient.setQueryData(tasksKey, context.previousTasks);
            rollbackDashboardOptimisticUpdate(queryClient, userId, context?.dashboard);

            let message = error.message || "Error while updating task's status.";
            if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
                const responseData = (error as AxiosError).response?.data as { message?: string };
                message = responseData?.message || message;
            }
            toast.error(message);
        },
        onSuccess: (data) => {
            toast.success(data.message);
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: tasksKey });
            reconcileDashboardAfterDelay(queryClient, userId);
        },
    });
};