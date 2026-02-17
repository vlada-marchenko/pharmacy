import api from "./api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createShop = async (data: any) => {
    const res = await api.post('/shop/create', data)
    return res.data

}
