import { API, handleError } from "./APIutils";

export const login = async (credentials: {
    email?: string;
    username?: string;
    password: string;
}) => {
    try {
        const res = await API.post("/api/signup", credentials);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};



export const otpVerify = async (payload: {
    email: string;
    otp: string;
}) => {
    try {
        const res = await API.post("/api/signup/verify-email", payload);
        console.log('[API] /api/signup/verify-email response:', res.data);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const createPayment = async (payload: {
    email: string;
    otp: string;
    amount: number;
}) => {
    try {
        const res = await API.post("/api/payment/create", payload);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const createAccount = async (payload: {
    email?: string;
    username: string;
    gender: string;
    age_range: string;
    country_code: string;
    password: string;
    photo?: File;
}) => {
    try {
        const formData = new FormData();
        if (payload.email) formData.append("email", payload.email);
        formData.append("username", payload.username);
        formData.append("gender", payload.gender);
        formData.append("age_range", payload.age_range);
        formData.append("country_code", payload.country_code);
        formData.append("password", payload.password);
        if (payload.photo) {
            console.log('[API] Appending photo to FormData:', payload.photo.name, payload.photo.type, payload.photo.size);
            formData.append("image", payload.photo);
        }

        // Log all FormData keys for debugging
        const keys: string[] = [];
        formData.forEach((_, key) => keys.push(key));
        console.log('[API] FormData keys:', keys);

        const res = await API.post("/api/profile", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log('[API] /api/profile response:', res.data);
        return res.data;

    } catch (error: unknown) {
        return handleError(error);
    }
};

export const getCountryList = async (params?: any) => {
    try {
        const res = await API.get(`/api/countries`,
            { params }
        );
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const swiftLogin = async (credentials: {
    email?: string;
    username?: string;
    role?: string;
    password: string;
}) => {
    try {
        const res = await API.post("/api/signin", credentials);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const addNewMessage = async (payload: {
    targetId: number;
    spaceId: number;
    message: string;
}) => {
    try {
        const res = await API.post("/api/messages", payload);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const getAdminDashboard = async () => {
    try {
        const res = await API.get("/api/admin/dashboard");
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const getAllUsers = async () => {
    try {
        const res = await API.get("/api/admin/users?type=all");
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const getUserDetails = async (id: number | string) => {
    try {
        const res = await API.get(`/api/admin/users/${id}`);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const getAllGroups = async () => {
    try {
        const res = await API.get("/api/admin/groups");
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const getGroupMembers = async (groupId: number | string) => {
    try {
        const res = await API.get(`/api/admin/groups/${groupId}/members`);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const getAllPosts = async () => {
    try {
        const res = await API.get("/api/admin/posts");
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const deletePost = async (postId: number | string) => {
    try {
        const res = await API.delete(`/api/admin/posts/${postId}`);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const updateUserStatus = async (userId: number | string, isActive: 0 | 1) => {
    try {
        const res = await API.post(`/api/admin/user/status/${userId}`, {
            account_is_active: isActive,
        });
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const getUnpaidAccess = async () => {
    try {
        const res = await API.get('/api/admin/unpaid-access');
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const addUnpaidAccess = async (payload: { menu_id: number; submenu_id?: number | null }) => {
    try {
        const res = await API.post('/api/admin/unpaid-access/add', payload);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

export const removeUnpaidAccess = async (payload: { id?: number | string, menu_id: number | string, submenu_id?: number | string | null }) => {
    try {
        const res = await API.post(`/api/admin/unpaid-access/remove`, payload);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};

