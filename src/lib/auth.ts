import api from "./api";

export type RegisterRequest = {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export type LoginRequest = {
    email: string;
    password: string;
}

export type User = {
    _id: string,
    name: string,
    email: string,
    phone: string,
    createdAt: Date,
    updatedAt: Date,
    shopId: string
}

export type LoginResponse = {
    token: string;
    user: User;
}


export const register = async (data: RegisterRequest) => {
const res = await api.post<User>('/register', data)
return res.data
}

export const login = async (data: LoginRequest) => {
    const res = await api.post<LoginResponse>('/login', data)
    return res.data
}
