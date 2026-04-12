import { userAppStore } from "@/store";
import axios from "axios";
const apiClient = axios.create({
    baseURL: import.meta.env.BASE_URL,
    withCredentials: true
})

// ? Now I have to test it , 
apiClient.interceptors.request.use((config) => {
    const accessToken = userAppStore.getState().accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axios.post("/auth/refresh" , {} , {
                    withCredentials:true
                });
                const newAccessToken = refreshResponse.data.data.acccessToken;
                userAppStore.getState().setAccessToken(newAccessToken);
                originalRequest.headers.authorization = `Bearer ${newAccessToken}`; 
                return apiClient(originalRequest);
            } catch (refreshError) {
                userAppStore.getState().clearAccessToken();
                window.location.href = "/auth";
                return Promise.reject(refreshError);
            }
        }
    });

export default apiClient;