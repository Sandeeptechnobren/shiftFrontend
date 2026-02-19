import axios, { AxiosError } from "axios";

// Create an Axios instance with a configurable base URL
export const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.easycoders.in/projects/shift_backend/public",
});

// Token extraction helper to handle various response structures
export const extractToken = (response: any): string | null => {
    if (!response) return null;

    // Check various common paths for the token
    const token =
        response.token ||
        response.data?.token ||
        response.data?.data?.token ||
        response?.access_token ||
        response.data?.access_token ||
        response.user?.token ||
        response.data?.user?.token;

    // Validate that the token is a meaningful string
    if (token && typeof token === 'string' && token !== 'undefined' && token !== 'null') {
        console.log('[API] Extracted token successfully');
        return token;
    }

    console.warn('[API] No valid token found in response:', response);
    return null;
};

// Request interceptor to add authorization tokens
API.interceptors.request.use(
    (config) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

        if (token && token !== 'undefined' && token !== 'null') {
            config.headers.set('Authorization', `Bearer ${token}`);
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url} - Token applied: ${token.substring(0, 10)}...`);
        } else {
            console.warn(`[API Request] ${config.method?.toUpperCase()} ${config.url} - No valid token found in localStorage`);
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
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            console.error('[API Response] 401 Unauthorized Error:', {
                url: error.config?.url,
                method: error.config?.method,
                data: error.response?.data
            });

            if (typeof window !== "undefined") {
                const currentToken = localStorage.getItem("authToken");
                console.log('[API] 401 error with token:', currentToken ? `${currentToken.substring(0, 10)}...` : 'null');

                // DEACTIVATING for now: localStorage.removeItem("authToken");
                // We keep it to avoid breaking the registration flow if a secondary request fails.
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
