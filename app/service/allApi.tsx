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