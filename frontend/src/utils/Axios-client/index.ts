import axios from "axios";
const apiClient = axios.create({
    baseURL:import.meta.env.BASE_URL , 
    withCredentials:true 
})


export default apiClient;