const BASE_URL = import.meta.env.VITE_BASE_URL;

const ENDPOINTS = {
    AUTH_ENDPOINTS: {
        REGISTER: `${BASE_URL}/auth/register`,
        LOGIN: `${BASE_URL}/auth/login`,
        GOOGLE_AUTH: `${BASE_URL}/auth/google-auth` , 
        LOGOUT:`${BASE_URL}/auth/logout`
    } , 
    TASKS_ENDPOINTS:{
        CREATE_TASK:`${BASE_URL}/task/create`, 
        GET_TODAYS_TASKS:`${BASE_URL}/task/todays-tasks`
    } , 
    USER_ENDPOINTS:{
        USER_DATA:`${BASE_URL}/user/user-data`
    } , 

}

export default ENDPOINTS;