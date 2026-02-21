import api from "./api";

export const getMedicine = async () => {
    const res = await api.get(`/medicine`);
    return res.data
}
