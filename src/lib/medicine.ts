import api from "./api";

export const getMedicine = async () => {
    const res = await api.get(`/medicine`);
    return res.data
}

export const getMedicineById = async (id: string) => {
    const res = await api.get(`/medicine/${id}`);
    return res.data
}
