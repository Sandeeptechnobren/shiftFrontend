import axios, { AxiosError } from "axios";

// Create an Axios instance with a configurable base URL
export const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.easycoders.in/projects/shift_backend/public",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add authorization tokens
API.interceptors.request.use(
    (config) => {
        // Get token from localStorage or sessionStorage
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common responses
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                localStorage.removeItem("authToken");
                // You can add redirect logic here if needed
                // window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// Error handler utility
export const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string; error?: string }>;

        // If there's a response from the server
        if (axiosError.response) {
            const errorMessage =
                axiosError.response.data?.message ||
                axiosError.response.data?.error ||
                axiosError.message ||
                "An error occurred";

            return {
                success: false,
                message: errorMessage,
                status: axiosError.response.status,
                data: axiosError.response.data,
            };
        }

        // If there's no response (network error, timeout, etc.)
        if (axiosError.request) {
            return {
                success: false,
                message: "Network error. Please check your connection.",
                status: 0,
            };
        }
    }

    // For non-Axios errors
    return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        status: 0,
    };
};
