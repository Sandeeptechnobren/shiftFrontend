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
}) => {
    try {
        const res = await API.post("/api/profile", payload);
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
    password: string;
}) => {
    try {
        const res = await API.post("/api/signin", credentials);
        return res.data;
    } catch (error: unknown) {
        return handleError(error);
    }
};