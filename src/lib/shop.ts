import api from "./api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createShop = async (data: any) => {
    const res = await api.post('/shop/create', data)
    return {...res.data, shopId: res.data.shopId || res.data._id}
}

export const getShop = async (shopId: string) => {
    const res = await api.get(`/shop/${shopId}`)
    return res.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const editShop = async (data: any) => {
    const res = await api.put(`/shop/${data.shopId}/update`, data)
    return res.data
}

export const deleteShop = async (shopId: string) => {
    const res = await api.delete(`/shop/${shopId}/delete`)
    return res.data
}
