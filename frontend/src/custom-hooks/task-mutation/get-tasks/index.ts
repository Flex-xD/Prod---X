import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { ITask } from "@/pages/Dashboard/dashboard-components/tasks-card/tasks-card-types";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query"
import { data } from "react-router-dom";
import { toast } from "sonner";

const useGetTodaysTasks = (userId:string) => {
    return useQuery({
        queryKey:[QUERY_KEYS.TASKS.USER(userId)] , 
        queryFn:async () => {
            const response = await apiClient.get(ENDPOINTS.TASKS_ENDPOINTS.GET_TODAYS_TASKS);
            if (!data) {
                return toast.error("Error fetching today's tasks !");
            }
            return response.data as ApiResponse<ITask[]>
        } , 
    })
}

export default useGetTodaysTasks;