import axiosInstance from "./axios";

export const login = (data) => {
    return axiosInstance.post("/auth/login", data);
};

export const register = (data) => {
    return axiosInstance.post("/auth/register", data);
};