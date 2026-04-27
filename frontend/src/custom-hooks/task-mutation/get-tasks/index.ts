import ENDPOINTS from "@/constants/api-endpoints";
import { QUERY_KEYS } from "@/constants/query-keys";
import type { ITask } from "@/pages/Dashboard/dashboard-components/tasks-card/tasks-card-types";
import type { ApiResponse } from "@/types/api-response";
import apiClient from "@/utils/Axios-client";
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner";

type getTodaysTasksApiResponse = ApiResponse<{
    tasks:ITask[] ,
    metaData:{
        date:string , 
        totalTasks:number
    }
}>

const useGetTodaysTasks = (userId:string) => {
    return useQuery({
        queryKey:QUERY_KEYS.TASKS.TODAYS_TASKS(userId) , 
        queryFn:async () => {
            const response = await apiClient.get(ENDPOINTS.TASKS_ENDPOINTS.GET_TODAYS_TASKS);
            if (!response.data) {
                throw Error("Today's tasks not fetched !");
            }
            console.log("This is the response data of getTodaysTask : ",response.data)
            return response.data as getTodaysTasksApiResponse;
        } , 
        enabled:!!userId
        // ? Add suitable refetch interval
        // refetchInterval:
    })
}

export default useGetTodaysTasks;