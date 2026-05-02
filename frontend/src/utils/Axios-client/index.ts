import { userAppStore } from "@/store";
import axios from "axios";
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
})

// ? Now I have to test it , 
apiClient.interceptors.request.use((config) => {
    const accessToken = userAppStore.getState().accessToken;
    console.log("Checking for the access-token");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
})

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (originalRequest.url?.includes("/auth/access-token")) {
            return Promise.reject(error);
        }
        if ((error.response?.status === 401 && !originalRequest._retry))
        // || error.response?.message == "jwt expired"
        {
            originalRequest._retry = true;
            try {
                const refreshResponse = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/auth/access-token`,
                    { withCredentials: true });
                const newAccessToken =
                    refreshResponse.data.data.accessToken;
                userAppStore
                    .getState()
                    .setAccessToken(newAccessToken);

                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;

                return apiClient(originalRequest);

            } catch (refreshError) {

                userAppStore
                    .getState()
                    .clearAccessToken();

                    window.location.href = "/auth";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
export default apiClient;