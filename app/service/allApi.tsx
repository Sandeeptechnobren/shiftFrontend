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