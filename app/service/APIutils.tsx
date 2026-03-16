import axios, { AxiosError } from "axios";

// Create an Axios instance with a configurable base URL
export const API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.easycoders.in/projects/shift_backend/public",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

/**
 * Token extraction helper to handle various response structures from different endpoints.
 */
export const extractToken = (response: any): string | null => {
    if (!response) return null;

    const token =
        response.token ||
        response.data?.token ||
        response.data?.data?.token ||
        response?.access_token ||
        response.data?.access_token ||
        response.user?.token ||
        response.data?.user?.token;

    if (token && typeof token === 'string' && token !== 'undefined' && token !== 'null') {
        return token;
    }

    return null;
};

/**
 * Role extraction helper to normalize user roles (e.g., "admin" -> "Admin").
 */
export const extractRole = (response: any): string | null => {
    if (!response) return null;

    const role =
        response.role ||
        response.user?.role ||
        response.data?.role ||
        response.data?.user?.role ||
        response.data?.data?.role;

    if (role && typeof role === 'string') {
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    }

    return null;
};

// --- Request Interceptor ---
// Safely adds the Authorization header if a token exists in localStorage (client-side only).
API.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("authToken") || localStorage.getItem("token");

            if (token && token !== 'undefined' && token !== 'null') {
                const cleanToken = token.trim();
                // Ensure proper 'Bearer ' prefixing
                const finalToken = cleanToken.toLowerCase().startsWith('bearer ') 
                    ? `Bearer ${cleanToken.substring(7).trim()}` 
                    : `Bearer ${cleanToken}`;
                
                // Use .set() if available (Axios 1.x), else direct assignment
                if (config.headers && typeof config.headers.set === 'function') {
                    config.headers.set('Authorization', finalToken);
                } else {
                    config.headers['Authorization'] = finalToken;
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// --- Response Interceptor ---
// Handles 401 Unauthorized errors by clearing tokens and optionally redirecting.
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            console.error('[API] 401 Unauthorized - token might be invalid or expired.');
            
            if (typeof window !== "undefined") {
                // Clear authentication data
                localStorage.removeItem("authToken");
                localStorage.removeItem("userRole");
                
                // Optional: Redirect to login if not already there
                if (!window.location.pathname.includes('/login')) {
                    // window.location.href = '/login'; 
                }
            }
        }
        return Promise.reject(error);
    }
);

/**
 * Global error handler utility to normalize error responses.
 */
export const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string; error?: string; data?: any }>;

        if (axiosError.response) {
            const apiData = axiosError.response.data;
            const errorMessage =
                apiData?.message ||
                apiData?.error ||
                (typeof apiData === 'string' ? apiData : null) ||
                axiosError.message ||
                "An error occurred";

            return {
                success: false,
                message: errorMessage,
                status: axiosError.response.status,
                data: apiData,
            };
        }

        if (axiosError.request) {
            return {
                success: false,
                message: "No response from server. Please check your connection.",
                status: 0,
            };
        }
    }

    return {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
        status: 0,
    };
};
