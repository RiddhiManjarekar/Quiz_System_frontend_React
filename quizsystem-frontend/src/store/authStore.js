import {create} from 'zustand';

const useAuthStore = create((set) => ({
    userId: localStorage.getItem("userId"),
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
    token: localStorage.getItem("token"),

    login: (data) => {

        localStorage.setItem("userId", data.userId);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        localStorage.setItem("role", data.role);
        localStorage.setItem("token", data.token);

        set({
            userId: data.userId,
            name: data.name,
            email: data.email,
            role: data.role,
            token: data.token,
        });
    },

    logout: () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    set({
        userId: null,
        name: null,
        email: null,
        role: null,
        token: null,
    });
},
}));

export default useAuthStore;