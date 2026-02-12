const BASE_URL = import.meta.env.VITE_BASE_URL;

const ENDPOINTS = {
    AUTH_ENDPOINTS: {
        REGISTER: `${BASE_URL}/auth/register`,
        LOGIN: `${BASE_URL}/auth/login`,
        GOOGLE_AUTH: `${BASE_URL}/auth/google-auth` , 
        LOGOUT:`${BASE_URL}/auth/logout`
    } , 
    TASKS_ENDPOINTS:{
        CREATE_TASK:"/tasks/create" , 
    }
}

export default ENDPOINTS;