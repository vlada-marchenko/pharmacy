import api from "./api";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createProduct = async (shopId: string, data: any) => {
    const res = await api.post(`/shop/${shopId}/product/add`, data)
    return res.data
}

export const getProducts = async (shopId: string) => {
    const res = await api.get(`/shop/${shopId}/product`)
    return res.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const editProduct = async (shopId: string, data: any) => {
    const res = await api.put(`/shop/${shopId}/product/${data.productId}/edit`, data)
    return res.data
}

export const deleteProduct = async (shopId: string, productId: string) => {
    const res = await api.delete(`/shop/${shopId}/product/${productId}/delete`)
    return res.data
}

export const addToShop = async (shopId: string, medicineId: string, price: number) => {
    const res = await api.post(`/shop/${shopId}/product/add`, {medicineId, price})
    return res.data
}
