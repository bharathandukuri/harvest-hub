// src/api/api.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // Your Spring Boot backend URL
    headers: {
        'Content-Type': 'application/json',
    },
    // You might add headers for authentication tokens here
    // withCredentials: true, // If you're handling cookies/sessions
});

// Optional: Add request interceptors for auth tokens
axiosInstance.interceptors.request.use(
    (config) => {
        // const token = localStorage.getItem('authToken'); // Example for token
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Add response interceptors for error handling or refreshing tokens
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors, e.g., redirect to login if 401
        // if (error.response && error.response.status === 401) {
        //     // Redirect to login or refresh token
        // }
        return Promise.reject(error);
    }
);

export default axiosInstance;