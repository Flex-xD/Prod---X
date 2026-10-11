import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import {
    applyOptimisticDashboardUpdate,
    reconcileDashboardAfterDelay,
    rollbackDashboardOptimisticUpdate,
    type DashboardOptimisticContext,
} from "@/custom-hooks/dashboard/apply-optimistic-activity";
import type { ITask, ITaskData } from "@/pages/Dashboard/dashboard-components/tasks-card/tasks-card-types";
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

const useCreateTaskMutation = (userId: string) => {
    const queryClient = useQueryClient();
    const tasksKey = QUERY_KEYS.TASKS.TODAYS_TASKS(userId);

    return useMutation<ApiResponse<ITaskData>, Error | AxiosError, ITaskData, MutationContext>({
        mutationFn: async ({ title, description }) => {
            if (!userId) throw new Error("userID not defined in createTaskMutation !");
            const response = await apiClient.post(ENDPOINTS.TASKS_ENDPOINTS.CREATE_TASK, { title, description });
            if (!response.data?.success) throw new Error(response.data?.message || "Task creation failed !");
            return response.data as ApiResponse<ITaskData>;
        },
        onMutate: async ({ title, description }) => {
            await queryClient.cancelQueries({ queryKey: tasksKey });
            const previousTasks = queryClient.getQueryData<TodaysTasksResponse>(tasksKey);
            const now = new Date();

            const optimisticTask: ITask = {
                _id: `temp-${Date.now()}`,
                title,
                description,
                author: userId,
                status: "pending",
                createdAt: now,
                updatedAt: now,
            };

            queryClient.setQueryData<TodaysTasksResponse>(tasksKey, (old) =>
                old
                    ? {
                        ...old,
                        data: {
                            ...old.data,
                            tasks: [...old.data.tasks, optimisticTask],
                            metaData: { ...old.data.metaData, totalTasks: old.data.metaData.totalTasks + 1 },
                        },
                    }
                    : old
            );

            const dashboard = await applyOptimisticDashboardUpdate(queryClient, userId, { tasksCreated: 1 });
            return { previousTasks, dashboard };
        },
        onError: (error, _vars, context) => {
            if (context?.previousTasks) queryClient.setQueryData(tasksKey, context.previousTasks);
            rollbackDashboardOptimisticUpdate(queryClient, userId, context?.dashboard);

            let message = error.message || "Task creation failed!";
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

export default useCreateTaskMutation;